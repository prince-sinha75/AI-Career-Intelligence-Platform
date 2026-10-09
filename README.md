# AI Career Intelligence Platform

> An AI-powered career readiness platform for tech graduates — built with React, TypeScript, Tailwind CSS, and Framer Motion.

![Platform Preview](https://raw.githubusercontent.com/prince-sinha75/AI-Career-Intelligence-Platform/main/preview.png)

---

## 🚀 Live Demo

🔗 **[View Live →](https://prince-sinha75.github.io/AI-Career-Intelligence-Platform/)**

---

## 📌 About

The **AI Career Intelligence Platform** helps ambitious tech graduates understand exactly where they stand and what to do next. It provides a complete career readiness assessment — from resume analysis and skill gap detection to job matching, learning roadmaps, and mock interview simulation.

The platform features a fully interactive onboarding wizard, a multi-page dashboard, and a polished landing page — all running 100% client-side with no backend required.

---

## ✨ Features

| Module | Description |
|---|---|
| **Career Readiness Engine** | Weighted scoring across technical, resume, and interview dimensions with benchmark calibration |
| **ATS Resume Analyzer** | Semantic keyword extraction, formatting checks, and alignment with target role descriptions |
| **Skill Gap Engine** | Compares your profile against target role requirements with priority-weighted gap detection |
| **AI Job Matching** | TF-IDF and vector similarity ranking against live job postings with compatibility scores |
| **Dynamic Learning Roadmap** | Sprint-based learning paths with curated resources and time estimates |
| **AI Mock Interview Simulator** | Real-time question generation with feedback on clarity, depth, and confidence |
| **Career Analytics & Progress** | Historical tracking of readiness scores and skill progression with trend visualisation |

---

## 🧱 Tech Stack

- **React 19** — component-based UI
- **TypeScript** — type-safe codebase throughout
- **Tailwind CSS v4** — utility-first styling
- **Framer Motion** — animations and scroll-triggered reveals
- **Vite** — fast dev server and optimised production builds
- **Lucide React** — icon set

---

## 📂 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── pages/          # All dashboard page components
│   │   ├── DashboardShell  # Sidebar + layout wrapper
│   │   ├── charts          # Recharts-based chart components
│   │   ├── Modal           # Reusable modal
│   │   └── Toast           # Toast notification system
│   ├── onboarding/         # Multi-step onboarding wizard
│   ├── Hero                # Landing page hero section
│   ├── Capabilities        # Feature cards with tilt effect
│   ├── HowItWorks          # Process walkthrough section
│   ├── DashboardPreview    # Animated dashboard preview section
│   ├── Navbar              # Top navigation bar
│   └── CtaFooter           # Call-to-action footer
├── data/
│   └── resumeMockData      # Sample resume data for the analyzer
├── types/
│   ├── dashboard           # Dashboard data types + generator
│   ├── onboarding          # Onboarding form types
│   └── resume              # Resume analysis types
├── App.tsx                 # Root — hash-based routing (landing / onboarding / dashboard)
└── main.tsx                # Entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/prince-sinha75/AI-Career-Intelligence-Platform.git

# Navigate into the project
cd AI-Career-Intelligence-Platform

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output is placed in the `dist/` folder.

---

## 🗺️ Routing

The app uses hash-based routing — no server configuration required:

| Hash | View |
|---|---|
| `#` (empty) | Landing page |
| `#/onboarding` | Onboarding wizard |
| `#/dashboard` | Dashboard overview |
| `#/dashboard/analysis` | Career analysis page |
| `#/dashboard/resume` | Resume analyzer |
| `#/dashboard/matches` | Job matches |
| `#/dashboard/skills` | Skills breakdown |
| `#/dashboard/jobs` | Job listings |
| `#/dashboard/roadmap` | Learning roadmap |
| `#/dashboard/interview` | Mock interview |
| `#/dashboard/analytics` | Analytics & progress |

---

## 📸 Screenshots

> Landing page → Onboarding wizard → Full dashboard

_Coming soon_

---

## 🙌 Author

**Prince Sinha**
- GitHub: [@prince-sinha75](https://github.com/prince-sinha75)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
