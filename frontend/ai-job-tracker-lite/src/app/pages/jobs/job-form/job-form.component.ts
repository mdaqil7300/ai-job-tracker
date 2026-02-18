import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Job, JobStatus } from '../../../core/models/job.model';
import { JobsApiService } from '../../../core/services/jobs-api.service';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.scss'
})
export class JobFormComponent {
  isEditMode = signal(false);
  jobId = signal<string | null>(null);

  statuses: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected'];

  form = this.fb.group({
    companyName: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', [Validators.required, Validators.minLength(2)]],
    status: ['Applied' as JobStatus, [Validators.required]],
    notes: ['']
  });

  pageTitle = computed(() =>
    this.isEditMode() ? 'Edit Job' : 'Add Job'
  );

  constructor(
    private fb: FormBuilder,
    private jobsApi: JobsApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initMode();
  }

  private async initMode() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.isEditMode.set(false);
      return;
    }

    try {
      const job = await this.jobsApi.getJobById(id);

      this.isEditMode.set(true);
      this.jobId.set(id);

      this.form.patchValue({
        companyName: job.companyName,
        role: job.role,
        status: job.status,
        notes: job.notes ?? ''
      });
    } catch {
      alert('Job not found');
      this.router.navigateByUrl('/jobs');
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    // Add mode
    if (!this.isEditMode()) {
      await this.jobsApi.createJob({
        companyName: value.companyName!,
        role: value.role!,
        status: value.status!,
        notes: value.notes ?? ''
      });

      this.router.navigateByUrl('/jobs');
      return;
    }

    // Edit mode
    await this.jobsApi.updateJob(this.jobId()!, {
      companyName: value.companyName!,
      role: value.role!,
      status: value.status!,
      notes: value.notes ?? ''
    });

    this.router.navigateByUrl('/jobs');
  }

  onCancel() {
    this.router.navigateByUrl('/jobs');
  }

  // small helpers for template
  get companyName() {
    return this.form.controls.companyName;
  }

  get role() {
    return this.form.controls.role;
  }
}
