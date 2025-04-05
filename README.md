# Pasa - AI Job Application Assistant

A Chrome extension that automates and enhances the job application process using AI.

## Features

- **Autofill Application Forms**: Automatically fill out job applications on LinkedIn, Indeed, Wellfound, and more
- **Resume Analyzer**: AI-powered resume scoring and suggestions to match job descriptions
- **Cover Letter Generator**: Create tailored cover letters for each job using AI
- **Application Tracker**: Keep track of all your job applications in one place

## Project Structure

```
/
├── src/                    # Source code
│   ├── components/         # React components
│   │   └── ui/             # Shadcn UI components
│   ├── lib/                # Utilities and helper functions
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # CSS and Tailwind styles
│   ├── background.ts       # Extension background script
│   ├── content.ts          # Content script for injecting UI
│   └── popup.tsx           # Popup UI entry point
│
├── public/                 # Static assets
│   ├── manifest.json       # Chrome extension manifest
│   └── popup.html          # HTML for extension popup
│
├── prisma/                 # Database schema and migrations
│
└── docs/                   # Documentation
    ├── prd.md              # Product Requirements Document
    └── userflow.md         # User Flow Documentation
```

## Development

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)
- Chrome browser

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Start the development server:
   ```
   pnpm dev
   ```
4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

### Building for Production

```
pnpm build
```

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + ShadcnUI + Framer Motion
- Prisma + NeonDB
- OpenAI for AI capabilities
- Stripe for payment processing

## Roadmap

- [x] Phase 1: Project Setup, UI Scaffolding (Week 1)
- [ ] Phase 2: Resume Analyzer + Upload (Week 2) 
- [ ] Phase 3: Cover Letter Generator + Storage (Week 3)
- [ ] Phase 4: Autofill on Job Boards (Week 4-5)
- [ ] Phase 5: Stripe Integration + Tiers (Week 6)
- [ ] Phase 6: Launch on Product Hunt (Week 7)
- [ ] Phase 7: Post-launch Iterations (Week 8-10)

## License

[MIT License](LICENSE) 