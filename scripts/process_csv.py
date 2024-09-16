import csv
import os
import sys
import mysql.connector
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import smtplib
from email.message import EmailMessage
from email.utils import formataddr
import logging

# Load environment variables from the .env file
load_dotenv()

# Initialize the OpenAI client with the API key from the environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Configuration for sending emails
PORT = 587
EMAIL_SERVER = "smtp-mail.outlook.com"  # For Outlook
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
APP_PASSWORD = os.getenv("APP_PASSWORD")  # Use the app password here

# Replace these values with your MySQL server information
host = os.getenv("DB_HOST")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
database = os.getenv("DB_NAME")


# Validate configuration
if not SENDER_EMAIL or not APP_PASSWORD:
    logging.error("Missing required email configuration in environment variables.")
    sys.exit(1)

# Pydantic model to represent the structured email content

class EmailContent(BaseModel):
    subject: str = Field(
        description="Create an innovative, fun, and formal email subject line for requesting an internship at [Company Name]. The subject line should be personalized and cleverly incorporate the unique aspects of their brand."
    )
    greeting: str = Field(description="Hello [Recipient’s Name]")
    paragraph1: str = Field(description="First paragraph of email")
    paragraph2: str = Field(description="Second paragraph of email")
    paragraph3: str = Field(description="Third paragraph of email")
    paragraph4: str = Field(description="Forth paragraph of email")


def generate_custom_email(company, industry):
    try:
        response = client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI tasked with crafting world-class cold emails. Ensure that the email is professional, engaging, and tailored to the specific company. Highlight specific initiatives and products of the company to showcase genuine interest based on research.",
                },
                {
                    "role": "user",
                    "content": f"""Compose a professional and engaging cold email to request an internship at {company} in the {industry}. The email should be personalized, showcasing genuine interest in the company and its work. Include the following elements:
                    1. A personalized greeting
                    2. A compelling expression of interest in the company, referencing specific initiatives, achievements, or products that demonstrate thorough research.
                    3. A brief introduction of the applicant, including their current educational background (Computer Science at the University of Waterloo)
                    4. A mention of the applicant's relevant skills and experiences that align with the company's goals and values.
                    5. A reference to the attached resume and a polite suggestion for a follow-up conversation, such as a virtual coffee chat to discuss potential contributions.
                    6. A courteous and optimistic closing, emphasizing eagerness for the opportunity to discuss further.
                    7. Do not repeat same information, add extra characters and keep the below Calendly link.
                    8. The text surrounded with <strong> </strong> in the structure must be bold (Can be found in paragraph 1 and 3).

                    Use the following example for tone and structure strictly:

                    greeting : Hello [Recipient’s Name],
                    paragraph1 : [I was excited to learn about [Company's] recent [specific achievement or project], and I am writing to express my <strong>interest in an internship opportunity</strong> with your team. As a <strong>Computer Science student at the University of Waterloo</strong>, I am passionate about [Company's] innovative work in [specific area], particularly [specific initiative or product].]

                    paragraph2: [Your commitment to [Company's mission or values] resonates with me. I am particularly impressed by [specific product/service]. I would love to contribute to [Company's] mission by leveraging my skills in web development, Python, C/C++ , AI/ML, QA, and testing.]

                    paragraph3: [<strong>Attached is my resume for your consideration. I’d love to grab a virtual coffee and discuss how I can add value to your team. You can easily schedule a time that works for you via this link: https://calendly.com/varunmathur2005/30min.</strong>]

                    paragraph4: [Thank you so much for considering my application. I am looking forward to the opportunity to discuss this further!]
                    """,
                },
            ],
            temperature=1,
            max_tokens=890,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            response_format=EmailContent,  # Use the Pydantic model
        )
        return response.choices[0].message.parsed
    except Exception as e:
        logging.error(f"Error generating custom email: {e}")
        raise


