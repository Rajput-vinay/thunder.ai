"use client";

import { Button } from "../components/ui/button";
import { userDetailsContext } from "../context/userDetailsContext";
import Colors from "../data/Colors";
import Image from "next/image";
import { useContext, useState } from "react";
import { ActionContext } from "../context/ActionContext";
import { useSidebar } from "../components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { LucideDownload, Rocket, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SignInDialog from "./SigninDialog";

function Header() {
  const { userDetails, setUserDetails } = useContext(userDetailsContext);
  const { action, setAction } = useContext(ActionContext);
  const [openDialog, setOpenDialog] = useState(false);
  const path = usePathname();
  const router = useRouter();

  const onActionBtn = (actionType) => {
    setAction({
      actionType,
      timeStamp: Date.now(),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserDetails(null);
    router.push("/");
  };

  return (
    <div className="p-4 flex justify-between items-center ">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </Link>

      {!userDetails?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost" onClick={() => setOpenDialog(true)}>
            Sign In
          </Button>
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            Get Started
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {path?.includes("workspace") && (
            <>
              <Button variant="ghost" onClick={() => onActionBtn("export")}>
                <LucideDownload className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => onActionBtn("deploy")}
              >
                <Rocket className="mr-2 h-4 w-4" />
                Deploy
              </Button>
             
            </>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            title="Log out"
            className="text-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}

      {/* Sign In Dialog Mount */}
      <SignInDialog
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
      />
    </div>
  );
}

export default Header;
