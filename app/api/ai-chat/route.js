import { chatSession } from "../../../config/AiModel";
import { NextResponse } from "next/server";


export async function POST (req){
    const {prompt} = await req.json();

    try {
        const result = await chatSession.sendMessage(prompt)
        const AIResponse = result.response.text()

        return NextResponse.json({
            result:AIResponse
        })
    } catch (error) {
        return NextResponse.json({
           error:error
        })
    }
}