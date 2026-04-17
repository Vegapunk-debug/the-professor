import { Request, Response } from "express"
import { QuizService } from "../services/quizService"

export class QuizController {
    private quizService: QuizService;

    constructor(quizService: QuizService) {
        this.quizService = quizService;
    }

    handleQuizGeneration = async (req: Request, res: Response) => {
        try {
            const { text, documentId } = req.body

            if (!text || text.trim().length === 0) {
                res.status(400).json({ error: "Document text is required to generate a quiz" })
                return
            }

            const questions = await this.quizService.createMCQ(text)

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
}
