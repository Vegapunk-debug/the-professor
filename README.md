# The Professor | AI-Powered Document Intelligence

![The Professor Banner](https://readme-typing-svg.demolab.com?font=Fira+Code&size=45&pause=1000&color=3B82F6&center=true&vCenter=true&width=1000&height=100&lines=THE+PROFESSOR;AI+DOCUMENT+INTELLIGENCE;NEURAL+KNOWLEDGE+EXTRACTION)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)

The Professor is a sophisticated Full-Stack application designed to transform static PDF documents into interactive, conversational learning environments. By leveraging Google Gemini 2.0 Flash and a 3D-accelerated user interface, it provides deep document analysis, automated assessment generation, and secure data management.

---

## Technical Overview

This project is engineered with a primary focus on Software Engineering and System Design (SESD) principles. The backend architecture accounts for 75% of the system evaluation, emphasizing modularity, security, and scalability.

### Core Capabilities
- **Neural Text Extraction**: Backend services utilize asynchronous parsing to convert complex PDF structures into sanitized string data.
- **Contextual Intelligence**: Integration with the Gemini 2.0 Flash model allows for precise querying based on document-specific metadata.
- **Automated Assessment**: An algorithmic module designed to parse document context and generate structured Multiple Choice Questions (MCQs) for self-evaluation.
- **Secure Authentication**: Implementation of JWT-based identity management and encrypted storage for user workspaces.
- **3D Visualization**: High-performance rendering using React Three Fiber to visualize the neural processing state of the AI.

---

## System Architecture

The application adheres to the Model-View-Controller (MVC) design pattern to ensure a clean separation of concerns.

- **Models**: Define data structures for users, documents, and generated quizzes.
- **Views**: An interactive frontend utilizing Glassmorphism and 3D components.
- **Controllers**: Manage the logic flow between user requests and internal services.
- **Services**: Encapsulated business logic for AI communication, PDF parsing, and database operations.



### Design Documents
- [Use Case Diagram](./useCaseDiagram.md)
- [Sequence Diagram](./sequenceDiagram.md)
- [Class Diagram](./classDiagram.md)
- [ER Diagram](./ErDiagram.md)

---

## Tech Stack

### Backend
- **Framework**: Node.js / Express.js
- **Language**: TypeScript (Strict Mode)
- **Security**: JSON Web Tokens (JWT) & Bcrypt
- **AI Engine**: Google Gemini SDK
- **Storage**: MongoDB / Mongoose ODM

### Frontend
- **Library**: React 18
- **Graphics**: Three.js / React Three Fiber
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion

---

## Installation and Setup

### Prerequisites
- Node.js v18 or higher
- Google AI Studio API Key

### Frontend Configuration
```bash
cd server
npm install
npm run dev
```
### Backend Configuration
```bash
cd client
npm install
npm run dev