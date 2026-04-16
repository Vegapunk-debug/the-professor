import { Router } from "express"
import dotenv from "dotenv"
import { MulterConfig } from "../config/multer"

import { AIParser } from "../utils/parseAIJson"
import { ChatHistoryRepository } from "../repositories/ChatHistoryRepository"
import { DocumentRepository } from "../repositories/DocumentRepository"
import { QuizRepository } from "../repositories/QuizRepository"


import { GeminiService } from "../services/geminiAi"
import { GroqService } from "../services/groqAi"
import { AIServiceWithFallback } from "../services/aiServiceWithFallback"
import { PDFProcessor } from "../services/pdfProcessor"
import { QuizService } from "../services/quizService"
import { FlashcardService } from "../services/flashcardService"
import { VisualizeService } from "../services/visualizeService"
import { SupabaseAuthService } from "../services/supabaseAuthService"


import { ChatController } from "../controller/chatController"
import { UploadController } from "../controller/uploadController"
import { QuizController } from "../controller/quizController"
import { FlashcardController } from "../controller/flashcardController"
import { VisualizeController } from "../controller/visualizeController"
import { AuthController } from "../controller/authController"
import { HistoryController } from "../controller/historyController"


import { AuthMiddleware } from "../middleware/AuthMiddleware"

dotenv.config()

const geminiKey = process.env.GEMINI_API_KEY?.trim()
if (!geminiKey) throw new Error("ERROR: GEMINI API KEY is missing in .env file")

const groqKey = process.env.GROQ_API_KEY?.trim()
if (!groqKey) throw new Error("ERROR: GROQ API KEY is missing in .env file")

const geminiService = new GeminiService(geminiKey)
const groqService = new GroqService(groqKey)
const aiService = new AIServiceWithFallback(geminiService, groqService)

const pdfProcessor = new PDFProcessor()
const aiParser = new AIParser()
const multerConfig = new MulterConfig()
const upload = multerConfig.uploader

const chatHistoryRepository = new ChatHistoryRepository()
const documentRepository = new DocumentRepository()
const quizRepository = new QuizRepository()

const supabaseUrl = process.env.SUPABASE_URL?.trim()
if (!supabaseUrl) throw new Error("ERROR: SUPABASE_URL is missing in .env file")

const supabaseKey = process.env.SUPABASE_KEY?.trim()
if (!supabaseKey) throw new Error("ERROR: SUPABASE_KEY is missing in .env file")

const authService = new SupabaseAuthService(supabaseUrl, supabaseKey)
const authMiddleware = new AuthMiddleware(authService)

console.log("Supabase URL loaded:", supabaseUrl);
console.log("Supabase Key length:", supabaseKey.length);
console.log("Supabase Key preview:", supabaseKey.substring(0, 10) + "..." + supabaseKey.substring(supabaseKey.length - 10));

const quizService = new QuizService(aiService, aiParser, quizRepository)
const flashcardService = new FlashcardService(aiService, aiParser)
const visualizeService = new VisualizeService(aiService, aiParser)

const chatController = new ChatController(aiService, chatHistoryRepository)
const uploadController = new UploadController(aiService, pdfProcessor, quizService, flashcardService, visualizeService, documentRepository)
const quizController = new QuizController(quizService)
const flashcardController = new FlashcardController(flashcardService)
const visualizeController = new VisualizeController(visualizeService)
const authController = new AuthController(authService)
const historyController = new HistoryController(chatHistoryRepository, documentRepository)

const router = Router()

router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)
router.get('/auth/me', authMiddleware.handle, authController.getMe)

router.post('/chat', authMiddleware.optionalHandle, chatController.handleChat)
router.post('/upload', authMiddleware.optionalHandle, upload.single('file'), uploadController.handleUpload)
router.post('/quiz', authMiddleware.optionalHandle, quizController.handleQuizGeneration)
router.post('/flashcards', authMiddleware.optionalHandle, flashcardController.handleFlashcardGeneration)
router.post('/visualize', authMiddleware.optionalHandle, visualizeController.handleVisualize)

router.get('/history/:documentId', authMiddleware.handle, historyController.getChatHistory)
router.get('/documents', authMiddleware.handle, historyController.getUserDocuments)

export default router
