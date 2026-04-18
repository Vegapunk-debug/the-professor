import { Request, Response } from "express"
import { AIService } from "../interfaces/AIService"
import { DocumentProcessor } from "../interfaces/DocumentProcessor"
import { QuizService } from "../services/quizService"
import { FlashcardService } from "../services/flashcardService"
import { VisualizeService } from "../services/visualizeService"
import { DocumentRepository } from "../repositories/DocumentRepository"
import fs from "fs"

export class UploadController {
    constructor(
        private aiService: AIService,
        private documentProcessor: DocumentProcessor,
        private quizService: QuizService,
        private flashcardService: FlashcardService,
        private visualizeService: VisualizeService,
        private documentRepository: DocumentRepository
    ) {}
}
