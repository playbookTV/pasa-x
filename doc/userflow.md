Here’s a clean and clear User Flow for Pasa — your Chrome extension that automates and enhances job applications.

⸻

🔁 Pasa User Flow

We’ll break it down by user journey phases and key actions across both the Chrome extension (widget + popover) and the optional web dashboard.

⸻

🧑‍💻 1. User Onboarding

✅ First-Time User Flow

Install Extension → Click Pasa Icon → Sign Up/Login (email/password) → Land in Popover → Upload Resume → Ready to Use

Popover Pages:
	•	Welcome + Login/Signup
	•	Upload Resume → Resume Score + Keyword Suggestions
	•	CTA to Try Autofill or Generate Cover Letter

⸻

🌐 2. Using Pasa on Job Boards

💡 Passive Detection + Overlay

User Visits LinkedIn / Indeed / Wellfound →
Pasa Widget Injected →
Detects Job Form →
Widget Appears ("Autofill", "Analyze Resume", "Generate Cover Letter")

🧩 In-Flow Actions:
	1.	Autofill
	•	Autofills job fields with saved user data
	•	Lets user review and tweak before submitting
	2.	Resume Analysis
	•	Scores resume against job title + description
	•	Displays a rating (e.g. 82%) with improvement tips
	3.	Cover Letter Generation
	•	Uses uploaded resume + detected job description
	•	Generates editable letter in modal
	•	Option to copy/download
	4.	Track Job
	•	Auto-tracks the application in user’s dashboard (status: Applied)

⸻

📊 3. Application Tracker Popover

Accessible via extension popup

Pasa Icon → Click → Popover Opens →
Tabs: [Resume] [Cover Letters] [Tracker]

Tabs:
	•	Resume
	•	Upload or replace resume
	•	View score + insights
	•	Cover Letters
	•	View history of generated letters
	•	Reuse, edit, copy
	•	Tracker
	•	See all tracked jobs
	•	Update status: [Applied, Interview, Offer, Rejected]

⸻

💳 4. Upgrade Flow

Triggered when limits are reached:

Generate >1 Cover Letter OR Use >5 Autofills →
Modal Appears: “Upgrade to Pro” →
Stripe Checkout Embedded →
Success = Unlock Pro Features



⸻

🧠 5. Retention & Growth Loops

🚀 Triggered Engagement
	•	Resume Score < 70% → Email Suggestion: “Here’s how to improve it”
	•	“You applied to 3 jobs today – keep going?”
	•	Cover Letter Draft Reminder

📣 Viral / Referral
	•	“Get 1 month of Pro when you invite a friend”
	•	“Share Pasa with your bootcamp / school and get free access”

⸻

📋 Summary Diagram

[User Installs Extension]
        ↓
[Logs in / Uploads Resume]
        ↓
[Browses Job Board] → [Widget Injected]
        ↓                 ↓
[Clicks Autofill]   [Clicks Generate Letter]
        ↓                 ↓
[Form is Filled]     [Letter is Generated]
        ↓                 ↓
[Job Tracked Automatically]
        ↓
[Views Tracker in Popover]
        ↓
[Upgrade Prompt if Limits Exceeded]

