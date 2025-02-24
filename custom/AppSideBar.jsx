import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../components/ui/sidebar";
import { Button } from "../components/ui/button";
import { MessageCircleCode } from "lucide-react";
import WorkspaceHistory from "./Workspace"
import SideBarFooter from "./SideBarFooter"
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <Image src={"/logo.png"} width={30} height={30} />
        <Button className="mt-5">
          <MessageCircleCode />
          Start New
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-5">
        
        <SidebarGroup />
        <WorkspaceHistory />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter >
        <SideBarFooter />
        </SidebarFooter>
      
    </Sidebar>
  );
}
