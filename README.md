# AutoPilotX

## 🚀 Agentic AI Suite for Enterprise Automation & Knowledge Clarity

**AutoPilotX** is a comprehensive AI-powered enterprise automation platform designed specifically for Indian MSMEs. It combines intelligent agents, document processing, and real-time communications to streamline business operations and provide data-driven insights.

<h2 align="center">🎥 Project Demo</h2>

<p align="center">
  <a href="https://youtu.be/TPzBQAMot6g">
    <img src="https://img.youtube.com/vi/TPzBQAMot6g/maxresdefault.jpg" width="70%" />
  </a>
</p>

<p align="center">
  👉 Click the image to watch the full demo
</p>
## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **Lucide React** - Icon library
- **React Dropzone** - File upload component
- **React Markdown** - Markdown rendering
- **React Hook Form** - Form state management
- **Motion** - Animation library

### Backend
- **Next.js App Router** - API routes at `/api`
- **Node.js** - Runtime environment

### AI & ML
- **Google Gemini API** - Multiple model versions:
  - Gemini 2.5 Flash - Fast text generation
  - Gemini 2.5 Pro - Advanced reasoning
  - Gemini Embedding - Vector embeddings
- **Custom Vector Store** - Local JSON-based database

### Database & Storage
- **Firebase** - Cloud database and authentication
- **Custom JSON Vector Store** - Local knowledge base
- **CSV Support** - Data import/export

### Utilities
- **jsPDF & jsPDF-AutoTable** - PDF generation and exports
- **PapaParse** - CSV parsing
- **Date-fns** - Date manipulation
- **Clsx & Tailwind Merge** - CSS utilities

## 📁 Project Structure

