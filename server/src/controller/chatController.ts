import { Request, Response } from "express"
import { generateChatResponse, ChatMessage } from "../services/geminiAi"

export const handleChat = async (req: Request, res: Response) => {
    try {
        const { prompt, history } = req.body

        if (!prompt) {
            return res.status(400).json({ error: "Message is required" })
        }
        console.log("Message from client: ", prompt);

        const chatHistory: ChatMessage[] = []

        // Basic implementation for April 9th
        const response = await generateChatResponse(prompt, chatHistory)

        res.status(200).json({ response })

    } catch (error) {
        console.error("Error in chat route:", error);
        res.status(500).json({ error: "AI Service Failed" })
    }
}