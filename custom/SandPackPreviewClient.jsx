import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { useContext, useEffect, useRef } from "react";
import { ActionContext } from "../context/ActionContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";

function SandPackPreviewClient() {
  const previewRef = useRef();
  const { sandpack } = useSandpack();   
  const { action, setAction } = useContext(ActionContext);
  const hasRun = useRef(false); 

  useEffect(() => {
    if (!sandpack || !action || hasRun.current) return;
    hasRun.current = true;
    handleAction();
  }, [sandpack, action]);

  const handleAction = async () => {
    try {
      if (action?.actionType === "deploy") {
        const client = previewRef.current?.getClient();
        const result = await client.getCodeSandboxURL();
        if (result?.sandboxId) {
          window.open(`https://${result?.sandboxId}.csb.app`, "_blank");
          toast.success("🚀 Project deployed successfully!");
        }
      } else if (action?.actionType === "export") {
        const zip = new JSZip();
        const files = sandpack?.files ?? {};

        for (const path in files) {
          const file = files[path];
          const code = typeof file === "string" ? file : file.code;
          if (code !== undefined) {
            zip.file(path.replace(/^\//, ""), code);
          }
        }

        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, "sandpack-project.zip");
        toast.success("📦 Project downloaded successfully!");
      }
    } catch (err) {
      console.error("Error in SandPackPreviewClient:", err);
      toast.error("❌ Something went wrong during the action.");
    } finally {
      // Reset the flag and action so future actions can run
      hasRun.current = false;
      setAction("");
    }
  };

  return (
    <SandpackPreview style={{ height: "80vh" }} showNavigator={true} ref={previewRef} />
  );
}

export default SandPackPreviewClient;
