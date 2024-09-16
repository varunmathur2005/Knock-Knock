"use client";

import { Heading } from "@/components/heading";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"; 
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Email = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false); // State to track uploading status
  const { toast } = useToast(); // Initialize shadcn UI toast

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      toast({
        title: "File Uploaded",
        description: "File has been uploaded successfully.",
        variant: "default", // Use "default" for success messages
      }); // Notify once file is selected
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true); // Set uploading to true when the process starts

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64data = reader.result?.toString().split(",")[1];

      const response = await fetch("/api/upload-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileContent: base64data,
        }),
      });

      setUploading(false); // Set uploading to false when the process ends

      if (response.ok) {
        toast({
          title: "Emails Sent",
          description: "Emails have been sent successfully!",
          variant: "default", // Use "default" for success messages
        }); // Notify that emails are sent
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload the file.",
          variant: "destructive",
        });
      }
    };
  };

  return (
    <div className="flex flex-col items-center p-8">
      <Heading
        title="Cold Emailing"
        description="Start sending cold emails..."
        icon={Mail}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />

      <Card className="mt-8 w-full max-w-lg">
        <CardHeader>
          <h2 className="text-lg font-medium">Upload Your File</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              placeholder="Click here to choose your file"
            />
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || uploading}
              className="w-full"
            >
              {uploading ? "Sending emails..." : "Upload and Send Emails"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Email;
