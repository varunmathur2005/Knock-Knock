import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the schema for the structured cover letter output
const CoverLetterSchema = z.object({
  aboutMe: z.string(),
  whyCompany: z.string(),
  whyMe: z.string(),
  endLine: z.string(),
});

interface CoverLetterInput {
  geminiSummary: string;
  companyAddress: string;
  skillsCategories: string[];
  experiences: string[];
  projects: string[];
  education: string[];
  otherInfo: string;
}

export const callOpenAIForCoverLetter = async (data: CoverLetterInput) => {
  const {
    geminiSummary,
    companyAddress,
    skillsCategories,
    experiences,
    projects,
    education,
    otherInfo,
  } = data;
  console.log(geminiSummary);

  try {
    // Convert arrays to JSON strings
    const formatedCompanyAddress = JSON.stringify(companyAddress);
    const formattedSkills = JSON.stringify(skillsCategories);
    const formattedExperiences = JSON.stringify(experiences);
    const formattedProjects = JSON.stringify(projects);
    const formattedEducation = JSON.stringify(education);

    // Define the prompt using Gemini content and user details
    const prompt = `
    Craft a concise and professional cover letter for the position, using the below information:

    1. JOB Summary:
    ${geminiSummary}

    2. Company Information:
    ${formatedCompanyAddress}

    3. Candidate Information:
    - Skills Categories: ${formattedSkills}
    - Experiences: ${formattedExperiences}
    - Projects: ${formattedProjects}
    - Education: ${formattedEducation}
    - Other Information: ${otherInfo}

    Instructions:
    a). The generated text will be added to a latex document, so ensure the following:
        - Add backslash before %, & signs
    a) Use the following sections without repeating the section titles in the paragraphs:
        - aboutMe: Introduce the candidate, highlighting background and key qualifications.
        - whyCompany: Explain why the candidate is excited to join this company, using information from the JOB Summary.
        - whyMe: Describe why the candidate is a great fit for the role, focusing on skills, experience, and qualifications.
        
    b) Bold any technical and soft skills in the cover letter that match those mentioned in the JOB Summary using LaTeX syntax and ensuring proper spacing, use: '\\textbf{insert skill here}'.

    `;




    // Call OpenAI with structured output format
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "You are an AI tasked with crafting world-class cover letters. Ensure that the cover letters are professional, engaging, and tailored to the specific company.",
        },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(CoverLetterSchema, "cover_letter"),
    });

    // Return the structured cover letter
    console.log(completion.choices[0].message.parsed);
    return completion.choices[0].message.parsed;
  } catch (error) {
    console.error("Error generating cover letter with OpenAI: ", error);
    throw new Error("Failed to generate cover letter.");
  }
};
