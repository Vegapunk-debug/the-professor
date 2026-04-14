import { Router } from "express"
import { handleChat } from "../controller/chatController"
import { handleQuizGeneration } from "../controller/quizController"
import uploadRouter from "./upload"

const router = Router()

router.post('/chat', handleChat)
router.post('/quiz', handleQuizGeneration)
router.use('/upload', uploadRouter)

export default router
