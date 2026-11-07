# GyanSetu v2.5 (Precision Lecture, AI Tutor & Deep Academic Engine)

> **Designed & Built by Sudhanshu Khetan**  
> *© 2026 Sudhanshu Khetan. All rights reserved.*

---

## 🏛️ Overview

**GyanSetu** is an advanced, distraction-free academic search engine and intelligent learning portal. It bridges students directly to exact university classroom lectures, structured course syllabi, peer-reviewed literature, interactive AI academic tutoring, and active recall study systems — without clickbait, recommendations, or algorithmic rabbit holes.

---

## ✨ Features & Capabilities

### 1. 🤖 Working In-App AI Academic Tutor ("GyanSetu AI Assistant")
- **Live Slide-Over AI Drawer:** Interactive, distraction-free academic chat assistant accessible via floating badge or header.
- **Serverless AI Proxy Architecture:** Safe, server-side streaming via Vercel Functions (`api/chat.js`) protecting API keys, model identities, rate limits (20 req/min/IP), and system prompts.
- **Dual Intelligence Modes:**
  - `⚡ GyanSetu AI · Turbo`: Sub-0.5s streaming for fast summaries, quick definitions, and study roadmaps.
  - `🧠 GyanSetu AI · Deep`: Rigorous derivations, exam numerical proofs, and automated parallel fact retrieval across Wikipedia and OpenAlex.
- **Context-Aware Syllabus Assistance:** Automatically injects currently searched topic, active sub-topic, and current notes as context.
- **One-Click Academic Action Chips:**
  - *"Explain this topic like I'm 15 with intuitive analogies"*
  - *"Give me 5 exam-level numerical problems with step-by-step solutions"*
  - *"Summarize essential formulas & derivations"*
  - *"Create a 3-day structured revision plan"*
- **Strict 18+ Academic Guard:** Every prompt is validated against the 3-layer `BLOCK` filter before dispatch.

### 2. ⏱️ Fully Customizable Study Timer (Pomodoro + Custom + Stopwatch)
- **Settings Modal (`⚙`):** Complete customization over study sessions:
  - Custom Focus Minutes (1 to 180 min, default 25)
  - Custom Short Break (1 to 60 min, default 5)
  - Custom Long Break (1 to 60 min, default 15)
  - Quick Presets: `25/5 Standard`, `50/10 Deep Work`, `90/20 Marathon`
  - Count-Up Stopwatch mode
- **Target Goal & Session Counter:** Allows setting a session target goal (e.g., *"Finish Lecture 2 of Thermodynamics"*), tracks completed sessions today, and chimes gently with Web Audio API synthesis.

### 3. 📝 Guaranteed AI-Generated Study Notes & On-Demand Deep Notes
- **Zero Empty Notes Guarantee:** If Wikipedia returns sparse or empty content for hyper-specific queries, the AI Note Generator automatically produces structured, textbook-grade notes.
- **"✨ Generate Deep AI Study Notes" Button:** On-demand synthesis at the top of the Study Notes tab producing:
  1. Executive Overview & Physical Intuition
  2. Formal Definitions & Terminology
  3. Governing Formulas, Theorems & Step-by-Step Proofs
  4. 2 Solved Example Problems with detailed numerical workings
  5. Common Exam Mistakes to Avoid
- **Productivity Integration:** Full compatibility with **Print / Save Cheat Sheet**, **🔊 Listen to Notes (TTS)**, and the **Personal Scratchpad**.

### 4. 🎯 Precision Lecture Targeter & Syllabus Engine
- **Dynamic Syllabus Sub-Topic Breakdown:** Automatically fetches exact syllabus modules from Wikipedia Sections and a rich STEM & Humanities syllabus repository (covering *Linear Algebra*, *Thermodynamics*, *Data Structures & Algorithms*, *Quantum Physics*, *Organic Chemistry*, *Microeconomics*, etc.).
- **Specific Lecture # Selector:** Allows immediate locking to `Lecture 1`, `Lecture 2`, `Lecture 3`, or custom lecture numbers across MIT OpenCourseWare, NPTEL / IITs, Stanford, Harvard, and premier professors.
- **Granular Academic Filters:** Target by Educator (MIT, NPTEL, Stanford, Physics Wallah, Khan Academy, freeCodeCamp, 3Blue1Brown, Abdul Bari), Study Intent (Full 45m+ Lecture, Derivations & Proofs, Solved Problems, One-Shot Exam Revision, Practical Code), and Language (English, Hindi / Hinglish).

### 5. 📺 In-App Distraction-Free Lecture Theatre
- **Split-Screen Learning Environment:** Watch university lectures on the left while taking timestamped notes on the right.
- **Timestamped Lecture Scratchpad:** Insert instantaneous timestamps `[HH:MM:SS]` to bookmark formulas, theorems, and proofs.
- **URL Embed Bar:** Paste any YouTube or Archive.org lecture link directly into the theatre to study in a 100% recommendation-free player.

### 6. ⚡ Active Recall Suite & Productivity
- **Interactive 3D Flip Flashcards:** Test spontaneous concept retrieval with dynamic formula and theorem cards.
- **5-Question Concept Mastery Quiz:** Multiple-choice active recall quizzes with real-time feedback and reasoning.
- **Saved Academic Library:** One-click bookmarking (`☆ Save`) for lectures, notes, papers, and courses, stored locally.
- **Theme Switcher:** Seamless Dark Mode and Light Mode support.

### 7. 🛡️ Trust, Safety & Academic Integrity
- **3-Layer 18+ Content Blocker:** Strict regex barrier blocking adult content, gambling, and non-educational search terms.
- **Academic Concern & Request Portal:** Student ticket generation (`GS-YYYYMMDD-XXXX`) and simulated Admin Queue with status tracking.

---

## 🚀 Getting Started & Deployment

### Local Static Use
Simply open `index.html` in any modern web browser (Chrome, Safari, Firefox, Edge).  
All core features, fallback encyclopedias, 3D flashcards, quizzes, timers, and offline academic synthesis work right out of the box with zero npm builds or server dependencies.

```bash
# Clone the repository
git clone https://github.com/sudhanshukhetan/gyansetu.git

# Navigate to directory
cd gyansetu

# Open in browser (macOS)
open index.html
```

### Full Serverless Deployment (Vercel)
To enable live AI streaming and real-time YouTube lecture caching with zero browser-side API key exposure:

1. Push your repository to GitHub / Vercel.
2. In your Vercel Project Dashboard → **Settings** → **Environment Variables**, configure:
   - `GEMINI_API_KEY`: Your Google AI Studio API key (powers `/api/chat`)
   - `YOUTUBE_API_KEY` *(Optional)*: YouTube Data API v3 key (powers cached lecture queries via `/api/yt`)
3. Redeploy. GyanSetu will automatically route AI interactions through the secure Edge proxy with prompt injection guards and rate limits.

---

## 👤 Author & Credits

- **Creator & Lead Architect:** [Sudhanshu Khetan](https://github.com/sudhanshukhetan)
- **Copyright:** © 2026 Sudhanshu Khetan. All rights reserved.
