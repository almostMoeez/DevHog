
# DevHog Portfolio - Developer Guide

Welcome to the internal documentation for the DevHog OS Portfolio. This project is a React-based "Operating System" simulation designed for developer portfolios.

## Architecture

The project is built using:
- **React 18**: Core framework.
- **Tailwind CSS**: Styling system.
- **Lucide React**: Icon set.
- **Google GenAI**: Powering the `HogBot.exe` chat assistant.

### Key Components

1.  **`App.tsx`**: The kernel. Manages the window manager state (`windows` array), taskbar state, and handles opening/closing applications.
2.  **`components/Window.tsx`**: A generic window wrapper that handles dragging, minimizing, maximizing, and opening/closing animations.
3.  **`components/Taskbar.tsx`**: Handles the Start Menu and active window toggling.
4.  **`components/Browser.tsx`**: A simulated web browser using `iframe` to preview projects.

## How to Add a New Project

1.  Open `src/constants.ts`.
2.  Add a new entry to the `PROJECTS` array.

```typescript
{
  id: '7',
  title: 'My New App',
  description: 'Short description for the card.',
  fullDescription: 'Long description for the details view.',
  year: '2024',
  tags: ['React', 'AI'],
  link: 'https://my-app.com', // URL for the "Live Preview"
  image: 'https://placehold.co/600x400',
  featured: true,
  previewMode: 'mobile' // 'mobile' | 'desktop' - Determines default browser view
}
```

## How to Use Live Preview

The **Browser** app uses an `iframe` to render content.

### External Websites
To link to an external website, simply set the `link` property in `PROJECTS` to a valid URL (e.g., `https://example.com`).
*Note: Many major sites (Google, GitHub, Twitter) set `X-Frame-Options: DENY`. These will not render in the iframe. For a portfolio, link to your own deployments (Vercel, Netlify) which usually allow framing or can be configured to do so.*

### Internal/Test Content
You can use Data URIs to render simple HTML directly without a backend.

**Example Mobile Preview:**
```typescript
link: 'data:text/html,<html><body style="background:black;color:white;display:flex;justify-content:center;align-items:center;height:100vh;"><h1>Mobile App Preview</h1></body></html>'
```

## Customizing HogBot

To change the AI's personality:
1.  Open `src/constants.ts`.
2.  Modify the `SYSTEM_INSTRUCTION` constant.
3.  The API Key is injected via `process.env.API_KEY` automatically in the environment.

## Window Management

Windows are identified by unique string IDs.
- **Static Apps**: 'about', 'projects', 'snake', etc.
- **Dynamic Apps**: 'project-{id}', 'browser-{timestamp}'.

To open a window programmatically:
call `handleOpenApp(id, title, event)` in `App.tsx`. Passing the `event` is crucial for the "zoom-out" animation effect from the clicked icon.
