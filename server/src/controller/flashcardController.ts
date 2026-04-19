import { Request, Response } from "express"
import { FlashcardService } from "../services/flashcardService"
import { DocumentRepository } from "../repositories/DocumentRepository"

export class FlashcardController {
    private flashcardService: FlashcardService;
    private documentRepository: DocumentRepository;

    constructor(flashcardService: FlashcardService, documentRepository: DocumentRepository) {
        this.flashcardService = flashcardService;
        this.documentRepository = documentRepository;
    }

    handleFlashcardGeneration = async (req: Request, res: Response) => {
        try {
            const { text, documentId } = req.body
            let effectiveText = text;

            if (!effectiveText && documentId) {
                const doc = await this.documentRepository.findById(documentId);
                if (doc) {
                    effectiveText = doc.extracted_text;
                }
            }

            if (!effectiveText || effectiveText.trim().length === 0) {
                res.status(400).json({ error: "Document text is required to generate flashcards" })
                return
            }

            const flashcards = await this.flashcardService.generate(effectiveText)

            const user = res.locals.user;
            if (user && user.userId && documentId) {
                try {
                    await this.flashcardService.saveToDB(flashcards, user.userId, documentId)
                } catch (dbError) {
                    console.warn("Failed to save flashcards to DB (non-fatal):", dbError)
                }
            }

            res.json({ flashcards })

        } catch (error: any) {
            console.error("Flashcard Generation Error:", error)
            res.status(500).json({ error: error.message || "Failed to generate flashcards" })
        }
    }

    getFlashcards = async (req: Request, res: Response) => {
        try {
            const documentId = req.params.documentId as string;
            const flashcards = await this.flashcardService.getFlashcardsByDocId(documentId);
            
            if (!flashcards) {
                return res.status(404).json({ error: "Flashcards not found" });
            }

            res.json({ flashcards: flashcards.cards });
        } catch (error: any) {
            console.error("Get Flashcards Error:", error);
            res.status(500).json({ error: "Failed to fetch flashcards" });
        }
    }
}
