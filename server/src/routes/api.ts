import { Router, Request, Response } from "express"
import generateResponse from "../services/geminiAi"
const router = Router()

router.post('/chat', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ error: "Message is required" })
        }
        console.log("Message from client: ", prompt);

        const response = await generateResponse(prompt)

        res.status(200).json({ response })
        
    } catch (error) {
        console.error("Error in chat route:", error);
        res.status(500).json({ error: "AI Service Failed" })
    }
})

export default router
