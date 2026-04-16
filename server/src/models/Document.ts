import mongoose, { Schema, Document as MongoDocument } from "mongoose"

export interface IDocument extends MongoDocument {
    user_id: string;
    file_name: string;
    filePath: string;
    extracted_text: string;
    createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
    user_id: {
        type: String,
        required: true
    },
    file_name: {
        type: String,
        required: true,
        trim: true
    },
    filePath: {
        type: String,
        default: ""
    },
    extracted_text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model<IDocument>("Document", DocumentSchema)
