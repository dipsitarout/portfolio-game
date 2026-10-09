import type { HoloShape } from './types'

export interface Project {
  id: string
  name: string
  /** Short type/category shown on the 3D station sign and panel. */
  category: string
  /** Project description displayed in the panel. */
  description: string
  stack: string[]
  /** Agent pipeline, when applicable. */
  agents?: string[]
  features: string[]
  /** Optional disclaimer shown at the bottom of the panel. */
  note?: string
  /** Empty string means the link is unavailable. */
  github: string
  demo: string
  color: string
  shape: HoloShape
}

const CLINICAL_NOTE =
  'Not a medical device. Outputs are not clinically validated and must not be used for diagnosis.'

export const projects: Project[] = [
  {
    id: 'diseaserisk-ai',
    name: 'DiseaseRisk AI',
    category: 'AI / HEALTHCARE • MULTI-AGENT',
    description:
      'An explainable multi-agent system for disease risk assessment and clinical decision support, combining machine learning predictions with interpretable explanations and clinical context.',
    stack: [
      'React',
      'FastAPI',
      'PostgreSQL',
      'Machine Learning',
      'SHAP',
      'LangGraph',
      'RAG',
    ],
    agents: [
      'Prediction Agent',
      'Explanation Agent',
      'Verification Agent',
      'Recommendation Agent',
    ],
    features: [
      'Machine-learning-based disease risk prediction',
      'Prediction explanations using SHAP',
      'RAG-based clinical context retrieval',
      'Clinical risk report generation',
      'Doctor dashboard',
    ],
    note: CLINICAL_NOTE,
    github: 'https://github.com/dipsitarout/DiseaseRiskAI',
    demo: '',
    color: '#38e8ff',
    shape: 'icosahedron',
  },
  {
    id: 'clinsight',
    name: 'ClinSight',
    category: 'AI / HEALTHCARE • RAG',
    description:
      'An AI-powered clinical intelligence and decision-support platform that combines document processing, information retrieval and retrieval-augmented generation.',
    stack: [
      'React',
      'FastAPI',
      'Gemini API',
      'RAG',
      'FAISS',
      'Chroma',
      'OCR',
      'LangGraph / Multi-Agent Architecture',
    ],
    features: [
      'Clinical document ingestion',
      'OCR-based text extraction',
      'Vector-based information retrieval',
      'Patient context integration',
      'RAG-based clinical reasoning',
      'Agent orchestration',
      'Audit-trail concept',
    ],
    note: CLINICAL_NOTE,
    github: 'https://github.com/dipsitarout/ClinSight',
    demo: 'https://clinsightai.vercel.app/',
    color: '#b07cff',
    shape: 'dodecahedron',
  },
  {
    id: 'krishideep',
    name: 'KrishiDeep',
    category: 'AI/ML • AGRICULTURE',
    description:
      'An agriculture-focused AI/ML project combining web and mobile technologies with machine learning and IoT-related components.',
    stack: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'React',
      'Flutter',
      'Material UI',
      'Python',
      'FastAPI',
      'XGBoost',
      'TensorFlow',
      'MongoDB',
      'Firebase',
      'Arduino',
      'ESP32',
      'Docker',
    ],
    features: [
      'Agriculture-focused AI/ML application',
      'Machine-learning-based analysis',
      'Web and mobile application components',
      'IoT and hardware-related components',
    ],
    github: 'https://github.com/dipsitarout/KrishiDeep',
    demo: 'https://krisi-deep-web.vercel.app/login',
    color: '#6dffb0',
    shape: 'cone',
  },
  {
    id: 'threatshield',
    name: 'ThreatShield',
    category: 'AI • CYBERSECURITY',
    description:
      'An AI-powered cybersecurity project designed around security-event analysis, anomaly detection, threat monitoring and a blockchain-based audit trail.',
    stack: [
      'XGBoost',
      'LSTM',
      'Isolation Forest',
      'Blockchain',
      'Docker',
    ],
    features: [
      'Login-log analysis',
      'File-access monitoring',
      'Email-data analysis',
      'Device-event monitoring',
      'AI-based threat detection',
      'Anomaly detection with Isolation Forest',
      'Blockchain-based audit trail',
      'Hash-linked records and timestamps',
      'Security Operations Center (SOC) dashboard',
      'Threat statistics and alerts',
    ],
    github: 'https://github.com/dipsitarout/Dataquestfinal_33',
    demo: 'https://dataquestfinal-33.vercel.app/',
    color: '#ff6b8b',
    shape: 'octahedron',
  },
  {
    id: 'event-portal',
    name: 'Event Portal',
    category: 'FULL-STACK WEB',
    description:
      'A full-stack event management platform built with React and a Node.js backend, using MongoDB for data management.',
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    features: [
      'Event creation and management',
      'Event registration',
      'Event dashboard',
      'REST API-based backend',
      'MongoDB data management',
    ],
    github: 'https://github.com/dipsitarout/Event_Ops',
    demo: 'https://v-event-phi.vercel.app/auth/register',
    color: '#ffb454',
    shape: 'box',
  },
  {
    id: 'ai-pdf-assistant',
    name: 'AI PDF Knowledge Assistant',
    category: 'AI • RAG / DOCUMENT INTELLIGENCE',
    description:
      'A Retrieval-Augmented Generation (RAG) application that lets users query PDF documents in natural language and receive document-grounded answers with page-level citations.',
    stack: [
      'Python',
      'Streamlit',
      'LangChain',
      'Groq',
      'Llama 3.1',
      'Sentence Transformers',
      'FAISS',
      'PyPDFLoader',
      'RAG',
    ],
    features: [
      'Upload and query multiple PDFs',
      'Semantic search using Sentence Transformers',
      'Retrieval-Augmented Generation pipeline',
      'Document-grounded question answering',
      'Page-level source citations',
      'Metadata filtering by document and page range',
      'Conversational memory',
      'Context-aware query rewriting',
      'PDF page previews for retrieved sources',
      'Export chat history as PDF',
    ],
    github: 'https://github.com/dipsitarout/AI-PDF-ASSISANT',
    demo: 'https://roqslrsyx4emtyn88iczd9.streamlit.app/',
    color: '#5b8cff',
    shape: 'torusKnot',
  },
  {
    id: 'library-management',
    name: 'Library Management System',
    category: 'FULL-STACK WEB',
    description:
      'A full-stack library management application built using React and a Node.js/Express backend with MongoDB and Mongoose.',
    stack: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
    ],
    features: [],
    github: 'https://github.com/dipsitarout/LIBRARY_MANAGEMENT',
    demo: '',
    color: '#e879f9',
    shape: 'torus',
  },
]