# Function to send the personalized email
def send_email(subject, receiver_email, greeting, body, html_body, resume_path):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr(("Varun Mathur", SENDER_EMAIL))
    msg["To"] = receiver_email
    msg.set_content(f"{greeting}\n\n{body}")

    msg.add_alternative(
        f"""\
        <html>
          <body>
            <p>{greeting}</p>
            <p>{html_body}</p>
          </body>
        </html>
        """,
        subtype="html",
    )

    with open(resume_path, "rb") as resume_file:
        resume_data = resume_file.read()
        msg.add_attachment(
            resume_data,
            maintype="application",
            subtype="pdf",
            filename=os.path.basename(resume_path),
        )

    try:
        with smtplib.SMTP(EMAIL_SERVER, PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.send_message(msg)
            logging.info(f"Email sent to {receiver_email}.")
    except Exception as e:
        logging.error(f"Failed to send email to {receiver_email}: {e}")
        raise


# Static signature
SIGNATURE = """\
Best regards,
Varun Mathur
+14376625443
University of Waterloo
200 University Avenue West, Waterloo, Ontario N2L 3G1, CA
"""


def process_and_send_email(
    recipient_email, recipient_name, email_content: EmailContent, resume_path
):
    personalized_email = email_content.model_dump()  # Convert to a dictionary
    # Ensure placeholder replacement
    placeholders = [
        "[Recipient’s Name]",
        "[Recipient's Name]",
    ]  # Include both types of quotation marks

    for placeholder in placeholders:
        personalized_email["greeting"] = personalized_email["greeting"].replace(
            placeholder, recipient_name
        )

    # Construct the plain text body and append the static signature
    body = "\n\n".join(
        [
            personalized_email["paragraph1"],
            personalized_email["paragraph2"],
            personalized_email["paragraph3"],
            personalized_email["paragraph4"],
            SIGNATURE,  # Append static signature
        ]
    )

    # Construct the HTML body with <br> tags for line breaks and append the signature
    html_body = "<br><br>".join(
        [
            personalized_email["paragraph1"],
            personalized_email["paragraph2"],
            personalized_email["paragraph3"],
            personalized_email["paragraph4"],
            SIGNATURE.replace("\n", "<br>"),  # Append static signature
        ]
    )

    send_email(
        subject=personalized_email["subject"],
        receiver_email=recipient_email,
        greeting=personalized_email["greeting"],
        body=body,
        html_body=html_body,
        resume_path=resume_path,
    )


# Get the filename from the command-line arguments
if len(sys.argv) < 2:
    print("No filename provided.")
    sys.exit(1)

filename = sys.argv[1]
csv_file_path = os.path.join("/Users/varunmathur/Desktop/Apollo-WS", filename)
resume_path = "/Users/varunmathur/Desktop/admin_dashboard/knock-knock/user_files/Varun_Resume.pdf"


# Establish a connection to the MySQL server
try:
    conn = mysql.connector.connect(
        host=host, user=user, password=password, database=database
    )

    if conn.is_connected():
        print("Connection established...")

        cursor = conn.cursor()

        # Create the companies table if it doesn't exist
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS companies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                company_name VARCHAR(255) UNIQUE,
                custom_company_email TEXT
            );
            """
        )

        # Create the employees table if it doesn't exist
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                company_id INT,
                employee_name VARCHAR(255),
                email VARCHAR(255),
                job_title VARCHAR(255),
                FOREIGN KEY (company_id) REFERENCES companies(id)
            );
            """
        )

        # Dictionary to store the data
        # This dictionary is of the form {company: employee1, employee2..}
        company_employees = {}

        # Read and process the CSV file
        with open(csv_file_path, mode="r", encoding="utf-8-sig") as file:
            csv_reader = csv.DictReader(file)

            for row in csv_reader:
                # Check if the email is present
                if row.get("Email"):
                    company = row["Company"]
                    industry = row["Industry"]
                    employee = {
                        "First Name": row["First Name"],
                        "Last Name": row["Last Name"],
                        "Email": row["Email"],
                        "Job Title": row["Title"],
                    }
                    if company in company_employees:
                        company_employees[company].append(employee)
                    else:
                        company_employees[company] = [employee]

        # Iterate over the dictionary
        for company, employees in company_employees.items():
            # Check if the company already exists in the database
            cursor.execute(
                "SELECT id FROM companies WHERE company_name = %s", (company,)
            )
            company_id = cursor.fetchone()

            if company_id is None:
                # Insert the company into the companies table
                cursor.execute(
                    "INSERT INTO companies (company_name) VALUES (%s)", (company,)
                )
                conn.commit()
                company_id = cursor.lastrowid
            else:
                company_id = company_id[0]
            for employee in employees:
                employee_name = f"{employee['First Name']} {employee['Last Name']}"
                email = employee["Email"]
                job_title = employee["Job Title"]

                # Check if the employee already exists in the database
                cursor.execute("SELECT id FROM employees WHERE email = %s", (email,))
                employee_id = cursor.fetchone()

                if employee_id is None:
                    # Insert the employee into the employees table
                    cursor.execute(
                        "INSERT INTO employees (company_id, employee_name, email, job_title) VALUES (%s, %s, %s, %s)",
                        (company_id, employee_name, email, job_title),
                    )
                    conn.commit()

                # Generate custom email content
                email_content = generate_custom_email(company, industry)

                # Process and send the email to each employee
                process_and_send_email(
                    recipient_email=email,
                    recipient_name=employee_name,
                    email_content=email_content,
                    resume_path=resume_path,
                )

                print(f"Email sent to {employee_name} at {email}.")

        cursor.close()
    else:
        print("Failed to establish connection.")

except mysql.connector.Error as err:
    print(f"Error: {err}")

finally:
    if conn.is_connected():
        conn.close()
        print("Connection closed.")
