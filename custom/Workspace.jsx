'use client'
import { useContext, useEffect, useState } from "react";
import { userDetailsContext } from "../context/userDetailsContext";
import { useConvex } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import { useSidebar } from "../components/ui/sidebar";

function WorkspaceHistory() {
  const { userDetails } = useContext(userDetailsContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState([]);
  const {toggleSidebar} = useSidebar()
  useEffect(() => {
    if (userDetails) {
      GetAllWorkspace();
    }
  }, [userDetails]);

  const GetAllWorkspace = async () => {
    try {
      const result = await convex.query(api.workspace.GetAllWorkspace, {
        userId: userDetails?._id,
      });

      if (result) {
        setWorkspaceList(result);
      }

      console.log("Get all workspace", result);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      <div>
        {workspaceList?.map((workspace, index) => (
          <Link href={`/workspace/${workspace._id}`} key={index}>
          <h2
            onClick={toggleSidebar}
            className="text-sm text-gray-400 mt-2 font-light hover:text-white cursor-pointer"
          >
            {workspace.messages[0].content}
          </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WorkspaceHistory;
