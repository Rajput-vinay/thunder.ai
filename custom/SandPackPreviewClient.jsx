import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react"
import { useContext, useEffect, useRef } from "react"
import { ActionContext } from "../context/ActionContext"

function SandPackPreviewClient (){
    const previewRef = useRef()
    const {sandpack} = useSandpack()
    const {action, setAction} = useContext(ActionContext)
 

    useEffect(()=>{
       GetSandpackClient()
    },[sandpack && action])



    const GetSandpackClient= async()=>{
       const client = previewRef.current?.getClient()
        if(client){
        // console.log("client",client)
        const result = await client.
        getCodeSandboxURL()

        if(action?.actionType =='deploy'){
            window.open('https://'+result?.sandboxId + '.csb.app')
        
        }else if(action?.actionType == 'export'){
            window?.open(result?.editorUrl)
        }
        console.log(result)
       } 
    }
    return (
       <SandpackPreview style={{ height: "80vh" }} showNavigator={true} 
       ref={previewRef}
       />
    )
}
export default SandPackPreviewClient