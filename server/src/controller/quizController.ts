import { Request, Response } from "express"
import { QuizService } from "../services/quizService"
import { DocumentRepository } from "../repositories/DocumentRepository"

export class QuizController {
    private quizService: QuizService;
    private documentRepository: DocumentRepository;

    constructor(quizService: QuizService, documentRepository: DocumentRepository) {
        this.quizService = quizService;
        this.documentRepository = documentRepository;
    }

    handleQuizGeneration = async (req: Request, res: Response) => {
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
                res.status(400).json({ error: "Document text is required to generate a quiz" })
                return
            }

            const questions = await this.quizService.createMCQ(effectiveText)

            const user = res.locals.user;
            if (user && user.userId && documentId) {
                try {
                    await this.quizService.saveToDB(questions, user.userId, documentId)
                    console.log("Quiz saved to MongoDB")
                } catch (dbError) {
                    console.warn("Failed to save quiz to DB (non-fatal):", dbError)
                }
            }

            res.json({ questions })

        } catch (error: any) {
            console.error("Quiz Generation Error:", error)
            res.status(500).json({ error: error.message || "Failed to generate quiz" })
        }
    }

    getQuiz = async (req: Request, res: Response) => {
        try {
            const documentId = req.params.documentId as string;
            const quiz = await this.quizService.getQuizByDocId(documentId);
            
            if (!quiz) {
                return res.status(404).json({ error: "Quiz not found" });
            }

            res.json({ questions: quiz.questions });
        } catch (error: any) {
            console.error("Get Quiz Error:", error);
            res.status(500).json({ error: "Failed to fetch quiz" });
        }
    }
}
