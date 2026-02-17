# AI Job Tracker Lite

A lightweight Angular app for tracking job applications and generating short AI-assisted content (cover letters, role descriptions, notes). Designed for fast local use, minimal setup, and clear tracking of your job search pipeline.

## Summary

AI Job Tracker Lite helps you record, manage and review job applications with an integrated AI helper to craft or improve text related to applications. It focuses on simplicity, local persistence, and an unobtrusive UI so you can track progress quickly.

## Key features

- Add, edit, and remove job entries
- Jobs list and form-based UI for quick data entry
- AI helper for generating or polishing descriptions and cover letters
- AI helper also has feature to extract the details of the Pasted email content and save it in job list
- Local browser persistence (no external database required)
- Small Node backend included for optional server tasks

## Tech stack

- Frontend: Angular 17 + TypeScript
- Backend: Node.js (simple server)
- Storage: browser localStorage via `job-storage.service`

## Quick start

1. Frontend
   - cd frontend/ai-job-tracker-lite
   - npm install
   - ng serve
   - Open `http://localhost:4200`

2. Backend (optional)
   - cd backend
   - npm install
   - node server.js

## Project structure (high level)

- `src/app` — app components, pages, services, models
- `core/services` — AI helper, storage services
- `pages` — UI screens (jobs, AI helper)

## Contributing & license

Contributions are welcome — open a PR or issue. Check the repository license for terms.
