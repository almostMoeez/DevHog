
export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription?: string; // Extended details for the detailed view
  year: string;
  tags: string[];
  link: string;
  image: string;
  featured?: boolean;
  previewMode?: 'mobile' | 'desktop'; // New field for browser view preference
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MenuItem {
  label: string;
  href: string;
}

// Changed from union type to string to support dynamic IDs like 'project-1'
export type WindowId = string;

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  isMinimized: boolean;
  originRect?: { x: number; y: number; width: number; height: number };
  metadata?: any; // Generic bucket for window-specific data (url, viewMode, etc)
}
