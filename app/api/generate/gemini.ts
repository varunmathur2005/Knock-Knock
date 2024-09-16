import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Define a function to generate content using Gemini API
export const generateGeminiContent = async (
  companyName: string,
  position: string,
  jobDescription: string,
  jobResponsibilities: string,
  requiredSkills: string
) => {
  try {
    // Prepare the prompt with job details
    const prompt = `Extract and summarize the most important information from the job description, responsibilities, and skills provided for ${companyName}. Your goal is to deliver a concise summary that highlights key points for crafting a cover letter.
     Keep the response short and to the point, focusing only on the most critical elements.

Focus Areas (Keep responses brief):
- Hard Skills: List key technical skills (e.g., programming languages, tools).
- Soft Skills: Identify essential soft skills (e.g., teamwork, communication).
- Key Projects/Responsibilities: Note major tasks or project areas.
- Company Values/Culture: Highlight relevant values or culture points.
- Experience Requirements: Specify experience levels or types.
- Role Objectives: Briefly mention primary goals or metrics of the role.

Output Requirements:
- Summarize each point in one line or less, focusing on essential details.
- Ensure the response is concise and directly relevant.
- Offer any insights or suggestions on what the candidate should focus on when crafting their cover letter.


Position: ${position}
Job Description: ${jobDescription}
Job Responsibilities: ${jobResponsibilities}
Required Skills: ${requiredSkills}`;

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the prompt
    const result = await model.generateContent(prompt);

    // Return the generated text
    return result.response.text();
  } catch (error) {
    console.error("Error generating content with Gemini: ", error);
    throw new Error("Failed to generate content.");
  }
};
