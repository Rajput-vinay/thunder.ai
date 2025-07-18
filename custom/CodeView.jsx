"use client";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useContext, useEffect, useState } from "react";
import Lookup from "../data/Lookup";
import axios from "axios";
import { MessageContext } from "../context/MessageContext";
import Prompt from "../data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { countToken } from "./ChatView";
import { userDetailsContext } from "../context/userDetailsContext";
import SandPackPreviewClient from "./SandPackPreviewClient";
import { ActionContext } from "../context/ActionContext";
import { toast } from "sonner";
function CodeView() {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, sendMessages } = useContext(MessageContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const { id } = useParams();
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(userDetailsContext);
  const UpdateToken = useMutation(api.users.UpdateToken);
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    setActiveTab("preview");
  }, [action]);

  useEffect(() => {
    if (id) {
      GetFiles();
    }
  }, [id]);

  const GetFiles = async () => {
    setLoading(true);
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
      setFiles(mergedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === "user") {
        GererateAiCode();
      }
    }
  }, [messages]);

  const GererateAiCode = async () => {
    setLoading(true);
    try {
      const lastMessage = JSON.stringify(messages);
      const PROMPT = lastMessage + " " + Prompt.CODE_GEN_PROMPT;

      console.log("Sending prompt to API:", PROMPT);

      const result = await axios.post("/api/gen-ai-code", { prompt: PROMPT });

      console.log("Raw AI Response:", result.data);

      const aiResponse = result.data;

      if (!aiResponse || typeof aiResponse !== "object") {
        console.error("Unexpected AI response format:", aiResponse);
        toast.error("❌ AI did not return a valid response.");
        setLoading(false);
        setAction("error");
        setTimeout(() => setAction(""), 2000);
        return;
      }

      const extractedFiles = aiResponse.files || aiResponse.generatedFiles;

      if (!extractedFiles || typeof extractedFiles !== "object") {
        console.error(
          "AI response does not contain valid files:",
          extractedFiles
        );
        toast.error(`AI response does not contain valid files`);
        setLoading(false);
        setAction("error");
        setTimeout(() => {
          setAction("");
        }, 2000);
        return;
      }

      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...extractedFiles };
      setFiles(mergedFiles);

      await UpdateFiles({
        workspaceId: id,
        files: extractedFiles,
      });

      const token =
        Number(userDetails?.token) -
        Number(countToken(JSON.stringify(aiResponse)));
      setUserDetails((prev) => ({
        ...prev,
        token: token,
      }));

      await UpdateToken({
        userId: userDetails?._id,
        token: token,
      });
    } catch (error) {
      console.error("Error generating AI code:", error);
      toast.error("❌ Failed to generate code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 gap-3 w-[140px] rounded-full">
          <h2
            className={`text-sm cursor-pointer p-1 px-2 rounded-full ${
              activeTab === "code" ? "bg-blue-500 text-white" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </h2>
          <h2
            className={`text-sm cursor-pointer p-1 px-2 rounded-full ${
              activeTab === "preview"
                ? "bg-blue-500 text-white"
                : "text-gray-300"
            }`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </h2>
        </div>
      </div>

      <SandpackProvider
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        files={files}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandPackPreviewClient />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>

      {loading && (
        <div className="p-20 bg-gray-900 opacity-50 absolute top-0 w-full h-full rounded-lg flex justify-center items-center">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating Your files</h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;
