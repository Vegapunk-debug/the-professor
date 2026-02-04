// The Professor: where i created the gemini ai service. It talks to Google Gemini.

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config()

const Gemini_Api_Key = process.env.GEMINI_API_KEY
if (!Gemini_Api_Key) {
    throw new Error("ERROR: GEMINI API KEY is missing in .env file")
}

const geminiIntialized = new GoogleGenerativeAI(Gemini_Api_Key)

export default async function generateResponse(prompt: string) {
    try {
        const model = geminiIntialized.getGenerativeModel({ model: "gemini-1.5-flash-001" })
        const result = await model.generateContent(prompt)
            
        const response = result.response

        if (!response || !response.candidates || response.candidates.length === 0) {
            throw new Error("AI returned no answers");
        }//Candidates are the responses from gemini
        console.log("Recieved response from Gemini: ", response.text())

        return response.text()

    } catch (error: any) {
        console.error("AI Error:", error.message || error);
        throw new Error(`Failed to generate response from AI ${error.message || "Unknown Error"}`)
    }

}
