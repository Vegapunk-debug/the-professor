import VisualizationModel, { IVisualization } from "../models/Visualization"
import { TopicVisualization } from "../services/visualizeService"

export class VisualizationRepository {
    async create(userId: string, documentId: string, data: TopicVisualization): Promise<IVisualization> {
        return await VisualizationModel.create({
            user_id: userId,
            doc_id: documentId,
            title: data.title,
            topics: data.topics,
            connections: data.connections || []
        })
    }

    async findByDocId(documentId: string): Promise<IVisualization | null> {
        return await VisualizationModel.findOne({ doc_id: documentId })
            .sort({ createdAt: -1 })
    }
}
