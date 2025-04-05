# 📄 Product Requirements Document (PRD)

**Product Name:** Pasa  
**Type:** Chrome Extension + AI-Powered Job Assistant  
**Owner:** Leslie  
**Tech Stack:** Vite, React, TailwindCSS, Shadcn, Radix, Framer Motion, Cursor AI, pnpm, Prisma, NeonDB, Stripe, OpenAI, Backblaze B2

---

## 🧠 1. Problem Statement

Job seekers waste countless hours filling repetitive forms, writing generic cover letters, and tracking applications manually — all while dealing with unclear resume feedback and low callback rates.

---

## 🌟 2. Solution Overview

**Pasa** is a smart, AI-powered Chrome extension that automates and enhances the job application process. It fills out applications, analyzes and scores resumes, generates tailored cover letters, and tracks all applications in one place — so users can apply smarter, faster, and with confidence.

---

## 🛠 3. Core Features

### 🔄 Autofill Job Forms
- Detect and auto-fill applications on LinkedIn, Indeed, Wellfound, etc.
- Smart parsing of job forms
- Optional customization for specific fields

### 🧠 Resume Analyzer
- AI-powered resume scoring
- Keyword match against job descriptions
- Suggestions for improvements
- Resume upload and storage via Backblaze B2

### ✍️ AI Cover Letter Generator
- Auto-generates role-specific cover letters using uploaded resume + job description
- Editable and exportable
- Stored per job

### 📊 Application Tracker
- Users can track jobs manually or automatically from autofill sessions
- Statuses: applied, interview, offer, rejected
- Metrics dashboard (Success rate, follow-ups)

### 🧭 Smart Job Recommendations *(Post-MVP)*
- Real-time job match alerts based on uploaded resumes and preferences
- Integrate APIs like Remotive, Wellfound, and LinkedIn job search

### 🤖 AI Interview Coach *(Future Phase)*
- Practice company-specific interview questions
- Mock interview simulation using AI

---

## 💰 4. Monetization Strategy

| Tier       | Features                                                            | Price          |
|------------|---------------------------------------------------------------------|----------------|
| Free       | Limited autofills, resume score (basic), 1 cover letter/month      | $0             |
| Pro        | Unlimited autofill, resume optimizer, unlimited cover letters      | $9/mo or $99/yr|
| Enterprise | For bootcamps, schools, recruiters                                 | Custom         |

### Monetization Stack:
- Stripe for subscription management
- Webhooks to sync access levels
- In-app upgrades from the popover/dashboard

---

## 📐 5. UI/UX Scope

### A. Floating Widget (Injected into job boards)
- Autofill Button
- Resume Score Tooltip
- Cover Letter Assistant Popup

### B. Chrome Popover
- Resume upload + score view
- Cover Letter generator
- Application tracker view
- Upgrade CTA

### C. Web Dashboard (Optional / Future)
- Advanced resume insights
- Application timeline
- Settings, plan management

---

## ⚙️ 6. Technical Architecture
apps/
- extension/        → Chrome Extension (Vite)
- dashboard/        → Optional Web App
packages/
ui/               → Shared UI components (Shadcn,radix)
utils/            → Shared logic (AI prompts, resume parsing)
prisma/
schema.prisma     → NeonDB schema
docs/
README.md         → Project info

Tech Stack:
- Vite + React + Tailwind + Framer Motion
- Prisma + NeonDB (PostgreSQL)
- OpenAI (GPT-4) for resume + cover letters
- Backblaze B2 for storage
- Stripe for billing

---

## 🔐 7. Authentication & User Management

- Clerk or Supabase for email/password login
- Role-based access (free, pro, admin)
- Store resume + cover letters by user

---

## 📅 8. Timeline & Milestones

| Phase      | Milestone                                | Timeline     |
|------------|-------------------------------------------|--------------|
| Phase 1    | Project Setup, UI Scaffolding             | Week 1       |
| Phase 2    | Resume Analyzer + Upload                  | Week 2       |
| Phase 3    | Cover Letter Generator + Storage          | Week 3       |
| Phase 4    | Autofill on Job Boards                    | Week 4–5     |
| Phase 5    | Stripe Integration + Tiers                | Week 6       |
| Phase 6    | Launch on Product Hunt, Reddit, etc.      | Week 7       |
| Phase 7    | Post-launch Iterations + Growth Features  | Week 8–10    |

---

## 📊 9. Metrics to Track

- DAUs / WAUs (Chrome extension usage)
- # of resumes uploaded
- Cover letters generated
- Autofills triggered
- Conversion from free → pro
- Churn and retention
- Resume score improvement vs callback rate

---

## 🛡 10. Risks & Mitigations

| Risk                         | Mitigation                                   |
|-----------------------------|----------------------------------------------|
| Chrome extension rejected   | Follow Manifest V3 strictly, test thoroughly |
| Users drop off post-trial   | Add gamified nudges, emails, resume insights |
| AI returns bad results      | Prompt-tuning and user feedback loop         |
| Low monetization            | Add team/student plans, bootcamp partnerships|

---

## 📌 11. Next Steps

- ✅ Generate folder structure with script
- ✅ Initialize Vite + Tailwind with pnpm
- 🛠 Scaffold first extension pages
- 💡 Add OpenAI + Stripe API keys to `.env`
- 🚀 Start testing on job sites (LinkedIn, Indeed)


