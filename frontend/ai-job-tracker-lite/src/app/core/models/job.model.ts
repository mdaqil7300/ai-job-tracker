export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface Job {
    _id: string; // MongoDB id
    companyName: string;
    role: string;
    status: JobStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
