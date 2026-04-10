// The Professor: where i created the gemini ai service. It talks to Google Gemini.

import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

import dotenv from "dotenv";

dotenv.config()

const Gemini_Api_Key = process.env.GEMINI_API_KEY
if (!Gemini_Api_Key) {
    throw new Error("ERROR: GEMINI API KEY is missing in .env file")
}

const geminiIntialized = new GoogleGenerativeAI(Gemini_Api_Key)

const Groq_Api_Key = process.env.GROQ_API_KEY;
if (!Groq_Api_Key) {
    throw new Error("ERROR: GROQ API KEY is missing in .env file");
}
const groq = new Groq({ apiKey: Groq_Api_Key });

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export async function generateChatResponse(prompt: string, history: ChatMessage[] = []) {
    try {
        console.log("Routing chat to Gemini with", history.length, "history messages...");
        const model = geminiIntialized.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

        const geminiHistory = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }))

        const chat = model.startChat({ history: geminiHistory })
        const result = await chat.sendMessage(prompt)
        return result.response.text()
    } catch (error: any) {
        console.error("Gemini Chat generation failed:", error.message || error);
        throw new Error("Failed to generate chat response from AI service.");
    }
}

export default async function generateResponse(prompt: string) {
    try {
        console.log("Routing prompt to Gemini...");
        const model = geminiIntialized.getGenerativeModel({ model: "gemini-2.5-flash-lite" })
        const result = await model.generateContent(prompt)
            
        const response = result.response

        if (!response || !response.candidates || response.candidates.length === 0) {
            throw new Error("AI returned no answers");
        }//Candidates are the responses from gemini
        console.log("Success: Recieved response from Gemini.", response.text())

        return response.text()

    }
    catch (geminiError: any) {
        console.warn(`Gemini Failed (${geminiError.message || "Unknown error"}). Falling back to Groq...`);

        try {
            console.log("Routing prompt to Groq...");
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: "llama3-8b-8192"
            });

            const groqResponse = chatCompletion.choices[0]?.message?.content;
            
            if (!groqResponse) {
                throw new Error("Groq returned no answers");
            }

            console.log("Success: Received response from Groq.");
            return groqResponse;

        } catch (groqError: any) {
            console.error("AI Routing Error: Both Gemini and Groq failed.");
            throw new Error(`Failed to generate response. Groq Error: ${groqError.message || "Unknown"}`);
        }
}
}
