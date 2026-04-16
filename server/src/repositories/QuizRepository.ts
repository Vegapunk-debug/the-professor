import QuizModel, { IQuiz } from "../models/Quiz"
import { QuizQuestion } from "../services/quizService"

export class QuizRepository {
    async create(userId: string, documentId: string, questions: QuizQuestion[]): Promise<IQuiz> {
        return await QuizModel.create({
            user_id: userId,
            doc_id: documentId,
            questions: questions
        })
    }
}
