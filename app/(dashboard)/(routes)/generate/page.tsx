"use client";

import { useState, useEffect } from "react";
import { Heading } from "@/components/heading";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";

const Generate = () => {
  // State management for all form fields
  const [companyAddress, setCompanyAddress] = useState(""); // New state for company address
  const [companyName, setCompanyName] = useState(""); // New state for company name
  const [position, setPosition] = useState(""); // New state for position
  const [jobDescription, setJobDescription] = useState(""); // Job description state
  const [jobResponsibilities, setJobResponsibilities] = useState(""); // Job responsibilities state
  const [requiredSkills, setRequiredSkills] = useState(""); // Required skills state
  const [skillsCategories, setSkillsCategories] = useState([
    { category: "", skills: "" }, // Initial state for skill categories
  ]);
  const [experiences, setExperiences] = useState([
    { companyName: "", position: "", description: "" }, // Initial state for experience
  ]);
  const [projects, setProjects] = useState([
    { projectName: "", technicalSkills: "", description: "" }, // Initial state for projects
  ]);
  const [education, setEducation] = useState([
    { degree: "", institution: "" }, // Initial state for education
  ]);
  const [otherInfo, setOtherInfo] = useState(""); // State for other information
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const { toast } = useToast(); // Toast notification handler

  // Fetch saved data when the component mounts
  useEffect(() => {
    axios.get("/api/generate").then((response) => {
      const data = response.data;
      if (data) {
        // Populate form fields with fetched data or default to initial state
        setSkillsCategories(
          data.skillsCategories || [{ category: "", skills: "" }]
        );
        setExperiences(
          data.experiences || [
            { companyName: "", position: "", description: "" },
          ]
        );
        setProjects(
          data.projects || [
            { projectName: "", technicalSkills: "", description: "" },
          ]
        );
        setEducation(data.education || [{ degree: "", institution: "" }]);
        setOtherInfo(data.otherInfo || "");
      }
    });
  }, []);

  // Function to add a new skill category
  const handleAddSkillCategory = () => {
    setSkillsCategories([...skillsCategories, { category: "", skills: "" }]);
  };

  // Function to remove a skill category by index
  const handleRemoveSkillCategory = (index: number) => {
    setSkillsCategories(skillsCategories.filter((_, i) => i !== index));
  };

  // Function to add a new experience
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { companyName: "", position: "", description: "" },
    ]);
  };

  // Function to remove an experience by index
  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // Function to add a new project
  const handleAddProject = () => {
    setProjects([
      ...projects,
      { projectName: "", technicalSkills: "", description: "" },
    ]);
  };

  // Function to remove a project by index
  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Function to add a new education entry
  const handleAddEducation = () => {
    setEducation([...education, { degree: "", institution: "" }]);
  };

  // Function to remove an education entry by index
  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Send a POST request to save data and get Gemini's response
      const response = await axios.post("/api/generate", {
        companyName, // Include company name
        position, // Include position
        companyAddress,
        jobDescription,
        jobResponsibilities,
        requiredSkills,
        skillsCategories,
        experiences,
        projects,
        education,
        otherInfo,
      });

      setLoading(false);

      toast({
        title: "Data Saved",
        description: "Your data has been saved successfully!",
        variant: "default",
      });

      // Display Gemini's response
      console.log("Gemini Response: ", response.data.geminiResponse);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Save Failed",
        description: "Failed to save the data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col items-center">
        {/* Header Section */}
        <Heading
          title="Cover Letter Generation"
          description="Tailor your Cover letter for specific job applications"
          icon={Leaf}
          iconColor="text-green-700"
          bgColor="bg-green-700/10"
        />

        <div className="mt-8 w-full max-w-2xl">
          {/* Job Details Section */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-medium">Job Details</h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <Input
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <Textarea
                placeholder="Job Description (Optional)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="h-24"
              />
              <Textarea
                placeholder="Job Responsibilities"
                value={jobResponsibilities}
                onChange={(e) => setJobResponsibilities(e.target.value)}
                className="h-24"
              />
              <Textarea
                placeholder="Required Skills"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="h-24"
              />
              <Input
                placeholder="Company Address (Optional)"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-medium">Education</h3>
            </CardHeader>
            <CardContent>
              {education.map((edu, index) => (
                <div key={index} className="flex flex-col gap-4 mb-4">
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      setEducation(
                        education.map((item, i) =>
                          i === index
                            ? { ...item, degree: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <Input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) =>
                      setEducation(
                        education.map((item, i) =>
                          i === index
                            ? { ...item, institution: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveEducation(index)}
                  >
                    Remove Education
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddEducation}>
                Add Education
              </Button>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-medium">Skills</h3>
            </CardHeader>
            <CardContent>
              {skillsCategories.map((skillCategory, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 mb-4"
                >
                  <Input
                    placeholder="Category (e.g., Languages, Frameworks)"
                    value={skillCategory.category}
                    onChange={(e) =>
                      setSkillsCategories(
                        skillsCategories.map((item, i) =>
                          i === index
                            ? { ...item, category: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <Textarea
                    placeholder="Skills (e.g., JavaScript, React)"
                    value={skillCategory.skills}
                    onChange={(e) =>
                      setSkillsCategories(
                        skillsCategories.map((item, i) =>
                          i === index
                            ? { ...item, skills: e.target.value }
                            : item
                        )
                      )
                    }
                    className="h-24"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveSkillCategory(index)}
                  >
                    Remove Skills Category
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddSkillCategory}>
                Add Skill Category
              </Button>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-medium">Experience</h3>
            </CardHeader>
            <CardContent>
              {experiences.map((experience, index) => (
                <div key={index} className="flex flex-col gap-4 mb-4">
                  <Input
                    placeholder="Company Name"
                    value={experience.companyName}
                    onChange={(e) =>
                      setExperiences(
                        experiences.map((item, i) =>
                          i === index
                            ? { ...item, companyName: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <Input
                    placeholder="Position"
                    value={experience.position}
                    onChange={(e) =>
                      setExperiences(
                        experiences.map((item, i) =>
                          i === index
                            ? { ...item, position: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <Textarea
                    placeholder="Description"
                    value={experience.description}
                    onChange={(e) =>
                      setExperiences(
                        experiences.map((item, i) =>
                          i === index
                            ? { ...item, description: e.target.value }
                            : item
                        )
                      )
                    }
                    className="h-24"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveExperience(index)}
                  >
                    Remove Experience
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddExperience}>
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-medium">Projects</h3>
            </CardHeader>
            <CardContent>
              {projects.map((project, index) => (
                <div key={index} className="flex flex-col gap-4 mb-4">
                  <Input
                    placeholder="Project Name"
                    value={project.projectName}
                    onChange={(e) =>
                      setProjects(
                        projects.map((item, i) =>
                          i === index
                            ? { ...item, projectName: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <Input
                    placeholder="Technical Skills"
                    value={project.technicalSkills}
                    onChange={(e) =>
                      setProjects(
                        projects.map((item, i) =>
                          i === index
                            ? { ...item, technicalSkills: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  <Textarea
                    placeholder="Description"
                    value={project.description}
                    onChange={(e) =>
                      setProjects(
                        projects.map((item, i) =>
                          i === index
                            ? { ...item, description: e.target.value }
                            : item
                        )
                      )
                    }
                    className="h-24"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveProject(index)}
                  >
                    Remove Project
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddProject}>
                Add Project
              </Button>
            </CardContent>
          </Card>

          {/* Other Information Section */}
          <Card className="mb-8">
            <CardHeader>
              <h3 className="text-lg font-medium">Other Information</h3>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any other relevant information"
                value={otherInfo}
                onChange={(e) => setOtherInfo(e.target.value)}
                className="h-24"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Save Information"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Generate;
