# Career Compass

Career Compass is a **full-stack career development platform** that combines community-driven content sharing with an **AI-powered ATS Resume Analyzer**. The project demonstrates scalable backend architecture, secure authentication, REST API design, and the integration of modern NLP and Generative AI into a real-world web application.

The application follows a **service-oriented architecture**, where the primary application is built with **Node.js/Express**, while compute-intensive resume analysis is handled by an independent **FastAPI** service. Both services communicate through REST APIs, allowing them to evolve and scale independently.

---

# ✨ Highlights

- 🔐 JWT Authentication with Email OTP Verification
- 📝 Rich Text Blogging Platform
- 👏 Community Applaud System
- 📊 AI-Powered ATS Resume Analyzer
- 🧠 Semantic Resume–Job Description Matching
- 📄 Multi-page PDF Report Generation
- 📈 Historical ATS Analysis Tracking
- 🏗️ Service-Oriented Architecture (Node.js + FastAPI)
- 📱 Responsive React Frontend

---

# Overview

Career Compass enables users to publish career-related content, engage with the community through applauds, and analyze resumes against job descriptions using an AI-powered ATS engine.

Beyond traditional CRUD functionality, the project emphasizes clean backend architecture, secure identity management, modular service design, and practical integration of NLP and Generative AI technologies.

---

# 🏗️ System Architecture

```text
                React (Vite)
                     │
              REST API Requests
                     │
                     ▼
        Node.js / Express Backend
          │                  │
          │                  ▼
          │             MongoDB
          │
          │ HTTP Requests
          ▼
      FastAPI ATS Engine
          │
          ├── SpaCy NLP
          ├── TF-IDF Cosine Similarity (Scikit-Learn)
          ├── Fuzzy Match Scorer (RapidFuzz)
          ├── Groq (Llama 3)
          └── PDF Report Generator (xhtml2pdf / WeasyPrint)
```

---

# 🧠 AI-Powered ATS Analysis Pipeline

The ATS Resume Analyzer processes resumes through a multi-stage NLP and AI pipeline.

```text
[Resume PDF / DOCX]
          │
          ▼
   Text Extraction
          │
          ▼
     SpaCy NLP Parsing
          │
          ▼
 Entity & Keyword Extraction
          │
          ▼
  TF-IDF Vectorization
          │
          ▼
  Cosine Similarity Matching
          │
          ▼
  Fuzzy Keyword Skill Check
          │
          ▼
  Groq Llama-3 Analysis
          │
          ▼
  ATS Score + Suggestions + PDF Report
```

## 1. Resume Parsing & NLP

- **SpaCy** extracts structured information from resumes, including contact details, education, technical skills, certifications, programming languages, and experience.
- Rule-based processing and Named Entity Recognition (NER) organize unstructured resume text into meaningful sections.

## 2. Similarity and Skill Matching

- **TF-IDF Vectorization** processes resumes and job descriptions using `scikit-learn` to calculate a word-frequency representation.
- **Cosine Similarity** measures text similarity between vectors to evaluate job description alignment.
- **Fuzzy String Matching (`rapidfuzz`)** maps candidate skills against their project and experience blocks (case-insensitive & edit distance checks).

## 3. AI-Powered Resume Analysis

The ATS engine combines extracted resume information and semantic matching results before sending structured prompts to **Groq (Llama 3)**.

The model generates:

- ATS Formatting Score
- Content Quality Score
- Missing Keyword Analysis
- Skill Validation
- Personalized Resume Improvement Suggestions

---

# 🛠️ Technology Stack

## Frontend

- React (Vite)
- Tailwind CSS
- Context API
- Axios

## Primary Backend (Node.js / Express)

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST APIs
- Gmail API (Google OAuth 2.0 Email OTP)
- Cloudinary
- Gemini AI

## ATS Backend (Python / FastAPI)

- FastAPI
- SpaCy
- Scikit-Learn (TF-IDF Cosine Similarity)
- PyMuPDF
- xhtml2pdf / WeasyPrint
- Groq API

---

# 🚀 Key Features

## 🔐 Secure Authentication

- JWT Authentication
- Email OTP Verification
- Protected Routes
- Account Verification Workflow

## 📝 Community Blogging

- Rich Text Blog Editor
- Create, Edit and Delete Blogs
- Public User Profiles
- Responsive UI

## 👏 Applaud System

- One applaud per user per post
- Compound Unique Indexes
- Optimized interaction tracking

## 📊 AI ATS Resume Analyzer

- Resume Upload (PDF/DOCX)
- Resume Parsing
- Job Description Matching
- Semantic Similarity Scoring
- Keyword Analysis
- Skill Validation
- AI-Generated Feedback
- Multi-page PDF Report Generation
- Historical Analysis Tracking

---

# 📂 Project Structure

```text
Career-Compass/
│
├── Client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── configs/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
└── ATS Checker/
    └── backend/
        ├── api/
        ├── core/
        ├── models/
        ├── services/
        ├── templates/
        ├── utils/
        └── main.py
```

---

# 🔧 Installation & Setup

## Prerequisites

- Node.js
- Python 3.10+
- MongoDB

---

## Clone the Repository

```bash
git clone https://github.com/Harsh-15771/Career-Compass.git
cd Career-Compass
```

---

## Configure Environment Variables

Create separate `.env` files for:

- Client
- Server
- ATS Backend

### Server

```env
PORT=
MONGO_URI=
JWT_SECRET=
SENDER_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### ATS Backend

```env
GROQ_API_KEY=
```

---

## Backend Setup (Node.js)

```bash
cd server
npm install
npm run server
```

---

## Frontend Setup

```bash
cd Client
npm install
npm run dev
```

---

## ATS Backend Setup

```bash
cd "ATS Checker/backend"

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt

python -m spacy download en_core_web_sm

python main.py
```

---

# 🚀 Future Improvements

- Resume Version Comparison
- AI Resume Rewriting
- Company-Specific ATS Scoring
- Personalized Interview Preparation
- Skill Gap Analysis
- Learning Roadmap Recommendations

---

# 👨‍💻 Author

**Harsh Mishra**

Full-Stack Developer | Machine Learning Enthusiast

---

> This project demonstrates modern full-stack development by combining secure authentication, scalable REST APIs, community-driven features, and AI-powered resume analysis through a modular service-oriented architecture.