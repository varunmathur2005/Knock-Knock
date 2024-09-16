import { NextRequest, NextResponse } from "next/server";
import { generateGeminiContent } from "./gemini";
import mysql, { RowDataPacket } from "mysql2/promise";
import { callOpenAIForCoverLetter } from "./openai";
import { updateLatexFile } from "./utils/latexUtils";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

interface UserData extends RowDataPacket {
  id: number;
  skills_categories: string;
  experiences: string;
  projects: string;
  education: string;
  other_info: string;
}

const createDbConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};

const safeParse = (data: any) => {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return data;
  }
};

// Fetch user-specific data
export async function GET(request: NextRequest) {
  try {
    const connection = await createDbConnection();
    const query = "SELECT * FROM user_data ORDER BY id DESC LIMIT 1";
    const [rows] = await connection.execute<UserData[]>(query);
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No user data found." },
        { status: 404 }
      );
    }

    const userData = rows[0];
    return NextResponse.json({
      skillsCategories: safeParse(userData.skills_categories),
      experiences: safeParse(userData.experiences),
      projects: safeParse(userData.projects),
      education: safeParse(userData.education),
      otherInfo: userData.other_info,
    });
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return NextResponse.json(
      { error: "Failed to fetch user data." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const {
    companyName,
    position,
    companyAddress,
    jobDescription,
    jobResponsibilities,
    requiredSkills,
    skillsCategories,
    experiences,
    projects,
    education,
    otherInfo,
  } = await request.json();

  try {
    const geminiResponse = await generateGeminiContent(
      companyName,
      position,
      jobDescription,
      jobResponsibilities,
      requiredSkills
    );

    const coverLetter = await callOpenAIForCoverLetter({
      geminiSummary: geminiResponse,
      companyAddress,
      skillsCategories,
      experiences,
      projects,
      education,
      otherInfo,
    });

    if (!coverLetter) {
      console.error("Cover letter generation failed. Cover letter is null.");
      return NextResponse.json(
        { error: "Failed to generate cover letter." },
        { status: 500 }
      );
    }

    if (!coverLetter.aboutMe || !coverLetter.whyCompany || !coverLetter.whyMe) {
      console.error("Incomplete cover letter content.");
      return NextResponse.json(
        { error: "Incomplete cover letter content." },
        { status: 500 }
      );
    }

    const connection = await createDbConnection();
    const query = `
      INSERT INTO user_data (
        skills_categories, experiences, projects, education, other_info
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [
      JSON.stringify(skillsCategories),
      JSON.stringify(experiences),
      JSON.stringify(projects),
      JSON.stringify(education),
      otherInfo,
    ]);

    await connection.end();

    await updateLatexFile(
      coverLetter.aboutMe,
      coverLetter.whyCompany,
      coverLetter.whyMe,
      companyName,
      companyAddress,
      position
    );

    const overleafURL = `https://www.overleaf.com/project/66dc65943da5ccee4310cdb9`;

    return NextResponse.json({
      message:
        "Cover letter generated successfully. Redirecting to Overleaf...",
      coverLetter,
      overleafURL,
    });
  } catch (error) {
    console.error("Error saving data: ", error);
    return NextResponse.json(
      { error: "Failed to save data." },
      { status: 500 }
    );
  }
}
