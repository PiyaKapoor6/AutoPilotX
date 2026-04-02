# 🎉 AutoPilotX - Enterprise AI Assistant

For more details, you can refer to the  youtube video.:
## 🎥 Demo Video
Watch AutoPilotX in action:
https://www.youtube.com/watch?v=TPzBQAMot6g

A comprehensive AI-powered business assistant designed specifically for Indian MSMEs, featuring intelligent document processing, real-time voice conversations, automated workflows, and a powerful RAG (Retrieval-Augmented Generation) system that lets you chat with your business data in natural language.

## ✨ Features

### 🤖 AI-Powered Document Intelligence
- **Smart Document Upload**: Upload invoices, receipts, bills, and business documents with drag-and-drop interface
- **AI Data Extraction**: Uses Google Gemini AI to automatically extract GST details, totals, line items, and structured data
- **Multi-Format Support**: Processes PDF, JPG, PNG files with advanced OCR capabilities
- **Real-Time Processing**: Instant document analysis and JSON data extraction

### 🧠 Advanced RAG Pipeline (Memory)
- **Conversational Business Search**: Chat with your company data using natural language queries
- **Local Vector Database**: Custom JSON-based vector store for secure, private document embeddings
- **Semantic Search**: AI finds relevant information across all uploaded documents
- **Contextual Responses**: Retrieves and combines information from multiple documents for comprehensive answers

### 📞 Real-Time Voice Calling Agent
- **Live Voice Conversations**: Real-time AI voice agent for customer interactions
- **Business Knowledge Integration**: Access to company database during calls
- **Natural Speech Processing**: Advanced speech-to-text and text-to-speech capabilities
- **Contextual Responses**: AI understands business context and provides relevant information

### 👥 Multi-Agent AI Ecosystem
- **Document Assistant**: Extracts GST details, totals, and line items from bills automatically
- **Report Generator**: Creates daily sales, inventory, and cash flow reports in Lakhs/Crores format
- **Business Records Search**: Instantly finds old bills, customer details, or company policies
- **Email Helper**: Drafts professional replies to vendors and clients
- **Calling Agent**: Handles customer inquiries via voice with business context

### ⚙️ Intelligent Workflow Automation
- **Natural Language Task Creation**: Set up automated tasks using simple English commands
- **Rule-Based Triggers**: Automate actions based on document uploads, payment statuses, or time events
- **Multi-Step Workflows**: Chain multiple actions like "extract data → send email → wait for approval"
- **Visual Workflow Builder**: Easy-to-use interface for creating complex automation sequences

### 🔐 Secure Authentication & Data Privacy
- **Google OAuth Integration**: Secure sign-in with Google authentication
- **Local Data Storage**: All business documents and data stay on your local machine
- **Protected Routes**: Dashboard and sensitive features require authentication
- **API Security**: Secure endpoints with proper validation and error handling

### 📊 Business Intelligence Dashboard
- **Real-Time Metrics**: Track invoices processed, voice calls handled, pending payments, GST compliance
- **Document Management**: View uploaded documents and their processing status
- **Agent Activity Logs**: Monitor AI assistant actions and success rates
- **Export Capabilities**: Download reports and processed data in multiple formats

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0+ (Version 20+ recommended)
- npm (comes with Node.js)
- Google Gemini API key (free from Google AI Studio)
- Modern web browser
- Microphone access (for voice features)

### Installation

1. **Download the Project**
   ```bash
   # Extract the ZIP file to your preferred location
   cd path/to/autopilotx-folder
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create `.env.local` in the root directory:
   ```bash
   # Required: Your Google Gemini API Key
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Get Your Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a free API key
   - Add it to your `.env.local` file

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

