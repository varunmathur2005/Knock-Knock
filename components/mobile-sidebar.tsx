"use client"

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

const MobileSidebar = () => {
    // Fixing hydration errors
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null;
    }
    return (
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0">
            <Sidebar />
        </SheetContent>
      </Sheet>
    );
}

export default MobileSidebar;

/* Complete Flow:
Initial Render:

isMounted is set to false.
The component renders nothing because if (!isMounted) { return null; }.
Component Mounting:

useEffect runs after the first render.
setIsMounted(true) is called, updating isMounted to true.
Subsequent Renders:

Now that isMounted is true, the component renders the Sheet and its children (SheetTrigger and SheetContent).
*/