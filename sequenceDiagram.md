```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant FE as Frontend 
    participant BE as Backend 
    participant PDF as PDF Service
    participant AI as Gemini AI Service

    User->>FE: Upload PDF File
    FE->>BE: POST /api/upload (Multipart Form)
    activate BE
    BE->>PDF: extractText(filePath)
    activate PDF
    PDF-->>BE: Raw Text Content
    deactivate PDF
    BE->>AI: generateSummary(extractedText)
    activate AI
    AI-->>BE: AI Response 
    deactivate AI
    BE-->>FE: JSON Response (Summary + Metadata)
    deactivate BE
    FE->>User: Display Summary & Update 3D Neural State
```
