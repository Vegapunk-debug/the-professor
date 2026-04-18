import mongoose, { Schema, Document as MongoDocument } from "mongoose"

export interface IVisualization extends MongoDocument {
    doc_id: mongoose.Types.ObjectId;
    user_id: string;
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
    createdAt: Date;
}

const VisualizationSchema = new Schema<IVisualization>({
    doc_id: {
        type: Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    topics: {
        type: Schema.Types.Mixed,
        required: true
    },
    connections: {
        type: Schema.Types.Mixed,
        default: []
    }
}, {
    timestamps: true
})

export default mongoose.model<IVisualization>("Visualization", VisualizationSchema)
