export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Job {
    id: string;
    companyName: string;
    role: string;
    status: JobStatus;
    notes?: string;
    createdAt: string;
}
