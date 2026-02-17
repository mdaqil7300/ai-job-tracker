import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job, JobStatus } from '../../../core/models/job.model';
import { JobStorageService } from '../../../core/services/job-storage.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.scss'
})
export class JobsListComponent {
  jobs = signal<Job[]>([]);
  searchText = signal('');
  selectedStatus = signal<JobStatus | 'All'>('All');

  constructor(private jobStorage: JobStorageService) {
    this.loadJobs();
  }

  loadJobs() {
    this.jobs.set(this.jobStorage.getJobs());
  }

  filteredJobs = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    const status = this.selectedStatus();

    return this.jobs().filter(job => {
      const matchesSearch =
        job.companyName.toLowerCase().includes(search) ||
        job.role.toLowerCase().includes(search);

      const matchesStatus = status === 'All' ? true : job.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  onDelete(id: string) {
    const ok = confirm('Delete this job?');
    if (!ok) return;

    this.jobStorage.deleteJob(id);
    this.loadJobs();
  }

  getBadgeClass(status: JobStatus) {
    return {
      Applied: 'badge applied',
      Interview: 'badge interview',
      Offer: 'badge offer',
      Rejected: 'badge rejected'
    }[status];
  }
}
