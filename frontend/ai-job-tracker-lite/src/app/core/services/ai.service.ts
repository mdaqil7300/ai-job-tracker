import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AiService {
    /**
     * Toggle this to true when you add real OpenAI API integration.
     * For now keep it false (Mock Mode).
     */
    private useRealApi = false;

    async generateFollowUpEmail(input: {
        companyName: string;
        role: string;
        lastInterviewDate: string;
    }): Promise<string> {
        if (!this.useRealApi) {
            return this.mockFollowUpEmail(input);
        }

        // Real API integration will be added later
        return 'Real API mode not enabled yet.';
    }

    async generateInterviewQuestions(input: {
        role: string;
        techStack: string;
    }): Promise<string[]> {
        if (!this.useRealApi) {
            return this.mockInterviewQuestions(input);
        }

        // Real API integration will be added later
        return ['Real API mode not enabled yet.'];
    }

    // async extractJobFromEmail(emailText: string): Promise<{
    //     companyName: string;
    //     role: string;
    //     notes: string;
    //     status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    // }> {
    //     if (!this.useRealApi) {
    //         return this.mockExtractJobFromEmail(emailText);
    //     }

    //     return {
    //         companyName: '',
    //         role: '',
    //         notes: '',
    //         status: 'Applied'
    //     };
    // }

    async extractJobFromEmail(emailText: string): Promise<{
        companyName: string;
        role: string;
        notes: string;
        status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    }> {
        const res = await fetch('http://localhost:5050/extract-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailText })
        });

        if (!res.ok) throw new Error('AI extraction failed');
        return await res.json();
    }

    private mockExtractJobFromEmail(emailText: string): {
        companyName: string;
        role: string;
        notes: string;
        status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    } {
        const cleanText = emailText.replace(/\r/g, '').trim();
        const singleLine = cleanText.replace(/\s+/g, ' ').trim();
        const lower = singleLine.toLowerCase();

        // ---------------- STATUS DETECTION ----------------
        let status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' = 'Applied';

        const rejectedKeywords = [
            'unfortunately',
            'we regret',
            'not selected',
            'not been selected',
            'not moving forward',
            'will not be moving forward',
            'we have decided not to proceed',
            'position has been filled'
        ];

        const interviewKeywords = [
            'interview',
            'schedule a call',
            'next round',
            'technical round',
            'hr round',
            'we would like to speak with you'
        ];

        const offerKeywords = [
            'we are pleased to offer',
            'offer letter',
            'congratulations',
            'we would like to offer you'
        ];

        if (rejectedKeywords.some(k => lower.includes(k))) status = 'Rejected';
        else if (offerKeywords.some(k => lower.includes(k))) status = 'Offer';
        else if (interviewKeywords.some(k => lower.includes(k))) status = 'Interview';

        // ---------------- ROLE EXTRACTION ----------------
        let role = 'Unknown Role';

        const rolePatterns: RegExp[] = [
            // "role of Senior Software Engineer..."
            /role of\s+(.+?)(\.|,| we | we are| we will| thank you)/i,

            // "application for the Full Stack Developer (Angular) role"
            /application for (the )?(.+?) role/i,

            // "received your application for the Full Stack Developer (Angular) role"
            /received your application for (the )?(.+?) role/i,

            // "applying for the Full Stack Developer (Angular) role"
            /applying for (the )?(.+?) role/i,

            // "position: Full Stack Developer"
            /position[:\-]\s*(.+?)(\.|,|$)/i,

            // "role: Full Stack Developer"
            /role[:\-]\s*(.+?)(\.|,|$)/i
        ];

        for (const pattern of rolePatterns) {
            const match = singleLine.match(pattern);
            if (match) {
                role = (match[2] || match[1] || '').trim();
                if (role) break;
            }
        }

        // cleanup role
        role = role.replace(/\s+/g, ' ').replace(/\s*-\s*/g, ' - ').trim();

        // ---------------- COMPANY EXTRACTION ----------------
        let companyName = 'Unknown Company';

        const companyPatterns: RegExp[] = [
            /applying to\s+(.+?)(!|\.|,|\n)/i,
            /applying to\s+([A-Za-z0-9&.\- ]{2,50})/i,
            /applying (at|with)\s+(.+?)(!|\.|,|\n)/i,
            /thank you for applying to\s+(.+?)(!|\.|,|\n)/i,
            /kind regards,\s*(.+?)\s*recruiting department/i,
            /(regards|thank you),\s*\n?\s*(.+)$/i
        ];

        for (const pattern of companyPatterns) {
            const match = cleanText.match(pattern) || singleLine.match(pattern);
            if (match) {
                companyName = (match[2] || match[1] || '').trim();
                if (companyName) break;
            }
        }

        // if (companyName === 'Unknown Company') {
        //     const atMatch = singleLine.match(/at\s+([A-Z][A-Za-z0-9&.\- ]{1,40})(,|\swe|\swe're|\swe are)/i);
        //     if (atMatch?.[1]) companyName = atMatch[1].trim();
        // }

        if (companyName === 'Unknown Company') {
            const sigMatch = cleanText.match(/\n\s*([A-Z][A-Za-z0-9&.\- ]{2,40})\s*(Team|Careers|Recruiting|Join|HR)\b/i);
            if (sigMatch?.[1]) companyName = sigMatch[1].trim();
        }

        // cleanup company
        companyName = companyName
            .replace(/[!.,"']/g, '')
            .replace(/talent acquisition/i, '')
            .replace(/recruiting department/i, '')
            .trim();

        // If company becomes empty after cleanup
        if (!companyName) companyName = 'Unknown Company';

        // ---------------- NOTES ----------------
        const notes = `Extracted from email:\n${emailText.slice(0, 250)}${emailText.length > 250 ? '...' : ''
            }`;

        return { companyName, role, notes, status };
    }

    // ---------------- MOCK DATA ----------------

    private mockFollowUpEmail(input: {
        companyName: string;
        role: string;
        lastInterviewDate: string;
    }): string {
        return `Subject: Follow-up on ${input.role} Interview

Hi ${input.companyName} Hiring Team,

Hope you're doing well. I wanted to follow up regarding my interview for the ${input.role} position on ${input.lastInterviewDate}.

I’m still very interested in the role and excited about the opportunity to contribute to the team. Please let me know if there are any updates on the next steps.

Thank you for your time and consideration.

Best regards,
[Your Name]`;
    }

    private mockInterviewQuestions(input: {
        role: string;
        techStack: string;
    }): string[] {
        return [
            `Explain Angular standalone components and why they are useful.`,
            `What is the difference between Subject, BehaviorSubject, and ReplaySubject in RxJS?`,
            `How would you optimize performance in an Angular app with large lists?`,
            `Explain ChangeDetectionStrategy.Default vs OnPush with an example.`,
            `How does Angular routing work? What is lazy loading?`,
            `What are interceptors in Angular and when would you use them?`,
            `How do you handle API errors globally in Angular?`
        ].map(q => `[${input.role}] ${q} (Tech: ${input.techStack})`);
    }

}
