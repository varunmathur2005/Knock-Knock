import { Heading } from "@/components/heading";
import { Leaf } from "lucide-react";


const Generate = () => {
    return (
      <Heading
        title="Resume and Cover Letter generation"
        description="Resume and Cover Letter generation"
        icon={Leaf}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
    );
}

export default Generate;