6. **Open Your Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
AutoPilotX/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and theme
│   ├── layout.tsx               # Root layout with providers
│   ├── not-found.tsx            # Custom 404 page
│   ├── page.tsx                 # Homepage with AI orb
│   ├── api/                     # API routes
│   │   ├── auth/               # Google OAuth endpoints
│   │   │   └── google/
│   │   │       ├── callback/   # OAuth callback handler
│   │   │       └── url/        # OAuth URL generator
│   │   ├── chat/               # RAG chat API
│   │   │   └── route.ts
│   │   ├── gmail/              # Email integration
│   │   │   ├── emails/         # Email fetching
│   │   │   └── send/           # Email sending
│   │   └── ingest/             # Document ingestion
│   │       └── route.ts
│   └── (dashboard)/            # Protected dashboard routes
│       ├── layout.tsx          # Dashboard layout
│       ├── page.tsx            # Main dashboard
│       ├── agents/             # AI agents management
│       │   ├── page.tsx        # Agents overview
│       │   └── [id]/          # Individual agent pages
│       ├── calling-agent/      # Voice calling interface
│       │   └── page.tsx
│       ├── dashboard/          # Dashboard overview
│       │   └── page.tsx
│       ├── memory/             # RAG chat interface
│       │   └── page.tsx
│       └── workflows/          # Workflow automation
│           └── page.tsx
├── components/                   # React components
│   ├── DocumentUpload.tsx       # Document upload with AI processing
│   ├── RadialNav.tsx           # Radial navigation menu
│   ├── ReportDownloader.tsx    # Report download component
│   ├── Sidebar.tsx             # Dashboard sidebar
│   ├── ThemeModeToggle.tsx     # Dark/light theme toggle
│   └── ThemeProvider.tsx       # Theme context provider
├── hooks/                       # Custom React hooks
│   └── use-mobile.ts           # Mobile device detection
├── lib/                         # Utility libraries
│   ├── chat-history.ts         # Chat conversation management
│   ├── firebase.ts             # Firebase configuration
│   ├── prompts.ts              # AI system prompts
│   ├── utils.ts                # General utilities
│   └── vector-store.ts         # Local vector database
├── types/                       # TypeScript definitions
│   └── index.ts                # Global type definitions
├── .env.local                   # Environment variables
├── company_data.json            # Local vector store data
├── firebase.json               # Firebase project config
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This documentation
```

## 🎨 Customization

### AI Model Configuration
Customize AI behavior in `lib/prompts.ts`:
- Modify system prompts for different response styles
- Adjust document extraction templates
- Configure conversation context and memory

### Vector Database Settings
Update `lib/vector-store.ts` for storage behavior:
- Change similarity thresholds for search accuracy
- Modify the number of retrieved results
- Adjust embedding storage format

### Business Database
Customize the calling agent's knowledge base in `app/(dashboard)/calling-agent/page.tsx`:
- Add your company-specific data
- Update customer information
- Modify product inventory details

### UI Theme
Modify the theme in `tailwind.config.ts`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#your-brand-color",
        accent: "#your-accent-color",
      }
    }
  }
}
```

### Workflow Templates
Extend automation in `app/(dashboard)/workflows/page.tsx`:
- Add new trigger types
- Create custom action sequences
- Configure approval workflows

## ✅ Fully Implemented Features

### 📄 Advanced Document Processing Pipeline
- **Multi-Format Upload**: Support for PDF, image formats with automatic processing
- **AI-Powered Extraction**: Gemini AI extracts structured business data
- **Progress Tracking**: Real-time upload and processing status
- **Error Handling**: Robust validation and error recovery
- **Batch Processing**: Handle multiple documents simultaneously

### 🧠 Intelligent RAG Chat System
- **Natural Language Queries**: Ask questions in plain English about your business
- **Vector Similarity Search**: Cosine similarity algorithm for document retrieval
- **Context Assembly**: Combines relevant information from multiple sources
- **Conversation Memory**: Maintains context across chat sessions
- **Markdown Responses**: Formatted AI responses with proper styling

### 📞 Live Voice Calling Agent
- **Real-Time Audio Processing**: WebRTC-based voice communication
- **Business Context Awareness**: Access to company database during calls
- **Natural Conversation Flow**: AI understands context and provides relevant responses
- **Audio Quality Management**: Optimized audio processing and noise reduction
- **Session Management**: Proper connection handling and cleanup

