import { GenAiCode } from "../../../config/AiModel";

import { NextResponse } from "next/server";


export async function POST(req){
   const {prompt} = await req.json();
   try{
     const result = await GenAiCode.sendMessage(prompt);
     const response = result.response.text();
     console.log("response-ai-code", response);
     return NextResponse.json(JSON.parse(response))
   }catch(e){
     return NextResponse.json({error:e})
   }
}