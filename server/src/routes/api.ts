import { Router } from "express"
import { handleChat } from "../controller/chatController"
const router = Router()

router.post('/chat', handleChat)

export default router
