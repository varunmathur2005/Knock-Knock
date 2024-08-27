import { NextRequest, NextResponse } from "next/server"; // Importing types for handling requests and responses in Next.js API routes
import fs from "fs"; // Importing the file system module for file operations
import path from "path"; // Importing the path module for handling file and directory paths
import { exec } from "child_process"; // Importing exec to run shell commands
import { promisify } from "util"; // Importing promisify to convert callback-based functions to return promises

const execAsync = promisify(exec); // Creating a promisified version of exec for using async/await

// API route handler for POST requests
export async function POST(req: NextRequest) {
  try {
    // Extract the file name and content from the incoming request
    const { fileName, fileContent } = await req.json();

    // Check if fileName and fileContent are provided
    if (!fileName || !fileContent) {
      return NextResponse.json(
        { success: false, error: "File name or content is missing." },
        { status: 400 }
      );
    }

    // Convert the base64-encoded file content to a buffer
    const buffer = Buffer.from(fileContent, "base64");

    // Define the directory where uploaded files will be stored
    const uploadDir = path.join(process.cwd(), "uploads");

    // Create the directory if it does not exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Define the path where the uploaded file will be saved
    const filePath = path.join(uploadDir, fileName);

    // Write the buffer to the file
    fs.writeFileSync(filePath, buffer);

    // Path to the Python script that will process the CSV file
    const pythonScriptPath = path.join(
      process.cwd(),
      "scripts",
      "process_csv.py"
    );

    // Construct the command to run the Python script with the CSV file path as an argument
    const command = `python3 ${pythonScriptPath} ${filePath}`;

    // Execute the command and capture the output and error
    const { stdout, stderr } = await execAsync(command);

    // If there's any error output from the Python script, log it and return an error response
    if (stderr) {
      console.error(`Error executing Python script: ${stderr}`);
      return NextResponse.json(
        { success: false, error: stderr },
        { status: 500 }
      );
    }

    // Log the output from the Python script and return a success response
    console.log(`Python script output: ${stdout}`);
    return NextResponse.json({
      success: true,
      message: "Emails sent successfully!",
    });
  } catch (error) {
    // Log any errors that occur during the request processing
    console.error("Error processing request:", error);

    // Handle errors based on their type
    if (error instanceof Error) {
      // If the error is an instance of Error, return its message
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    } else {
      // For non-Error objects, return a generic error message
      return NextResponse.json(
        { success: false, error: "An unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
