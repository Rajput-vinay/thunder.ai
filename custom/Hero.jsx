"use client";
import { MessageContext } from "../context/MessageContext";
import { userDetailsContext } from "../context/userDetailsContext";
import Colors from "../data/Colors";
import Lookup from "../data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import { useContext, useState } from "react";
import SignInDialog from "./SigninDialog";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

function Hero() {
  const [userInput, setUserInput] = useState(""); // ✅ FIXED: Initialize as empty string
  const { messages, setMessages } = useContext(MessageContext);
  const { userDetails, setUserDetails } = useContext(userDetailsContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  console.log("userDetails", userDetails);

  const onGenerate = async (input) => {
      
    
    if (!userDetails || !userDetails._id) { // ✅ FIXED: Safe check for `_id`
      setOpenDialog(true);
      return;
    }
     
    if(userDetails?.token <10){
      toast("You dont have enough token!")
      return
    }

    const msg = { role: "user", content: input };
    setMessages([msg]);

    const workspaceId = await CreateWorkspace({
      user: userDetails._id,
      messages: [msg],
    });

    router.push("/workspace/" + workspaceId);
    setUserInput(""); // ✅ FIXED: Clear input after submission
  };

  return (
    <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2">
      <h2 className="text-4xl font-bold">{Lookup.HERO_HEADING}</h2>
      <p className="font-medium text-gray-400">{Lookup.HERO_DESC}</p>

      <div
        className="p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className="flex gap-2">
          <textarea
            value={userInput} // ✅ FIXED: Bind input to state
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            onChange={(e) => setUserInput(e.target.value)}
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

      <div className="flex flex-wrap mt-8 max-w-2xl items-center justify-center gap-3">
        {Lookup.SUGGSTIONS.map((suggestion, index) => (
          <h2
            onClick={() => onGenerate(suggestion)}
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
            key={index}
          >
            {suggestion}
          </h2>
        ))}
      </div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
      />
    </div>
  );
}

export default Hero;
