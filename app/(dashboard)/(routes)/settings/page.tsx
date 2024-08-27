import { Heading } from "@/components/heading";
import { Settings } from "lucide-react";

const Setting = () => {
  return (
    <Heading
      title="Settings"
      description="User Details"
      icon={Settings}
      iconColor="text-grey-700"
      bgColor="bg-grey-700/10"
    />
  );
};

export default Setting;
