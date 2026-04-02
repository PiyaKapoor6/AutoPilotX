# AutoPilotX - Enterprise AI Assistant

AutoPilotX is an Enterprise AI Assistant specifically designed for Indian MSMEs (Micro, Small, and Medium Enterprises). It features document parsing, automated workflows, and a RAG (Retrieval-Augmented Generation) pipeline to chat with your company's data.

## Features

- **Document Upload & Parsing**: Upload invoices, receipts, and ledgers. The app uses Gemini to extract structured JSON data.
- **RAG Pipeline (Memory)**: Extracted document data is embedded and stored in a local vector database. You can chat with your business records using natural language.
- **Automated Workflows**: Set up rules to automatically handle repetitive tasks (UI prototype).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **AI Models**: Google Gemini API (`gemini-2.5-flash`, `gemini-3-flash-preview`, `gemini-embedding-2-preview`)
- **Vector Store**: Custom local JSON-based vector store (`company_data.json`)

## Running Locally

1. **Clone the repository** (if applicable) or download the source code.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. **Open the App**:
   Navigate to `http://localhost:3000` in your browser.

## How to Use the RAG Pipeline

1. Go to the **Dashboard** and upload a document (e.g., a PDF invoice or a receipt image).
2. The app will extract the data and automatically ingest it into the local vector database (`company_data.json`).
3. Navigate to the **Memory** page.
4. Ask a question about the document you just uploaded (e.g., "What was the total amount on the recent invoice?").
5. The assistant will retrieve the relevant document chunks and answer your question based on the company data.
