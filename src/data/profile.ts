import type { PanelLink } from './types'

/** Main portfolio website. */
export const PORTFOLIO_URL = 'https://portfolio-dipsita.vercel.app/'

export const profile = {
  name: 'DIPSITA ROUT',
  role: 'AI/ML • FULL STACK DEVELOPER',
  tagline: 'BUILDING INTELLIGENT DIGITAL EXPERIENCES',
  degree: 'B.Tech Computer Science & Engineering',
  specialization: 'Artificial Intelligence & Machine Learning',
  university: 'VIT Chennai',
  summary:
    'I am a Computer Science student passionate about Artificial Intelligence, Machine Learning and full-stack development. I enjoy building practical AI applications, intelligent document systems and interactive digital experiences. My work spans RAG pipelines, multi-agent architectures and web application development, with a focus on turning ideas into useful products.',
}

/** Contact and professional links. */
export const contactLinks: PanelLink[] = [
  {
    label: 'GITHUB',
    url: 'https://github.com/dipsitarout',
  },
  {
    label: 'LINKEDIN',
    url: 'https://www.linkedin.com/in/dipsita-rout/',
  },
  {
    label: 'EMAIL',
    url: 'mailto:dipsitarout@gmail.com',
  },
  {
    label: 'RESUME',
    url: 'https://drive.google.com/file/d/1SYJHYS0b-iWLaou0Wv4xAkkWYkTInlp7/view?usp=sharing',
  },
  {
    label: 'PORTFOLIO SITE',
    url: PORTFOLIO_URL,
  },
]