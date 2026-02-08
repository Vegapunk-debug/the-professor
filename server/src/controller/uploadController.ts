import { Request, Response } from 'express'
import { extractTextFromPDF } from '../services/pdf'
import generateResponse from '../services/geminiAi'
import fs from 'fs'

export const handlePdfUpload = async (req: Request, res: Response) => {
    try {

        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" })
            return
        }

        console.log("File received:", req.file.originalname);

        const pdfText = await extractTextFromPDF(req.file.path)

        const prompt = `Here is the text from a document. Summarize it in 3 bullet points:\n\n${pdfText.substring(0, 15000)}`

        const summary = await generateResponse(prompt)

        fs.unlinkSync(req.file.path)

        res.json({ 
            filename: req.file.originalname,
            summary: summary 
        })

    } catch (error: any) {
        console.error("Upload Error:", error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
        
        res.status(500).json({ error: error.message })
    }
};