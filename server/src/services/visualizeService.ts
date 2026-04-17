import { AIService } from "../interfaces/AIService";
import { AIParser } from "../utils/parseAIJson";

export interface TopicVisualization {
    title: string;
    topics: Array<{
        name: string;
        summary: string;
        keyPoints: string[];
        importance: 'high' | 'medium' | 'low';
    }>;
    connections: Array<{
        from: string;
        to: string;
        relation: string;
    }>;
}

export class VisualizeService {
    private aiService: AIService;
    private aiParser: AIParser;

    constructor(aiService: AIService, aiParser: AIParser) {
        this.aiService = aiService;
        this.aiParser = aiParser;
    }
}
