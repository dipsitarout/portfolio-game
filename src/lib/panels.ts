import type { Achievement } from '../data/achievements'
import type { ExperienceItem } from '../data/experience'
import { contactLinks, profile } from '../data/profile'
import type { Project } from '../data/projects'
import type { Skill, SkillGroup } from '../data/skills'
import type { PanelContent } from '../data/types'
import { useGameStore } from '../store/gameStore'

/** Open a panel and release pointer lock so its links are clickable. */
export function showPanel(c: PanelContent) {
  useGameStore.getState().openPanel(c)

  if (document.pointerLockElement) {
    document.exitPointerLock()
  }
}

/** Close the panel and recapture the mouse after a user gesture. */
export function hidePanel() {
  const s = useGameStore.getState()

  if (!s.panel) return

  s.closePanel()
  document.body.requestPointerLock?.()
}

export const projectPanel = (p: Project): PanelContent => ({
  eyebrow: 'PROJECT',
  title: p.name.toUpperCase(),
  category: p.category,
  body: p.description,
  tagsHeading: p.stack.length ? 'TECH STACK' : undefined,
  tags: p.stack,
  sections: [
    ...(p.features.length
      ? [{ heading: 'KEY FEATURES', items: p.features }]
      : []),
    ...(p.agents?.length
      ? [{ heading: 'AGENT PIPELINE', items: p.agents }]
      : []),
  ],
  note: p.note,
  links: [
    { label: 'GITHUB', url: p.github || undefined },
    { label: 'LIVE DEMO', url: p.demo || undefined },
  ],
})

export const skillPanel = (
  g: SkillGroup,
  s: Skill,
): PanelContent => ({
  eyebrow: g.name,
  title: s.name.toUpperCase(),
  body: s.blurb,
})

export const experiencePanel = (
  e: ExperienceItem,
): PanelContent => ({
  eyebrow: e.kind.toUpperCase(),
  title: e.org.toUpperCase(),
  subtitle: [e.role, e.period].filter(Boolean).join('  ·  ') || undefined,
  body: e.summary,
  sections: [
    ...(e.project
      ? [{ heading: 'PROJECT', items: [e.project] }]
      : []),
  ],
})

export const achievementPanel = (
  a: Achievement,
  index: number,
  total: number,
): PanelContent => ({
  eyebrow: 'ACHIEVEMENT UNLOCKED',
  title: (a.event ?? a.title).toUpperCase(),
  subtitle: a.event ? a.title : undefined,
  body: a.summary,
  tagsHeading: `COLLECTIBLE ${index + 1} OF ${total}`,
  tags: [a.tier],
})

export const welcomePanel: PanelContent = {
  eyebrow: 'NAVIGATION TERMINAL',
  title: 'WELCOME TO MY DIGITAL WORLD.',
  body: 'Explore the facility to discover my projects, skills, experience and achievements.',
}

export const profilePanel: PanelContent = {
  eyebrow: 'ABOUT ME',
  title: 'BEYOND THE CODE',
  body: profile.summary,
  sections: [
    {
      heading: 'WHAT I BUILD',
      items: [
        'AI and machine learning applications',
        'RAG-based knowledge systems',
        'Multi-agent AI workflows',
        'Full-stack web applications',
      ],
    },
    {
      heading: 'MY FOCUS',
      items: [
        'Practical AI solutions',
        'Intelligent user experiences',
        'Continuous learning and experimentation',
      ],
    },
  ],
}

export const directoryPanel: PanelContent = {
  eyebrow: 'FACILITY DIRECTORY',
  title: 'WHERE TO GO',
  sections: [
    {
      heading: 'FROM THIS HALL',
      items: [
        'West door: Profile Lab',
        'East door: Skills Lab',
        'North door: Project Lab',
      ],
    },
    {
      heading: 'FROM THE PROJECT LAB',
      items: [
        'West door: Experience Lab',
        'East door: Achievement Chamber',
        'North door: Contact Terminal',
      ],
    },
  ],
}

export const contactPanel: PanelContent = {
  eyebrow: 'CONTACT TERMINAL',
  title: "LET'S BUILD SOMETHING.",
  body: profile.name,
  links: contactLinks.map((l) => ({
    ...l,
    url: l.url || undefined,
  })),
}