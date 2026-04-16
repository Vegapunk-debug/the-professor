import mongoose, { Schema, Document as MongoDocument } from "mongoose"

export interface IChatHistory extends MongoDocument {
    doc_id: mongoose.Types.ObjectId | null;
    user_id: string;
    role: 'user' | 'model';
    message: string;
    timestamp: Date;
}

const ChatHistorySchema = new Schema<IChatHistory>({
    doc_id: {
        type: Schema.Types.ObjectId,
        ref: "Document",
        default: null
    },
    user_id: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'model'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IChatHistory>("ChatHistory", ChatHistorySchema)
