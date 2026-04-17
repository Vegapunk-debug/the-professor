import { AIService } from "../interfaces/AIService";
import { AIParser } from "../utils/parseAIJson";

export interface Flashcard {
    question: string;
    answer: string;
}

export class FlashcardService {
    private aiService: AIService;
    private aiParser: AIParser;

    constructor(aiService: AIService, aiParser: AIParser) {
        this.aiService = aiService;
        this.aiParser = aiParser;
    }
}
