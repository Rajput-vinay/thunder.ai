'use client'
import { Button } from "../components/ui/button";
import { userDetailsContext } from "../context/userDetailsContext";
import Colors from "../data/Colors";
import Image from "next/image";
import { useContext } from "react";
import { ActionContext } from "../context/ActionContext";
import { useSidebar } from "../components/ui/sidebar";
import { usePathname } from "next/navigation";
import { LucideDownload, Rocket } from "lucide-react";
import Link from "next/link";

function Header() {
  const { userDetails } = useContext(userDetailsContext);
  const { action, setAction } = useContext(ActionContext);

  const path = usePathname();

  const onActionBtn = (actionType) => {
    setAction({
      actionType,
      timeStamp: Date.now(),
    });
  };

  return (
    <div className="p-4 flex justify-between items-center">
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
      </Link>

      {!userDetails?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button className="bg-blue-500 text-white hover:bg-blue-600">Get Started</Button>
        </div>
      ) : (
        path?.includes("workspace") && (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onActionBtn("export")} aria-label="Export">
              <LucideDownload />
              Export
            </Button>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => onActionBtn("deploy")}
              aria-label="Deploy"
            >
              <Rocket />
              Deploy
            </Button>
           
          </div>
        )
      )}
    </div>
  );
}

export default Header;
