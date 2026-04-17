import { Request, Response } from "express"
import { VisualizeService } from "../services/visualizeService"

export class VisualizeController {
    private visualizeService: VisualizeService;

    constructor(visualizeService: VisualizeService) {
        this.visualizeService = visualizeService;
    }

    handleVisualize = async (req: Request, res: Response) => {
        try {
            const { text } = req.body

            if (!text || text.trim().length === 0) {
                res.status(400).json({ error: "Document text is required to generate visualization" })
                return
            }

            const visualization = await this.visualizeService.generate(text)

            res.json({ visualization })

        } catch (error: any) {
            console.error("Visualization Generation Error:", error)
            res.status(500).json({ error: error.message || "Failed to generate visualization" })
        }
    }
}
