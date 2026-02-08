import fs from "fs"
const pdfparse = require('pdf-parse');

export async function extractTextFromPDF(filePath: string) {
    try {

        const dataRead = fs.readFileSync(filePath)

        const data = await pdfparse(dataRead)
        
        return data.text
    } catch (error) {
        console.error("Error in PDF service: ", error);
        throw new Error("Failed to extract text from PDF")
    }
}