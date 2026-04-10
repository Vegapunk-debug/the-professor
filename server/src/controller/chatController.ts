import { Request, Response } from "express"
import { generateChatResponse, ChatMessage } from "../services/geminiAi"

export const handleChat = async (req: Request, res: Response) => {
    try {
        const { prompt, context, history } = req.body

        if (!prompt) {
            return res.status(400).json({ error: "Message is required" })
        }
        console.log("Message from client: ", prompt);

        const chatHistory: ChatMessage[] = []

        if (context && context.trim().length > 0) {
            chatHistory.push({
                role: 'user',
                text: `You are "The Professor", an AI tutor. The user has uploaded a document. Answer questions based on the following document context. If the question is not related to the document, politely say so.\n\nDOCUMENT CONTEXT:\n${context.substring(0, 15000)}`
            })
            chatHistory.push({
                role: 'model',
                text: 'I have read and understood the document. I am ready to answer your questions about it.'
            })
        }

        if (Array.isArray(history) && history.length > 0) {
            for (const msg of history) {
                if (msg.role && msg.text) {
                    chatHistory.push({
                        role: msg.role === 'ai' ? 'model' : 'user',
                        text: msg.text
                    })
                }
            }
        }

        const response = await generateChatResponse(prompt, chatHistory)

        res.status(200).json({ response })

    } catch (error) {
        console.error("Error in chat route:", error);
        res.status(500).json({ error: "AI Service Failed" })
    }
}