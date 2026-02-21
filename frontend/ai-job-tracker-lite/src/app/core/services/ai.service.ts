import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {
    private baseUrl = environment.apiBaseUrl;

    async generateFollowUpEmail(input: {
        companyName: string;
        role: string;
        lastInterviewDate: string;
    }): Promise<string> {
        const res = await fetch(`${this.baseUrl}/generate-followup-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });

        if (!res.ok) throw new Error('Failed to generate follow-up email');

        const data = await res.json();
        return data.email;
    }

    async generateInterviewQuestions(input: {
        role: string;
        techStack: string;
    }): Promise<string[]> {
        const res = await fetch(`${this.baseUrl}/generate-interview-questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });

        if (!res.ok) throw new Error('Failed to generate interview questions');

        const data = await res.json();
        return data.questions || [];
    }

    async extractJobFromEmail(emailText: string): Promise<{
        companyName: string;
        role: string;
        notes: string;
        status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    }> {

        const res = await fetch(`${this.baseUrl}/extract-job`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailText })
        });


        if (!res.ok) throw new Error('AI extraction failed');
        return await res.json();
    }
}
