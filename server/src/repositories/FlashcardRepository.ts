import FlashcardModel, { IFlashcard } from "../models/Flashcard"
import { Flashcard } from "../services/flashcardService"

export class FlashcardRepository {
    async create(userId: string, documentId: string, cards: Flashcard[]): Promise<IFlashcard> {
        return await FlashcardModel.create({
            user_id: userId,
            doc_id: documentId,
            cards: cards
        })
    }

    async findByDocId(documentId: string): Promise<IFlashcard | null> {
        return await FlashcardModel.findOne({ doc_id: documentId })
            .sort({ createdAt: -1 })
    }
}
