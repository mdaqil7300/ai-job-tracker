import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class JobsApiService {
    private baseUrl = environment.apiBaseUrl;

    async getJobs(): Promise<Job[]> {
        const res = await fetch(`${this.baseUrl}/jobs`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return await res.json();
    }

    async getJobById(id: string): Promise<Job> {
        const jobs = await this.getJobs();
        const job = jobs.find(j => j._id === id);
        if (!job) throw new Error('Job not found');
        return job;
    }

    async createJob(payload: {
        companyName: string;
        role: string;
        status: string;
        notes?: string;
    }): Promise<Job> {
        const res = await fetch(`${this.baseUrl}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to create job');
        return await res.json();
    }

    async updateJob(id: string, payload: Partial<Job>): Promise<Job> {
        const res = await fetch(`${this.baseUrl}/jobs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to update job');
        return await res.json();
    }

    async deleteJob(id: string): Promise<void> {
        const res = await fetch(`${this.baseUrl}/jobs/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Failed to delete job');
    }
}
