import { ChatAIService, ChatMessage } from "../interfaces/ChatAIService";

export class AIServiceWithFallback implements ChatAIService {
    private primary: ChatAIService;
    private fallback: ChatAIService;

    constructor(primary: ChatAIService, fallback: ChatAIService) {
        this.primary = primary;
        this.fallback = fallback;
    }

    async generateContent(prompt: string): Promise<string> {
        try {
            return await this.primary.generateContent(prompt);
        } catch (primaryError: any) {
            console.warn(`Primary AI failed (${primaryError.message || "Unknown"}). Falling back...`);
            try {
                return await this.fallback.generateContent(prompt);
            } catch (fallbackError: any) {
                console.error("AI Routing Error: Both primary and fallback failed.");
                throw new Error(`Failed to generate response. Fallback Error: ${fallbackError.message || "Unknown"}`);
            }
        }
    }

    async generateChatResponse(prompt: string, history: ChatMessage[] = []): Promise<string> {
        try {
            return await this.primary.generateChatResponse(prompt, history);
        } catch (primaryError: any) {
            console.warn(`Primary AI chat failed (${primaryError.message || "Unknown"}). Falling back...`);
            try {
                return await this.fallback.generateChatResponse(prompt, history);
            } catch (fallbackError: any) {
                console.error("AI Routing Error: Both primary and fallback failed for chat.");
                throw new Error(`Failed to generate chat response. Fallback Error: ${fallbackError.message || "Unknown"}`);
            }
        }
    }
}
