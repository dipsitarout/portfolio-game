export interface Skill {
  name: string
  blurb: string
}

export interface SkillGroup {
  id: 'frontend' | 'backend' | 'databases' | 'ai' | 'tools'
  name: string
  color: string
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    name: 'FRONTEND',
    color: '#38e8ff',
    skills: [
      {
        name: 'React.js',
        blurb: 'Builds reusable, component-based interfaces for interactive web applications.',
      },
      {
        name: 'Next.js',
        blurb: 'A React framework for application routing, rendering and full-stack web development.',
      },
      {
        name: 'HTML',
        blurb: 'Structures web pages using semantic markup and accessible content.',
      },
      {
        name: 'CSS',
        blurb: 'Styles responsive layouts, visual components, animations and page transitions.',
      },
      {
        name: 'JavaScript',
        blurb: 'Powers interactive browser experiences and JavaScript-based application logic.',
      },
      {
        name: 'Tailwind CSS',
        blurb: 'Utility-first styling for building consistent, responsive user interfaces.',
      },
      {
        name: 'Redux Toolkit',
        blurb: 'Organizes shared application state and simplifies Redux workflows.',
      },
      {
        name: 'React Router DOM',
        blurb: 'Handles client-side navigation and route-based views in React applications.',
      },
    ],
  },
  {
    id: 'backend',
    name: 'BACKEND',
    color: '#b07cff',
    skills: [
      {
        name: 'Node.js',
        blurb: 'Runs JavaScript on the server for APIs and backend applications.',
      },
      {
        name: 'Express.js',
        blurb: 'Provides routing and middleware for building Node.js web servers and REST APIs.',
      },
      {
        name: 'FastAPI',
        blurb: 'Builds Python APIs with request validation and automatically generated API documentation.',
      },
    ],
  },
  {
    id: 'databases',
    name: 'DATABASES',
    color: '#6dffb0',
    skills: [
      {
        name: 'MongoDB',
        blurb: 'Stores application data in flexible document-oriented collections.',
      },
      {
        name: 'PostgreSQL',
        blurb: 'A relational database for structured data and SQL-based queries.',
      },
      {
        name: 'Redis',
        blurb: 'An in-memory data store commonly used for caching and fast data access.',
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI / ML',
    color: '#e879f9',
    skills: [
      {
        name: 'Python',
        blurb: 'A core language for machine learning, data processing and AI application development.',
      },
      {
        name: 'Machine Learning',
        blurb: 'Develops predictive models by learning patterns from data.',
      },
      {
        name: 'RAG',
        blurb: 'Combines information retrieval with language models to generate answers grounded in external documents.',
      },
      {
        name: 'LangGraph',
        blurb: 'Orchestrates stateful, multi-step workflows and agent-based applications.',
      },
      {
        name: 'FAISS',
        blurb: 'Supports efficient similarity search and retrieval across vector embeddings.',
      },
      {
        name: 'Chroma',
        blurb: 'Stores and retrieves vector embeddings for semantic search and RAG applications.',
      },
      {
        name: 'SHAP',
        blurb: 'Explains model predictions by estimating feature contributions.',
      },
      {
        name: 'Computer Vision',
        blurb: 'Enables systems to process and interpret visual information.',
      },
      {
        name: 'NLP',
        blurb: 'Works with human language for tasks such as text processing and information extraction.',
      },
      {
        name: 'Multi-Agent Systems',
        blurb: 'Coordinates multiple AI agents to handle different parts of a workflow.',
      },
    ],
  },
  {
    id: 'tools',
    name: 'TOOLS',
    color: '#ffb454',
    skills: [
      {
        name: 'Git',
        blurb: 'Tracks code changes and supports version control across development workflows.',
      },
      {
        name: 'GitHub',
        blurb: 'Hosts repositories and supports code collaboration and project management.',
      },
      {
        name: 'Vite',
        blurb: 'Provides a fast development server and build tooling for frontend applications.',
      },
      {
        name: 'Figma',
        blurb: 'Supports collaborative interface design, wireframing and prototyping.',
      },
      {
        name: 'Adobe XD',
        blurb: 'Supports interface design and interactive experience prototyping.',
      },
      {
        name: 'Sketch',
        blurb: 'A design tool for creating digital interfaces and visual assets.',
      },
    ],
  },
]