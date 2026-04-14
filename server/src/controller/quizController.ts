import { Request, Response } from 'express'
import generateResponse from '../services/geminiAi'

export const handleQuizGeneration = async (req: Request, res: Response) => {
    try {
        const { text } = req.body

        if (!text || text.trim().length === 0) {
            res.status(400).json({ error: "Document text is required to generate a quiz" })
            return
        }

        const prompt = `You are a quiz generator. Based on the following document text, generate exactly 5 multiple choice questions to test understanding of the content.

Return ONLY a valid JSON array with this exact structure (no markdown, no code fences, just raw JSON):
[
  {
    "id": 1,
    "question": \"Question text here?\",
    "options": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],
    "correct": 0,
    "explanation": \"Brief explanation of why this answer is correct.\"
  }
]

The \"correct\" field is a 0-based index of the correct option.
Make the questions varied in difficulty. Cover different parts of the document.

Document text:
${text.substring(0, 12000)}`

        const aiResponse = await generateResponse(prompt)

        let questions
        try {
            let cleaned = aiResponse.trim()
            if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
            }
            questions = JSON.parse(cleaned)
        } catch {
            console.error("Failed to parse quiz JSON from AI:", aiResponse)
            res.status(500).json({ error: "AI returned invalid quiz format. Please try again." })
            return
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            res.status(500).json({ error: "AI generated empty quiz. Please try again." })
            return
        }

        res.json({ questions })

    } catch (error: any) {
        console.error("Quiz Generation Error:", error)
        res.status(500).json({ error: error.message || "Failed to generate quiz" })
    }
}
