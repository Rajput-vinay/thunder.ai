"use client";
import { MessageContext } from "../context/MessageContext";
import { userDetailsContext } from "../context/userDetailsContext";
import Colors from "../data/Colors";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Prompt from "../data/Prompt";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Lookup from "../data/Lookup";
import axios from "axios";
import { api } from "../convex/_generated/api";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../components/ui/sidebar";
import { toast } from "sonner";

export const countToken = (inputText) => {
  return inputText.trim().split(/\s+/).filter(word => word).length;
};

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessageContext);
  const { userDetails, setUserDetails } = useContext(userDetailsContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  const UpdateToken = useMutation(api.users.UpdateToken);

  useEffect(() => {
    if (id) {
      GetWorkspaceData();
    }
  }, [id]);

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  // Get workspace data
  const GetWorkspaceData = async () => {
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      console.log("message", result?.messages);
      setMessages(result?.messages);
    } catch (error) {
      // console.error("Error fetching workspace data:", error);
      toast.error("❌ Failed to fetch workspace data.");
    }
  };

  // Fetch AI response
  const GetAiResponse = async () => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", { prompt: PROMPT });

      console.log(result.data.result);

      const aiResponse = {
        role: "ai",
        content: result?.data?.result,
      };

      setMessages((prev) => [...prev, aiResponse]);

      await UpdateMessages({
        messages: [...messages, aiResponse],
        workspaceId: id,
      });

      const token = Number(userDetails?.token) - Number(countToken(JSON.stringify(aiResponse)));
        
      setUserDetails( prev =>({
        ...prev,
        token:token
      }))

      // Update database
      await UpdateToken({
        userId: userDetails?._id,
        token: token,
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
      toast.error("❌ Failed to generate AI response. Please try again.");
    }
    setLoading(false);
  };

  const onGenerate = (input) => {

    if(userDetails?.token <10){
      toast.error('You dont have enough token!')
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide pl-5">
        {messages?.map((mes, index) => (
          <div
            key={index}
            className="p-3 leading-7 rounded-lg mb-2 flex items-start gap-2"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            {mes?.role === "user" && (
              <Image
                src={userDetails?.picture}
                alt="userImage"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <div className="flex flex-col">
              <ReactMarkdown>{mes.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ backgroundColor: Colors.CHAT_BACKGROUND }} className="p-3 rounded-lg mb-2 flex items-start gap-2">
            <Loader2Icon className="animate-spin" />
            <h2>Generating response ...</h2>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-end">
        {userDetails && (
          <Image
            src={userDetails?.picture}
            alt="user"
            width={30}
            height={30}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
          />
        )}
        <div className="p-5 border rounded-xl max-w-xl w-full mt-3" style={{ backgroundColor: Colors.BACKGROUND }}>
          <div className="flex gap-2">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
