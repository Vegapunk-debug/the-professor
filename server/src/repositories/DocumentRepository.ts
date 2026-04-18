import DocumentModel, { IDocument } from "../models/Document"

export class DocumentRepository {
    async create(documentData: Partial<IDocument>): Promise<IDocument> {
        return await DocumentModel.create(documentData)
    }

    async findById(documentId: string): Promise<IDocument | null> {
        return await DocumentModel.findById(documentId)
    }

    async findByUserId(userId: string): Promise<IDocument[]> {
        return await DocumentModel.find({ user_id: userId })
            .select("file_name createdAt _id")
            .sort({ createdAt: -1 })
    }
}
