# SkilLintel 🚀

> AI-powered job market intelligence platform — know what the market wants before it tells you.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-skillintel.vercel.app-10b981?style=for-the-badge)](https://skillintel.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-6366f1?style=for-the-badge)](https://skillintel-api.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Athxrva20-333?style=for-the-badge&logo=github)](https://github.com/Athxrva20/Skillintel)

---

## 🌐 Live Links

| | URL |
|--|--|
| **Frontend** | https://skillintel.vercel.app |
| **Backend API** | https://skillintel-api.onrender.com |
| **Health Check** | https://skillintel-api.onrender.com/api/health |

---

## ✨ Features

- 🔍 **Job Search** — Search across Adzuna, LinkedIn, Indeed and Jooble in one place
- 📊 **Skills Analytics** — Real-time skill demand tracked across thousands of job postings
- 🤖 **Resume AI** — Upload your resume for AI-powered analysis, scoring and improvement tips
- 📈 **Skill Forecast** — Predict where skill demand is headed over the next 6 months
- 🗺️ **Role Explorer** — Deep dive into tech roles — salary ranges, skills, growth outlook
- 🌙 **Dark/Light Theme** — Beautiful UI with theme toggle

---

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- React Router DOM
- Recharts (data visualization)
- Lucide React (icons)
- React Hot Toast

### Backend
- Python + Flask
- Supabase (PostgreSQL database)
- Groq AI (LLaMA 3.3 — resume analysis)
- Flask JWT Extended (authentication)
- Flask Bcrypt (password hashing)

### APIs
- Adzuna Jobs API
- RapidAPI JSearch (LinkedIn/Indeed)
- Jooble Jobs API
- Groq AI API

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → Supabase

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- Python 3.14+
- Git

### Backend Setup
```bash
cd backend
python -m venv skillintel-env
skillintel-env\Scripts\activate  # Windows
pip install -r requirements.txt
# Create .env with your API keys (see .env.example)
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:5000
npm run dev
```

---

## 📁 Project Structure
SkilLintel/
├── backend/
│   ├── routes/
│   │   ├── auth.py        # Authentication
│   │   ├── jobs.py        # Job search
│   │   ├── skills.py      # Skills analytics
│   │   ├── resume.py      # Resume AI
│   │   ├── forecast.py    # Skill forecasting
│   │   └── roles.py       # Role explorer
│   ├── app.py             # Flask app
│   ├── config.py          # Configuration
│   ├── database.py        # Supabase client
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/         # All 9 pages
│   │   ├── components/    # Navbar, Ticker
│   │   ├── context/       # Auth, Theme
│   │   └── utils/         # API helpers
│   └── package.json
└── README.md

---

## 👨‍💻 Built By

**Atharva Phadatare**
- GitHub: [@Athxrva20](https://github.com/Athxrva20)

---

## 📄 License

MIT License — feel free to use this project for learning and personal use.