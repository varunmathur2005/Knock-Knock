"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Leaf, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Cold Emailing", // corrected from "lable" to "label"
    icon: Mail,
    color: "text-violet-500",
    bgColor: "text-violet-500/10",
    href: "/email",
  },
  {
    label: "Resume & Cover Letter Generation", // corrected from "lable" to "label"
    icon: Leaf,
    color: "text-emerald-500",
    bgColor: "text-emerald-500/10",
    href: "/generate",
  },
];

const DashboardPage = () => {
  const router = useRouter();

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Lorem ipsum dolor sit amet consectetur
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia ad
          quo placeat amet architecto aperiam cupiditate similique iste quaerat
          vitae soluta minima in tempora labore fugiat, officia eos repellat!
          Laudantium!
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)} 
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-2">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
