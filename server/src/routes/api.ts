import { Router } from "express"
import { handleChat } from "../controller/chatController"
import uploadRouter from "./upload"

const router = Router()

router.post('/chat', handleChat)
router.use('/upload', uploadRouter)

export default router
