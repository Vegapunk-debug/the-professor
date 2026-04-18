import mongoose, { Schema, Document as MongoDocument } from "mongoose"

export interface IFlashcard extends MongoDocument {
    doc_id: mongoose.Types.ObjectId;
    user_id: string;
    cards: Array<{
        id: number;
        front: string;
        back: string;
        category: string;
    }>;
    createdAt: Date;
}

const FlashcardSchema = new Schema<IFlashcard>({
    doc_id: {
        type: Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    cards: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model<IFlashcard>("Flashcard", FlashcardSchema)
