export interface Achievement {
  id: string
  /** Award / rank line. */
  title: string
  event?: string
  /** Short collectible tier label. */
  tier: string
  /** Additional context displayed in the achievement panel. */
  summary?: string
  color: string
}

export const achievements: Achievement[] = [
  {
    id: 'amazon-ml',
    title: 'Amazon ML Summer School 2026',
    event: 'Amazon',
    tier: 'SELECTED',
    summary:
      'Selected for Amazon ML Summer School 2026.',
    color: '#ffb454',
  },
  {
    id: 'flipkart-grid',
    title: 'National Semi-Finalist',
    event: 'Flipkart GRID 7.0',
    tier: 'NATIONAL',
    summary:
      'Reached the national semi-finalist stage of Flipkart GRID 7.0.',
    color: '#b07cff',
  },
  {
    id: 'technovit',
    title: 'Winner',
    event: 'TechnoVIT 2024 Full Stack Hackathon',
    tier: 'WINNER',
    summary:
      'Won the Full Stack Hackathon at TechnoVIT 2024.',
    color: '#ffcf5a',
  },
  {
    id: 'glitchcon',
    title: 'Domain Winner',
    event: 'GLITCHCON 2.0 Hackathon',
    tier: 'DOMAIN WINNER',
    summary:
      'Earned the Domain Winner distinction at GLITCHCON 2.0.',
    color: '#ffcf5a',
  },
  {
    id: 'dataquest',
    title: 'Ranked 2nd among 100+ teams',
    event: 'DataQuest 2.0 Hackathon',
    tier: 'RANK 2',
    summary:
      'Secured 2nd place among 100+ participating teams at DataQuest 2.0.',
    color: '#38e8ff',
  },
]