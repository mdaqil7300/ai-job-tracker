import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'jobs', pathMatch: 'full' },

    {
        path: 'jobs',
        loadChildren: () =>
            import('./pages/jobs/jobs.routes').then(m => m.JOBS_ROUTES)
    },

    {
        path: 'ai',
        loadComponent: () =>
            import('./pages/ai-helper/ai-helper.component').then(m => m.AiHelperComponent)
    }
];
