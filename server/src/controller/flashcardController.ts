import { Request, Response } from "express"
import { FlashcardService } from "../services/flashcardService"

export class FlashcardController {
    private flashcardService: FlashcardService;

    constructor(flashcardService: FlashcardService) {
        this.flashcardService = flashcardService;
    }

    handleFlashcardGeneration = async (req: Request, res: Response) => {
        try {
            const { text } = req.body

            if (!text || text.trim().length === 0) {
                res.status(400).json({ error: "Document text is required to generate flashcards" })
                return
            }

            const flashcards = await this.flashcardService.generate(text)

            res.json({ flashcards })

        } catch (error: any) {
            console.error("Flashcard Generation Error:", error)
            res.status(500).json({ error: error.message || "Failed to generate flashcards" })
        }
    }
}
