import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { connectDB } from "./db.js";
import jobsRoutes from "./routes/jobs.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.get("/health", (req, res) => {
    res.json({ ok: true, service: "ai-job-tracker-backend" });
});

app.use("/jobs", jobsRoutes);

app.post("/generate-followup-email", async (req, res) => {
    try {
        const { companyName, role, lastInterviewDate } = req.body;

        if (!companyName || !role || !lastInterviewDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const prompt = `Write a professional follow-up email.

Inputs:
- Company: ${companyName}
- Role: ${role}
- Last interview date: ${lastInterviewDate}

Rules:
- Keep it polite and concise
- Include subject line
- Return plain text only (no markdown).`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0.4,
            messages: [
                { role: "system", content: "You write professional emails." },
                { role: "user", content: prompt },
            ],
        });

        const email = completion.choices?.[0]?.message?.content ?? "";

        return res.json({ email });
    } catch (err) {
        console.error(err);
        // return res.status(500).json({ error: "Failed to generate email" });
        const msg = String(err?.message || err);

        // This is the adblock / privacy extension case
        if (msg.includes('Failed to fetch')) {
            throw new Error(
                'Request blocked. If you are using AdBlock/uBlock/Brave Shields, disable it for this site and try again.'
            );
        }

        throw new Error('AI service is not reachable. Please try again.');
    }
});

app.post("/generate-interview-questions", async (req, res) => {
    try {
        const { role, techStack } = req.body;

        if (!role || !techStack) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const prompt = `Generate 7 interview questions for the role: ${role}.

Tech stack: ${techStack}

Rules:
- Questions must be practical and real interview style
- Return ONLY JSON array of strings
Example:
["Q1", "Q2"]`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0.3,
            messages: [
                { role: "system", content: "You generate interview questions. Output JSON only." },
                { role: "user", content: prompt },
            ],
        });

        const raw = completion.choices?.[0]?.message?.content ?? "";

        let questions;
        try {
            questions = JSON.parse(raw);
        } catch {
            const jsonMatch = raw.match(/\[[\s\S]*\]/);
            questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
        }

        return res.json({ questions });
    } catch (err) {
        console.error(err);
        // return res.status(500).json({ error: "Failed to generate questions" });
        const msg = String(err?.message || err);

        // This is the adblock / privacy extension case
        if (msg.includes('Failed to fetch')) {
            throw new Error(
                'Request blocked. If you are using AdBlock/uBlock/Brave Shields, disable it for this site and try again.'
            );
        }

        throw new Error('AI service is not reachable. Please try again.');
    }
});


app.post("/extract-job", async (req, res) => {
    try {
        const { emailText } = req.body;

        if (!emailText || typeof emailText !== "string" || emailText.trim().length < 20) {
            return res.status(400).json({
                error: "emailText is required and must be at least 20 characters",
            });
        }

        const prompt = `Extract job application info from the email text.

Return ONLY valid JSON (no markdown, no explanation) with exactly these keys:
{
  "companyName": string,
  "role": string,
  "status": "Applied" | "Interview" | "Offer" | "Rejected",
  "notes": string
}

Rules:
- companyName must be the company (NOT 'Talent Acquisition', NOT 'Recruiting Department')
- role must be the job title if present, otherwise "Unknown"
- status should be:
  - Rejected if email contains rejection intent
  - Interview if email mentions scheduling/call/next round
  - Offer if email contains offer intent
  - otherwise Applied
- notes should be a short 1-2 line summary of the email.

EMAIL TEXT:
"""
${emailText}
"""`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0,
            messages: [
                { role: "system", content: "You extract structured data. Output JSON only." },
                { role: "user", content: prompt },
            ],
        });

        const raw = completion.choices?.[0]?.message?.content ?? "";

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch {
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return res.status(500).json({ error: "AI did not return JSON" });
            }
            parsed = JSON.parse(jsonMatch[0]);
        }

        const validStatuses = ["Applied", "Interview", "Offer", "Rejected"];

        const response = {
            companyName: (parsed.companyName || "Unknown Company").toString().trim(),
            role: (parsed.role || "Unknown").toString().trim(),
            status: validStatuses.includes(parsed.status) ? parsed.status : "Applied",
            notes: (parsed.notes || "").toString().trim(),
        };

        // cleanup
        response.companyName = response.companyName
            .replace(/Talent Acquisition/i, "")
            .replace(/Recruiting Department/i, "")
            .trim();

        if (!response.companyName) response.companyName = "Unknown Company";
        if (!response.role) response.role = "Unknown";

        return res.json(response);
    } catch (err) {
        console.error(err);
        const msg = String(err?.message || err);

        // This is the adblock / privacy extension case
        if (msg.includes('Failed to fetch')) {
            throw new Error(
                'Request blocked. If you are using AdBlock/uBlock/Brave Shields, disable it for this site and try again.'
            );
        }

        throw new Error('AI service is not reachable. Please try again.');
    }
});

const PORT = process.env.PORT || 5050;

await connectDB();

app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});
