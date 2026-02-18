import express from "express";
import { Job } from "../models/job.model.js";

const router = express.Router();

/**
 * GET /jobs
 * List all jobs (latest first)
 */
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

/**
 * POST /jobs
 * Create job
 */
router.post("/", async (req, res) => {
    try {
        const { companyName, role, status, notes } = req.body;

        if (!companyName || !role) {
            return res.status(400).json({ error: "companyName and role are required" });
        }

        const job = await Job.create({
            companyName,
            role,
            status: status || "Applied",
            notes: notes || "",
        });

        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ error: "Failed to create job" });
    }
});

/**
 * PUT /jobs/:id
 * Update job
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Job.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update job" });
    }
});

/**
 * DELETE /jobs/:id
 * Delete job
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Job.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete job" });
    }
});

export default router;
