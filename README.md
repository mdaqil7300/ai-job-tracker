# 🚀 AI Job Tracker Lite

A full-stack Angular 18 application to track job applications, manage interview stages, and generate AI-powered assistance (email extraction, follow-ups, interview prep). Built with a modern Angular frontend, Node.js backend, MongoDB Atlas, and Groq AI integration.

---

## 🌟 Overview

AI Job Tracker Lite helps developers efficiently manage their job search pipeline with real database storage and integrated AI features.

This project demonstrates:

* Modern Angular architecture (standalone components + signals)
* REST API integration
* MongoDB cloud persistence
* AI-powered automation
* Production deployment (Netlify + Render)

---

## ✨ Features

### 📌 Job Management

* Add, edit, delete job applications
* Status tracking (Applied, Interview, Offer, Rejected)
* Search & filter by status
* Persistent cloud storage via MongoDB

### 🤖 AI Helper

* Extract job details from pasted application emails
* Auto-update job status from rejection/interview emails
* Generate professional follow-up emails
* Generate role-based interview questions

### 🎨 UI

* Responsive Bootstrap dashboard
* Segmented AI tabs
* Toast notifications
* Loading indicators
* Production-ready routing support (Netlify refresh fix)

---

## 🏗 Tech Stack

### Frontend

* Angular 18 (Standalone + Signals)
* TypeScript
* Bootstrap 5
* Fetch API

### Backend

* Node.js + Express
* MongoDB Atlas (Mongoose)
* Groq API (LLM integration)

### Deployment

* Frontend: Netlify
* Backend: Render
* Database: MongoDB Atlas

---

## ⚙️ Architecture

```
Angular Frontend  →  Express API  →  MongoDB Atlas
                         ↓
                      Groq AI
```

---

## 🚀 Local Development

### 1️⃣ Frontend

```bash
cd frontend/ai-job-tracker-lite
npm install
ng serve
```

Open:

```
http://localhost:4200
```

---

### 2️⃣ Backend

```bash
cd backend
npm install
node server.js
```

Create `.env` inside `backend/`:

```
PORT=5050
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

Test:

```
http://localhost:5050/health
```

---

## 🌍 Production Deployment

### Backend (Render)

* Root directory: `backend`
* Start command: `node server.js`
* Add environment variables in Render dashboard

### Frontend (Netlify)

* Base directory: `frontend/ai-job-tracker-lite`
* Build command:

  ```
  npm install && ng build --configuration production
  ```
* Publish directory:

  ```
  dist/ai-job-tracker-lite/browser
  ```
* Add `_redirects` file:

  ```
  /* /index.html 200
  ```

---

## 📂 Project Structure

```
ai-job-tracker-lite/
│
├── frontend/
│   └── ai-job-tracker-lite/
│       └── src/app/
│           ├── core/
│           ├── pages/
│           └── shared/
│
├── backend/
│   ├── routes/
│   ├── models/
│   └── server.js
```

---

## 🧠 What This Project Demonstrates

* Full-stack ownership (Frontend + Backend + DB)
* REST API integration in Angular
* Cloud database configuration
* Environment-based builds
* AI-powered feature implementation
* Production deployment setup

---

## 📜 License

This project is created for learning, portfolio, and demonstration purposes.

---