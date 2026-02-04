import { Router, Request, Response } from "express"
const router = Router()

router.post('/chat', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ error: "Message is required" })
        }
        console.log("Message from client: ", prompt);


        
        
    } catch (error) {
        
    }
})