import fs from "fs";
import path from "path";

export const updateLatexFile = (
  aboutMe: string,
  whyCompany: string,
  whyMe: string,
  companyName: string,
  companyAddress: string,
  jobPosition: string
) => {
  // Define the path to the existing LaTeX template (coverletter.tex)
  const templatePath = path.join(process.cwd(), "app/latex", "coverletter.tex");

  // Read the cover letter template
  let latexContent: string;

  try {
    latexContent = fs.readFileSync(templatePath, "utf-8");
  } catch (error) {
    console.error("Error reading LaTeX template:", error);
    throw new Error("Failed to read LaTeX template file.");
  }

  // Replace placeholders in the header with the provided values
  try {
    latexContent = latexContent.replace(
      /\\recipient\s*\{[^}]*\}\s*\{[^}]*\}/,
      `\\recipient{${companyName || ""}}{${(companyAddress || "").replace(
        "\\",
        "\\\\"
      )}}`
    );

    latexContent = latexContent.replace(
      /\\lettertitle\{[^}]*\}/,
      `\\lettertitle{Job Application for ${jobPosition || ""}}`
    );

    latexContent = latexContent.replace(
      /\\letteropening\{[^}]*\}/,
      `\\letteropening{Dear Hiring Manager,}`
    );

    latexContent = latexContent.replace(
      /\\letterclosing\{[^}]*\}/,
      `\\letterclosing{Sincerely,}`
    );
  } catch (error) {
    console.error("Error replacing header placeholders:", error);
    throw new Error("Failed to replace header placeholders in LaTeX content.");
  }

  // Replace placeholders in the body sections of the LaTeX file
  try {
    // Replace the "About Me" section
    latexContent = latexContent.replace(
      /\\lettersection\{About Me\}\s*\[Replace text\]/g,
      `\\lettersection{About Me}\n${aboutMe || ""}`
    );

    // Replace the "Why Company?" section with the exact match
    latexContent = latexContent.replace(
      /\\lettersection\{Why Company\?\}\s*\[Replace text\]/g,
      `\\lettersection{Why ${companyName || "Company"}?}\n${whyCompany || ""}`
    );

    // Replace the "Why Me?" section
    latexContent = latexContent.replace(
      /\\lettersection\{Why Me\?\}\s*\[Replace text\]/g,
      `\\lettersection{Why Me?}\n${whyMe || ""}`
    );
  } catch (error) {
    console.error("Error replacing body placeholders:", error);
    throw new Error("Failed to replace body placeholders in LaTeX content.");
  }

  // Define the output path for the generated LaTeX file in the `app/latex` directory
  const outputPath = path.join(
    process.cwd(),
    "app/latex",
    `${companyName}_coverletter.tex`
  );

  // Write the modified LaTeX content to the specified output path
  try {
    fs.writeFileSync(outputPath, latexContent, "utf-8");
    console.log("LaTeX file generated successfully:", outputPath);
  } catch (error) {
    console.error("Error writing LaTeX file:", error);
    throw new Error("Failed to write updated LaTeX file.");
  }

  return outputPath; // Return the path of the generated file
};
