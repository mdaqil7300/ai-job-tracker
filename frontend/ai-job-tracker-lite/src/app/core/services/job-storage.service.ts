import { Injectable } from '@angular/core';
import { Job } from '../models/job.model';

const STORAGE_KEY = 'ai_job_tracker_jobs';

@Injectable({ providedIn: 'root' })
export class JobStorageService {
    getJobs(): Job[] {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    saveJobs(jobs: Job[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    }

    getJobById(id: string): Job | undefined {
        return this.getJobs().find(j => j._id === id);
    }

    addJob(job: Job): void {
        const jobs = this.getJobs();
        jobs.unshift(job);
        this.saveJobs(jobs);
    }

    updateJob(updatedJob: Job): void {
        const jobs = this.getJobs().map(job =>
            job._id === updatedJob._id ? updatedJob : job
        );
        this.saveJobs(jobs);
    }

    deleteJob(id: string): void {
        const jobs = this.getJobs().filter(j => j._id !== id);
        this.saveJobs(jobs);
    }
}
