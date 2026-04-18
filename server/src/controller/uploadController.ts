import { Request, Response } from "express"
import { AIService } from "../interfaces/AIService"
import { DocumentProcessor } from "../interfaces/DocumentProcessor"
import { QuizService } from "../services/quizService"
import { FlashcardService } from "../services/flashcardService"
import { VisualizeService } from "../services/visualizeService"
import { DocumentRepository } from "../repositories/DocumentRepository"
import fs from "fs"

export class UploadController {
    private aiService: AIService;
    private documentProcessor: DocumentProcessor;
    private quizService: QuizService;
    private flashcardService: FlashcardService;
    private visualizeService: VisualizeService;
    private documentRepository: DocumentRepository;

    constructor(
        aiService: AIService,
        documentProcessor: DocumentProcessor,
        quizService: QuizService,
        flashcardService: FlashcardService,
        visualizeService: VisualizeService,
        documentRepository: DocumentRepository
    ) {
        this.aiService = aiService;
        this.documentProcessor = documentProcessor;
        this.quizService = quizService;
        this.flashcardService = flashcardService;
        this.visualizeService = visualizeService;
        this.documentRepository = documentRepository;
    }

    handleUpload = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No file uploaded" })
                return
            }

            console.log("File received:", req.file.originalname);

            const pdfText = await this.documentProcessor.extractText(req.file.path)

            console.log("Text extracted. Starting parallel AI processing...");

            const summaryPrompt = `Here is the text from a document. Summarize it in 3 bullet points:\n\n${pdfText.substring(0, 30000)}`

            const [summaryResult, quizResult, flashcardResult, visualizeResult] = await Promise.allSettled([
                this.aiService.generateContent(summaryPrompt),
                this.quizService.createMCQ(pdfText),
                this.flashcardService.generate(pdfText),
                this.visualizeService.generate(pdfText)
            ])

            console.log("Parallel AI processing complete.");

            const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : "Summary generation failed. Try again from the chat."
            const questions = quizResult.status === 'fulfilled' ? quizResult.value : null
            const flashcards = flashcardResult.status === 'fulfilled' ? flashcardResult.value : null
            const visualization = visualizeResult.status === 'fulfilled' ? visualizeResult.value : null

            if (summaryResult.status === 'rejected') console.warn("Summary failed:", summaryResult.reason)
            if (quizResult.status === 'rejected') console.warn("Quiz failed:", quizResult.reason)
            if (flashcardResult.status === 'rejected') console.warn("Flashcards failed:", flashcardResult.reason)
            if (visualizeResult.status === 'rejected') console.warn("Visualization failed:", visualizeResult.reason)

    }
}
