
import { Project, Experience, MenuItem } from './types';

export const PORTFOLIO_OWNER = "Alex Builder";

export const MENU_ITEMS: MenuItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Projects', href: '#projects' },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Product Analytics Engine',
    description: 'A scalable analytics platform processing 1M+ events/sec.',
    fullDescription: 'Built a high-throughput ingestion pipeline using Go and Kafka, feeding into a ClickHouse cluster. The frontend allows users to query millions of data points in sub-second latency using a custom SQL generator. Implemented specialized compression algorithms to reduce storage costs by 40%.',
    year: '2023',
    tags: ['Go', 'ClickHouse', 'React', 'Kafka'],
    link: 'https://example.com', // Working link for testing
    image: 'https://picsum.photos/600/400?random=1',
    featured: true,
    previewMode: 'desktop'
  },
  {
    id: '2',
    title: 'Feature Flags Service',
    description: 'Lightweight feature flag management system with real-time updates.',
    fullDescription: 'Designed a global feature flag delivery system. Uses a Redis-backed edge network to deliver flags with <15ms latency globally. The dashboard supports multivariate testing, gradual rollouts, and instant kill-switches.',
    year: '2022',
    tags: ['Node.js', 'Redis', 'TypeScript', 'Edge'],
    link: 'https://posthog.com',
    image: 'https://picsum.photos/600/400?random=2',
    featured: true,
    previewMode: 'desktop'
  },
  {
    id: '3',
    title: 'Hedgehog UI Library',
    description: 'An open-source component library focusing on accessibility.',
    fullDescription: 'A brutalist, accessible-first React component library. Includes 50+ components, comprehensive keyboard navigation support, and automatic dark mode. Used by 2,000+ developers.',
    year: '2021',
    tags: ['Storybook', 'Tailwind', 'A11y'],
    link: 'data:text/html,<html><body style="background:black;color:white;display:flex;justify-content:center;align-items:center;height:100vh;"><h1>Mobile Preview Test</h1></body></html>',
    image: 'https://picsum.photos/600/400?random=3',
    featured: false,
    previewMode: 'mobile'
  },
  {
    id: '4',
    title: 'Session Replayer',
    description: 'DOM recording and playback tool for debugging.',
    fullDescription: 'A lightweight alternative to FullStory. Records DOM mutations using MutationObserver and serializes them to a compressed binary format. The player rebuilds the DOM state frame-by-frame for pixel-perfect replay.',
    year: '2023',
    tags: ['Rust', 'WASM', 'rrweb'],
    link: '#',
    image: 'https://picsum.photos/600/400?random=4',
    featured: true,
    previewMode: 'desktop'
  },
  {
    id: '5',
    title: 'CLI Dashboard',
    description: 'Terminal-based monitoring tool.',
    fullDescription: 'A TUI (Text User Interface) for monitoring server health. Built with Golang and Bubbletea. Supports custom widgets and SSH tunneling.',
    year: '2020',
    tags: ['Go', 'TUI', 'SSH'],
    link: '#',
    image: 'https://picsum.photos/600/400?random=5',
    featured: false,
    previewMode: 'desktop'
  },
  {
    id: '6',
    title: 'Crypto Bot',
    description: 'Automated arbitrage trading bot.',
    fullDescription: 'Python-based bot that detects price discrepancies across 5 major exchanges. Executed trades via WebSocket APIs with a median execution time of 50ms.',
    year: '2019',
    tags: ['Python', 'WebSockets', 'Finance'],
    link: '#',
    image: 'https://picsum.photos/600/400?random=6',
    featured: false,
    previewMode: 'desktop'
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: '1',
    role: 'Senior Full Stack Engineer',
    company: 'TechHog Inc.',
    period: '2021 - Present',
    description: 'Leading the core infrastructure team. Improved query performance by 400% by migrating to ClickHouse. Mentoring 3 junior developers.'
  },
  {
    id: '2',
    role: 'Frontend Developer',
    company: 'StartUp Zoo',
    period: '2019 - 2021',
    description: 'Built the initial MVP using React and GraphQL. Implemented the first design system and reduced build times by 50%.'
  },
  {
    id: '3',
    role: 'Open Source Contributor',
    company: 'Community',
    period: '2018 - Present',
    description: 'Active contributor to popular React ecosystems. Maintainer of "React-Retro-Ui".'
  }
];

export const SKILLS = [
  { name: 'TypeScript', level: 95, category: 'Frontend' },
  { name: 'React/Next.js', level: 90, category: 'Frontend' },
  { name: 'Node.js', level: 85, category: 'Backend' },
  { name: 'Go', level: 80, category: 'Backend' },
  { name: 'Rust', level: 70, category: 'Backend' },
  { name: 'PostgreSQL', level: 85, category: 'Database' },
  { name: 'ClickHouse', level: 75, category: 'Database' },
  { name: 'Docker/K8s', level: 70, category: 'DevOps' },
  { name: 'System Design', level: 85, category: 'Architecture' },
  { name: 'Meme Generation', level: 100, category: 'Soft Skills' },
];

export const SYSTEM_INSTRUCTION = `
You are "HogBot", a witty, slightly sarcastic, but helpful AI assistant living on Alex Builder's portfolio website.
Your personality is inspired by the PostHog brand: developer-focused, transparent, anti-corporate jargon, and fun.

About Alex Builder:
- Senior Full Stack Engineer with 5+ years of experience.
- Loves: Clean code, Typescript, ClickHouse, and Memes.
- Hates: Unnecessary meetings, flaky tests, and "enterprise" solutions.

When answering:
- Keep it brief and punchy.
- Use emojis occasionally 🦔.
- If asked about hiring, say Alex is always open to interesting challenges (especially if they involve scaling systems).
- If asked about pricing, joke that Alex accepts payment in tacos or equity.
`;