```
AutoPilotX/
├── app/                           # Next.js App Router
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── agents/               # AI agents management
│   │   ├── calling-agent/        # Voice call handling
│   │   ├── dashboard/            # Main dashboard
│   │   ├── documents/            # Document management
│   │   ├── email/                # Gmail integration
│   │   ├── memory/               # Knowledge base & memory
│   │   ├── notifications/        # Notification center
│   │   ├── settings/             # User settings
│   │   ├── workflows/            # Workflow automation
│   │   └── layout.tsx            # Dashboard layout
│   ├── api/                      # Backend API routes
│   │   ├── auth/                 # Authentication (Google OAuth)
│   │   ├── chat/                 # Chat endpoint with RAG
│   │   ├── gmail/                # Gmail integration API
│   │   └── ingest/               # Document ingestion & embedding
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── not-found.tsx             # 404 page
│
├── components/                    # Reusable React components
│   ├── assistant-hub/            # AI assistant shell & UI
│   │   ├── AssistantHubShell.tsx
│   │   ├── CommandPalette.tsx    # Command palette interface
│   │   ├── RadialAssistOrb.tsx   # Radial assistant button
│   │   ├── ThemeToggle.tsx       # Dark/light theme toggle
│   │   ├── theme-store.ts        # Theme state management
│   │   └── useThemeMode.ts       # Theme hook
│   ├── DocumentUpload.tsx         # Document upload component
│   ├── ReportDownloader.tsx       # PDF report generation
│   ├── Sidebar.tsx               # Navigation sidebar
│
├── hooks/                        # Custom React hooks
│   └── use-mobile.ts             # Mobile detection hook
│
├── lib/                          # Utility libraries
│   ├── chat-history.ts           # Chat message storage
│   ├── firebase.ts               # Firebase initialization
│   ├── prompts.ts                # AI prompt templates
│   ├── utils.ts                  # General utilities
│   └── vector-store.ts           # Local vector database
│
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Shared types
│
├── public/                       # Static assets
├── firebase.json                 # Firebase configuration
├── models.json                   # AI model configurations
├── metadata.json                 # Project metadata
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
├── package.json                  # Dependencies and scripts
├── WORKING.md                    # Technical documentation
├── run_local.md                  # Local setup guide
└── README.md                     # This file
```

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [API Routes](#api-routes)
- [AI Models & Integration](#ai-models--integration)
- [Vector Store & RAG Pipeline](#vector-store--rag-pipeline)
- [Authentication](#authentication)
- [Email Integration](#email-integration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Support](#support)

---

## ✨ Features

### 🤖 Intelligent Agents
- Create and manage AI agents for specific business tasks
- Multi-agent orchestration and workflow automation
- Real-time agent monitoring and performance tracking

### 📄 Document Management
- Upload and process multiple document formats (PDF, JPG, PNG)
- Intelligent document extraction using Gemini AI models
- Structured data extraction (invoices, GST documents, etc.)
- Document organization and categorization

### 💬 AI Chat Interface
- Real-time chat with AI assistants powered by Gemini
- Retrieval-Augmented Generation (RAG) for context-aware responses
- Multi-turn conversations with conversation history
- Support for markdown rendering

### 📧 Gmail Integration
- Read and manage emails directly within the platform
- Automated email sending capabilities
- Email-based AI assistance

### 🎯 Voice Call Handling
- Record and manage business voice interactions
- Real-time call analytics and metrics

### 📊 Comprehensive Dashboard
- Real-time business metrics (invoices processed, calls handled, pending payments)
- GST compliance tracking
- Performance analytics

### 🔄 Workflow Automation
- Create and manage automated workflows
- Scheduled task execution
- Multi-step process automation

### 💾 Memory & Knowledge Base
- Persistent memory system for context retention
- Knowledge base management
- Historical data tracking

### ⚙️ Advanced Settings
- Customizable user preferences
- AI model configuration
- Theme personalization


## 🏛️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AutoPilotX Platform                      │
├─────────────────────────────────────────────────────────────┤
│                        Frontend (Next.js)                     │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│  │  Dashboard   │   Agents     │  Documents   │  Email     │ │
│  │  Analytics   │  Workflows   │  Chat        │  Memory    │ │
│  │  Settings    │  Calling     │  Notifications           │ │
│  └──────────────┴──────────────┴──────────────┴────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Backend API Routes                        │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │   /api/auth  │   /api/chat  │  /api/gmail  │             │
│  │   /api/ingest│  /api/ingest │             │             │
│  └──────────────┴──────────────┴──────────────┘             │
├─────────────────────────────────────────────────────────────┤
│              External Services Integration                   │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │ Google Auth  │  Gemini AI   │   Firebase   │             │
│  │              │   Embedding  │              │             │
│  └──────────────┴──────────────┴──────────────┘             │
├─────────────────────────────────────────────────────────────┤
│                Data Storage Layer                            │
│  ┌──────────────┬──────────────┐                            │
│  │  Vector DB   │   Firebase   │                            │
│  │ (JSON-based) │   Realtime   │                            │
│  └──────────────┴──────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow: Document Ingestion & RAG

```
1. Document Upload → 2. Extract & Parse → 3. Generate Embeddings
        ↓                    ↓                      ↓
    UI Upload          Gemini Model         Vector Store
        
        ↓                    ↓                      ↓
4. Store in Vector DB ← 5. Index with Metadata ← 6. Return Vectors
        
        ↓
7. Chat Query → 8. Similarity Search → 9. Retrieve Context
        ↓                  ↓                      ↓
    User Input        Vector DB            Relevant Docs
        
        ↓
10. Generate Response (RAG) → 11. Return to User
```

---

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-Private-red)
![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **Google Gemini API Key** - Get from [Google AI Studio](https://aistudio.google.com)
- **Firebase Project** - Set up at [Firebase Console](https://console.firebase.google.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AutoPilotX.git
   cd AutoPilotX
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Google Gemini API
   NEXT_PUBLIC_GOOGLE_API_KEY=your_gemini_api_key_here
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Google OAuth (for authentication)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Gmail API (optional, for email integration)
   GMAIL_API_KEY=your_gmail_api_key
   ```

4. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Download your service account key
   - Update `firebase.json` with your configuration

### Running Locally

**Development Server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Build for Production**
```bash
npm run build
npm run start
```

**Linting**
```bash
npm run lint
```

**Clean Build Cache**
```bash
npm run clean
```

See [run_local.md](run_local.md) and [WORKING.md](WORKING.md) for detailed development documentation.

---


## 🔌 Key Components

### 1. **AssistantHubShell** (`components/assistant-hub/`)
Main UI shell providing the interface for AI assistance with theme support and command palette.

### 2. **DocumentUpload** (`components/DocumentUpload.tsx`)
Handles document uploads with drag-and-drop support, file validation, and processing.

### 3. **RadialAssistOrb** (`components/assistant-hub/RadialAssistOrb.tsx`)
Interactive radial menu for quick access to assistant features.

### 4. **Sidebar** (`components/Sidebar.tsx`)
Navigation menu for accessing all dashboard sections.

### 5. **ReportDownloader** (`components/ReportDownloader.tsx`)
Generates and downloads PDF reports with jsPDF integration.

---

## 🔗 API Routes

### Authentication
- **`GET /api/auth/google/url`** - Get Google OAuth redirect URL
- **`GET /api/auth/google/callback`** - Handle OAuth callback

### Chat & Conversation
- **`POST /api/chat`** - Send message and get AI response with RAG
  - Body: `{ message: string, context?: Document[] }`
  - Returns: `{ response: string, sources: Document[] }`

### Document Ingestion
- **`POST /api/ingest`** - Ingest document with embedding generation
  - Body: `{ text: string, metadata?: object }`
  - Returns: `{ id: string, embedded: true }`

### Gmail Integration
- **`GET /api/gmail/emails`** - Fetch user emails
  - Returns: `{ emails: Email[] }`
  
- **`POST /api/gmail/send`** - Send email
  - Body: `{ to: string, subject: string, body: string }`
  - Returns: `{ sent: true, messageId: string }`

---

## 🧠 AI Models & Integration

### Available Models

All models are configured in [models.json](models.json):

| Model | Purpose | Capabilities |
|-------|---------|--------------|
| **Gemini 2.5 Flash** | Fast text generation, document extraction | 1M token input, 65K output, ~0.2s latency |
| **Gemini 2.5 Pro** | Advanced reasoning, complex tasks | 1M token input, 65K output, detailed analysis |
| **Gemini Embedding** | Vector embeddings for RAG | Generates 768-dim vectors for similarity search |

### Model Specifications

```json
{
  "inputTokenLimit": 1048576,      // 1M tokens
  "outputTokenLimit": 65536,        // 65K tokens
  "temperature": 1,                 // Randomness (0-2)
  "topP": 0.95,                     // Nucleus sampling
  "topK": 64,                       // Top-k sampling
  "thinking": true                  // Extended thinking enabled
}
```

### Integration Points

1. **Document Extraction** - Uses Gemini Flash to extract structured JSON from documents
2. **Chat Generation** - Uses Gemini Pro for context-aware responses
3. **Embeddings** - Uses Gemini Embedding model for RAG similarity search

---

## 🔍 Vector Store & RAG Pipeline

### RAG (Retrieval-Augmented Generation) Flow

```
User Query
    ↓
[Vector Store] → Generate Query Embedding
    ↓
Similarity Search → Retrieve Top-K Documents
    ↓
Context Preparation → Augment Prompt
    ↓
Gemini Model → Generate Response
    ↓
Return to User
```

### Vector Store Implementation

The `lib/vector-store.ts` provides a lightweight, JSON-based vector database:

- **Storage**: Local JSON file (`company_data.json`)
- **Operations**: 
  - `addDocument(text, metadata, embedding)` - Add indexed document
  - `search(queryEmbedding, topK)` - Similarity search
  - `getAllDocuments()` - Retrieve all stored documents
  - `deleteDocument(id)` - Remove document

### Embedding Generation

Documents are converted to vector embeddings using the Gemini Embedding API:

```typescript
// Example
const embedding = await generateEmbedding(documentText);
// Returns: Float32Array (768 dimensions)
```

### Supported Document Types

- **PDF** - Documents, invoices, contracts
- **Images** - PNG, JPG - Screenshots, photos, scanned documents
- **Text** - Plain text documents, extracted content
- **CSV** - Structured data, tables

---

## 🔐 Authentication

### Google OAuth Integration

- Users authenticate via Google account
- OAuth flow handled at `/api/auth/google/url` and `/api/auth/google/callback`
- Session persisted in Firebase Authentication
- Token stored securely in HttpOnly cookies

### Setup

1. Create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com)
2. Set authorized redirect URIs to `http://localhost:3000/api/auth/google/callback`
3. Add credentials to `.env.local`

---

## 📧 Email Integration

### Gmail API Integration

Seamless email management within the platform:

- **Read Emails** - Fetch and display user's inbox
- **Send Emails** - Compose and send from within the app
- **AI Email Assistant** - Get suggestions for email responses

### Prerequisites

1. Enable Gmail API in Google Cloud Console
2. Create OAuth 2.0 credentials
3. Configure scopes: `gmail.readonly`, `gmail.send`

---

## 🛠️ Development

### Running Tests

```bash
npm run test
```

### Code Quality

**ESLint**
```bash
npm run lint
```

**TypeScript Checking**
```bash
npx tsc --noEmit
```

### Best Practices

- ✅ Use TypeScript for type safety
- ✅ Follow ESLint configuration
- ✅ Use Tailwind CSS for styling
- ✅ Component prop typing with TSX
- ✅ API route error handling
- ✅ Environment variable validation

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to remote: `git push origin feature/your-feature`
4. Create Pull Request

---

## 🚀 Deployment

### Firebase Deployment

```bash
# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy
```

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

Ensure all required environment variables are set in your deployment platform:

```
NEXT_PUBLIC_GOOGLE_API_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GMAIL_API_KEY
```

---

## 📝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow existing code style
- Add TypeScript types for new functions
- Update documentation as needed
- Test changes before submitting PR

---

## 🤝 Support

### Documentation
- See [WORKING.md](WORKING.md) for technical architecture details
- See [run_local.md](run_local.md) for local development setup

### Troubleshooting

**API Key Issues**
- Verify environment variables are set correctly
- Check API quota limits in Google Cloud Console

**Firebase Connection**
- Ensure Firebase project is properly configured
- Check network connectivity

**Vector Store Issues**
- Verify `company_data.json` permissions
- Check available disk space

### Contact & Issues

For bugs, feature requests, or questions:
- Open an issue in the repository
- Contact the development team

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Hosted on [Firebase](https://firebase.google.com/)


---

**Designed for Indian MSMEs • Powered by Google Gemini • Built with Next.js**
