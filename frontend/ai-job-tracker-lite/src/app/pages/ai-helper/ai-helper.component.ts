import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AiService } from '../../core/services/ai.service';
import { JobStorageService } from '../../core/services/job-storage.service';
import { Job } from '../../core/models/job.model';

@Component({
  selector: 'app-ai-helper',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ai-helper.component.html',
  styleUrl: './ai-helper.component.scss'
})
export class AiHelperComponent {
  loadingEmail = signal(false);
  loadingQuestions = signal(false);

  generatedEmail = signal('');
  generatedQuestions = signal<string[]>([]);

  emailForm = this.fb.group({
    companyName: ['', [Validators.required]],
    role: ['', [Validators.required]],
    lastInterviewDate: ['', [Validators.required]]
  });

  questionsForm = this.fb.group({
    role: ['', [Validators.required]],
    techStack: ['Angular, TypeScript, RxJS', [Validators.required]]
  });

  loadingExtract = signal(false);

  extractedJob = signal<{
    companyName: string;
    role: string;
    notes: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  } | null>(null);

  constructor(
    private fb: FormBuilder,
    private ai: AiService,
    private jobStorage: JobStorageService
  ) { }

  extractForm = this.fb.group({
    emailText: ['', [Validators.required, Validators.minLength(20)]]
  });

  async onGenerateEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.loadingEmail.set(true);
    this.generatedEmail.set('');

    try {
      const value = this.emailForm.getRawValue();
      const email = await this.ai.generateFollowUpEmail({
        companyName: value.companyName!,
        role: value.role!,
        lastInterviewDate: value.lastInterviewDate!
      });

      this.generatedEmail.set(email);
    } finally {
      this.loadingEmail.set(false);
    }
  }

  async onGenerateQuestions() {
    if (this.questionsForm.invalid) {
      this.questionsForm.markAllAsTouched();
      return;
    }

    this.loadingQuestions.set(true);
    this.generatedQuestions.set([]);

    try {
      const value = this.questionsForm.getRawValue();
      const questions = await this.ai.generateInterviewQuestions({
        role: value.role!,
        techStack: value.techStack!
      });

      this.generatedQuestions.set(questions);
    } finally {
      this.loadingQuestions.set(false);
    }
  }

  async onExtractJob() {
    if (this.extractForm.invalid) {
      this.extractForm.markAllAsTouched();
      return;
    }

    this.loadingExtract.set(true);
    this.extractedJob.set(null);

    try {
      const emailText = this.extractForm.getRawValue().emailText!;
      const extracted = await this.ai.extractJobFromEmail(emailText);
      this.extractedJob.set(extracted);
    } finally {
      this.loadingExtract.set(false);
    }
  }

  saveExtractedJob() {
    const data = this.extractedJob();
    if (!data) return;

    const jobs = this.jobStorage.getJobs();

    // Find existing job by company + role (case-insensitive)
    const existing = jobs.find(j =>
      j.companyName.toLowerCase().trim() === data.companyName.toLowerCase().trim() &&
      j.role.toLowerCase().trim() === data.role.toLowerCase().trim()
    );

    // If exists -> update status + notes
    if (existing) {
      const updated: Job = {
        ...existing,
        status: data.status,
        notes: `${existing.notes ?? ''}\n\n---\n\n${data.notes}`.trim()
      };

      this.jobStorage.updateJob(updated);
      alert(`Job updated! Status: ${data.status} ✅`);
    } else {
      // Else -> create new
      const job: Job = {
        id: crypto.randomUUID(),
        companyName: data.companyName,
        role: data.role,
        status: data.status,
        notes: data.notes,
        createdAt: new Date().toISOString()
      };

      this.jobStorage.addJob(job);
      alert(`Job saved! Status: ${data.status} ✅`);
    }

    // reset
    this.extractedJob.set(null);
    this.extractForm.reset();
  }


  copyEmail() {
    if (!this.generatedEmail()) return;
    navigator.clipboard.writeText(this.generatedEmail());
    alert('Email copied!');
  }

  copyQuestions() {
    if (this.generatedQuestions().length === 0) return;
    navigator.clipboard.writeText(this.generatedQuestions().join('\n\n'));
    alert('Questions copied!');
  }
}
