export interface ExperienceItem {
  id: string
  kind: 'Internship' | 'Event' | 'Club / Role'
  label: string
  org: string
  role?: string
  period?: string
  project?: string
  summary?: string
  color: string
}

export const experience: ExperienceItem[] = [
  {
    id: 'tata-power',
    kind: 'Internship',
    label: 'TATA POWER',
    org: 'Tata Power Central Odisha Distribution Limited',
    role: 'Summer Intern',
    period: '20/05/2025 – 30/06/2025',
    project: 'Spot Billing App',
    summary:
      'Worked on a Spot Billing App during a summer internship at Tata Power Central Odisha Distribution Limited.',
    color: '#38e8ff',
  },
  {
    id: 'vibrance-2025',
    kind: 'Event',
    label: 'VIBRANCE 2025',
    org: 'Vibrance 2025',
    role: 'Event Operations',
    summary:
      'Oversaw day-of-event operations for 3,000+ participants at Vibrance 2025.',
    color: '#b07cff',
  },
  {
    id: 'ieee-photonics',
    kind: 'Club / Role',
    label: 'IEEE PHOTONICS',
    org: 'IEEE Photonics Society',
    role: 'Treasurer',
    summary:
      'Contributed as a board member of the IEEE Photonics Society at VIT Chennai.',
    color: '#6dffb0',
  },
  {
    id: 'kalinga-jyoti',
    kind: 'Club / Role',
    label: 'KALINGA JYOTI',
    org: 'Kalinga Jyoti, VIT Chennai',
    role: 'Core Member',
    summary:
      'Served as a core member of Kalinga Jyoti at VIT Chennai.',
    color: '#ffb454',
  },
  {
    id: 'robotics-club',
    kind: 'Club / Role',
    label: 'ROBOTICS CLUB',
    org: 'Robotics Club, VIT Chennai',
    role: 'Tech Team Member',
    summary:
      'Part of the Robotics Club technical team at VIT Chennai.',
    color: '#5b8cff',
  },
  {
    id: 'discipline',
    kind: 'Club / Role',
    label: 'DISCIPLINE COMMITTEE',
    org: 'Discipline Committee ',
    role: 'Head',
    summary:
      'Served as Head of the Discipline Committee in annual cultural fest.',
    color: '#e879f9',
  },
]