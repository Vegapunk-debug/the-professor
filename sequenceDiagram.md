```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant FE as Frontend
    participant BE as Backend
    participant AI as Gemini_Service

    User->>FE: Upload PDF
    FE->>BE: POST /api/upload
    BE->>AI: analyzeContent(text)
    AI-->>BE: AI Response
    BE-->>FE: JSON Result
    FE->>User: Display Analysis
```
