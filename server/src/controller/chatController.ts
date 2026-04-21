
import { Request, Response, NextFunction } from "express"
import { ChatAIService, ChatMessage } from "../interfaces/ChatAIService"
import { ChatHistoryRepository } from "../repositories/ChatHistoryRepository"
import { DocumentRepository } from "../repositories/DocumentRepository"

export class ChatController {
    private aiService: ChatAIService;
    private chatHistoryRepository: ChatHistoryRepository;
    private documentRepository: DocumentRepository;

    constructor(aiService: ChatAIService, chatHistoryRepository: ChatHistoryRepository, documentRepository: DocumentRepository) {
        this.aiService = aiService;
        this.chatHistoryRepository = chatHistoryRepository;
        this.documentRepository = documentRepository;
    }

    handleChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { prompt, context, history, documentId } = req.body

            if (!prompt) {
                return res.status(400).json({ error: "Message is required" })
            }
            console.log("Message from client: ", prompt);

            let effectiveContext = context;

            // If documentId is provided, the server is the source of truth for context
            if (documentId) {
                try {
                    const doc = await this.documentRepository.findById(documentId);
                    if (doc) {
                        effectiveContext = doc.extracted_text;
                        console.log("Context loaded from DB for document:", documentId);
                    }
                } catch (err) {
                    console.warn("Failed to load document context from DB (using client context if available):", err);
                }
            }

            const chatHistory: ChatMessage[] = []

            if (effectiveContext && effectiveContext.trim().length > 0) {
                chatHistory.push({
                    role: 'user',
                    text: `You are "The Professor", an AI tutor. The user has uploaded a document. Answer questions based on the following document context. If the question is not related to the document, politely say so.\n\nDOCUMENT CONTEXT:\n${effectiveContext.substring(0, 30000)}`
                })
                chatHistory.push({
                    role: 'model',
                    text: 'I have read and understood the document. I am ready to answer your questions about it.'
                })
            }

            if (Array.isArray(history) && history.length > 0) {
                for (const msg of history) {
                    if (msg.role && msg.text) {
                        chatHistory.push({
                            role: msg.role === 'ai' ? 'model' : 'user',
                            text: msg.text
                        })
                    }
                }
            }

            const response = await this.aiService.generateChatResponse(prompt, chatHistory)

            // Persist chat messages to MongoDB if user is authenticated
            const user = res.locals.user;
            if (user && user.userId) {
                try {
                    await this.chatHistoryRepository.create([
                        {
                            user_id: user.userId,
                            doc_id: documentId || null,
                            role: 'user',
                            message: prompt
                        },
                        {
                            user_id: user.userId,
                            doc_id: documentId || null,
                            role: 'model',
                            message: response
                        }
                    ])
                    console.log("Chat messages saved to MongoDB")
                } catch (dbError) {
                    console.warn("Failed to save chat history (non-fatal):", dbError)
                }
            }

            res.status(200).json({ response })

        } catch (error) {
            next(error);
        }
    }
}