### 👥 Comprehensive Agent Ecosystem
- **Document Assistant**: Automated GST and invoice data extraction
- **Report Generator**: Daily business reports in Indian numbering format
- **Business Records Search**: Instant access to historical business data
- **Email Helper**: Professional email drafting for business communication
- **Calling Agent**: Voice-based customer service with business intelligence

### ⚙️ Workflow Automation Engine
- **Natural Language Creation**: Build workflows using simple English commands
- **Conditional Logic**: If-then automation based on business events
- **Multi-Step Sequences**: Chain multiple actions and approvals
- **Visual Builder**: Intuitive interface for complex automation
- **Status Monitoring**: Track workflow execution and success rates

### 📊 Business Intelligence Dashboard
- **Real-Time KPIs**: Invoices processed, calls handled, payment status, compliance
- **Document Analytics**: Upload statistics and processing metrics
- **Agent Performance**: Success rates and activity logs
- **Export Functionality**: Download reports in PDF and CSV formats

## 🔧 Additional Features (Ready to Implement)

### Enhanced Document Processing
- Batch document upload with queue management
- Advanced OCR for handwritten documents
- Multi-language document support
- Document categorization and auto-tagging
- Integration with cloud storage (Google Drive, Dropbox)

### Advanced AI Capabilities
- Multi-document cross-referencing
- Predictive analytics from business data
- Automated report generation with insights
- Integration with accounting software
- Voice command processing for hands-free operation

### Communication Integrations
- WhatsApp Business API integration
- SMS notifications for important events
- Email automation with templates
- Integration with popular CRM systems
- Social media monitoring and response

### Analytics & Reporting
- Advanced business intelligence dashboard
- Trend analysis and forecasting
- Compliance reporting for GST/tax purposes
- Customer behavior analytics
- Performance benchmarking against industry standards

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add `NEXT_PUBLIC_GEMINI_API_KEY` environment variable
4. Deploy automatically with zero configuration

### Other Platforms
- **Netlify**: Static deployment with serverless functions
- **Railway**: Full-stack deployment with database support
- **AWS/GCP**: Custom cloud infrastructure deployment
- **Docker**: Containerized deployment for enterprise environments

## 🎯 Pages Overview

- **`/`** - Homepage with interactive AI orb and navigation
- **`/dashboard`** - Main dashboard with business metrics and document upload
- **`/memory`** - RAG chat interface for querying business documents
- **`/agents`** - AI agents overview and management
- **`/agents/[id]`** - Individual agent configuration and details
- **`/workflows`** - Workflow automation creation and monitoring
- **`/calling-agent`** - Real-time voice calling interface
- **`/api/ingest`** - Document processing and embedding endpoint
- **`/api/chat`** - RAG query processing and response generation
- **`/api/gmail/emails`** - Email fetching and management
- **`/api/gmail/send`** - Email sending functionality

## 🛡 Security Features

- **API Key Protection**: Secure storage of Gemini API credentials
- **Local Data Storage**: Business documents never leave your machine
- **OAuth Security**: Google authentication with proper token handling
- **Input Validation**: Comprehensive validation on all API endpoints
- **Rate Limiting**: Protection against API abuse
- **HTTPS Enforcement**: Secure data transmission protocols

## 📱 Mobile Experience

- **Responsive Design**: Fully optimized for mobile and tablet devices
- **Touch-Friendly Interface**: Large buttons and gesture support
- **Progressive Web App**: Installable PWA with offline capabilities
- **Voice Integration**: Mobile-optimized voice calling features
- **Adaptive Layouts**: Different experiences for different screen sizes

## 🎨 Animation Details

- **Page Transitions**: Smooth navigation with loading states
- **Interactive Elements**: Hover effects and micro-interactions
- **Progress Indicators**: Visual feedback during processing
- **Voice Call Animations**: Real-time audio visualization
- **Dashboard Animations**: Metric updates and status changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes with proper testing
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to the branch (`git push origin feature/new-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or support:
- Check the `WORKING.md` file for technical implementation details
- Review `run_local.md` for detailed setup instructions
- Create an issue on GitHub
- Contact the development team

---

**Built with ❤️ for Indian MSMEs**

*AutoPilotX - Your AI-powered business companion for the modern enterprise.*
