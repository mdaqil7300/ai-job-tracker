import { Routes } from '@angular/router';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { JobFormComponent } from './job-form/job-form.component';

export const JOBS_ROUTES: Routes = [
    { path: '', component: JobsListComponent },
    { path: 'add', component: JobFormComponent },
    { path: 'edit/:id', component: JobFormComponent }
];
