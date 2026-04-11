import fs from "fs"
import { PDFParse, VerbosityLevel } from "pdf-parse"

export async function extractTextFromPDF(filePath: string) {
    try {

        const dataBuffer = fs.readFileSync(filePath)

        const parser = new PDFParse({
            data: new Uint8Array(dataBuffer),
            verbosity: VerbosityLevel.ERRORS
        })

        const result = await parser.getText()

        await parser.destroy()
        
        return result.text
    } catch (error) {
        console.error("Error in PDF service: ", error);
        throw new Error("Failed to extract text from PDF")
    }
}