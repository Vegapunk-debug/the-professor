import { AIService } from "../interfaces/AIService";
import { AIParser } from "../utils/parseAIJson";

export interface Flashcard {
    id: number;
    front: string;
    back: string;
    category: string;
}

export class FlashcardService {
    private aiService: AIService;
    private aiParser: AIParser;

    constructor(aiService: AIService, aiParser: AIParser) {
        this.aiService = aiService;
        this.aiParser = aiParser;
    }

    async generate(text: string): Promise<Flashcard[]> {
        const prompt = `You are a flashcard generator for studying. Based on the following document text, generate exactly 10 flashcards to help a student study and memorize the key concepts.

Return ONLY a valid JSON array with this exact structure (no markdown, no code fences, just raw JSON):
[
  {
    "id": 1,
    "front": "Question or term on the front of the card",
    "back": "Answer or definition on the back of the card",
    "category": "Topic Category"
  }
]

Rules:
- Generate exactly 10 flashcards
- Mix question-answer pairs and term-definition pairs
- Cover different parts of the document
- Keep front text concise (1-2 sentences max)
- Keep back text clear and informative (1-3 sentences)
- Assign a short category label to group related cards
- Make the cards useful for active recall practice

Document text:
${text.substring(0, 30000)}`

        const aiResponse = await this.aiService.generateContent(prompt)
        const flashcards = this.aiParser.parseJson<Flashcard[]>(aiResponse, "flashcard")

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            throw new Error("AI generated empty flashcards. Please try again.")
        }

        return flashcards
    }
}
