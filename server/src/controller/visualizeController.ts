import { Request, Response } from "express"
import { VisualizeService } from "../services/visualizeService"
import { DocumentRepository } from "../repositories/DocumentRepository"

export class VisualizeController {
    private visualizeService: VisualizeService;
    private documentRepository: DocumentRepository;

    constructor(visualizeService: VisualizeService, documentRepository: DocumentRepository) {
        this.visualizeService = visualizeService;
        this.documentRepository = documentRepository;
    }

    handleVisualize = async (req: Request, res: Response) => {
        try {
            const { text, documentId } = req.body
            let effectiveText = text;

            if (!effectiveText && documentId) {
                const doc = await this.documentRepository.findById(documentId);
                if (doc) {
                    effectiveText = doc.extracted_text;
                }
            }

            if (!effectiveText || effectiveText.trim().length === 0) {
                res.status(400).json({ error: "Document text is required to generate visualization" })
                return
            }

            const visualization = await this.visualizeService.generate(effectiveText)

            const user = res.locals.user;
            if (user && user.userId && documentId) {
                try {
                    await this.visualizeService.saveToDB(visualization, user.userId, documentId)
                } catch (dbError) {
                    console.warn("Failed to save visualization to DB (non-fatal):", dbError)
                }
            }

            res.json({ visualization })

        } catch (error: any) {
            console.error("Visualization Generation Error:", error)
            res.status(500).json({ error: error.message || "Failed to generate visualization" })
        }
    }

    getVisualization = async (req: Request, res: Response) => {
        try {
            const documentId = req.params.documentId as string;
            const visualization = await this.visualizeService.getVisualizationByDocId(documentId);
            
            if (!visualization) {
                return res.status(404).json({ error: "Visualization not found" });
            }

            res.json({ visualization });
        } catch (error: any) {
            console.error("Get Visualization Error:", error);
            res.status(500).json({ error: "Failed to fetch visualization" });
        }
    }
}
