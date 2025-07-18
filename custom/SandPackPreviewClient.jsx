// import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react"
// import { useContext, useEffect, useRef } from "react"
// import { ActionContext } from "../context/ActionContext"

// function SandPackPreviewClient (){
//     const previewRef = useRef()
//     const {sandpack} = useSandpack()
//     const {action, setAction} = useContext(ActionContext)
 

//     useEffect(()=>{
//        GetSandpackClient()
//     },[sandpack && action])



//     const GetSandpackClient= async()=>{
//        const client = previewRef.current?.getClient()
//         if(client){
//         // console.log("client",client)
//         const result = await client.
//         getCodeSandboxURL()

//         console.log("result sandpackClientPreview",result)

//         if(action?.actionType =='deploy'){
//             window.open('https://'+result?.sandboxId + '.csb.app')
        
//         }else if(action?.actionType == 'export'){
//             window?.open(result?.editorUrl)
//         }
//         console.log(result)
//        } 
//     }
//     return (
//        <SandpackPreview style={{ height: "80vh" }} showNavigator={true} 
//        ref={previewRef}
//        />
//     )
// }
// export default SandPackPreviewClient


import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { useContext, useEffect, useRef } from "react";
import { ActionContext } from "../context/ActionContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function SandPackPreviewClient() {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action } = useContext(ActionContext);

  useEffect(() => {
    if (sandpack && action) {
      handleAction();
    }
  }, [sandpack, action]);

  const handleAction = async () => {
    if (action?.actionType === "deploy") {
      const client = previewRef.current?.getClient();
      const result = await client.getCodeSandboxURL();
      console.log("result sandpackClientPreview", result);
      if (result?.sandboxId) {
        window.open(`https://${result?.sandboxId}.csb.app`, "_blank");
      }
    } else if (action?.actionType === "export") {
      const zip = new JSZip();
      const files = sandpack?.files ?? {};

      for (const path in files) {
        const file = files[path];
        const code = typeof file === "string" ? file : file.code;

        if (code !== undefined) {
          zip.file(path.replace(/^\//, ""), code); // remove leading slash for proper zip structure
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "sandpack-project.zip");
    }
  };

  return (
    <SandpackPreview style={{ height: "80vh" }} showNavigator={true} ref={previewRef} />
  );
}

export default SandPackPreviewClient;
