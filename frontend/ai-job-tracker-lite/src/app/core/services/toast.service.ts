import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts = signal<ToastMessage[]>([]);

    show(message: string, type: ToastType = 'info') {
        const toast: ToastMessage = {
            id: crypto.randomUUID(),
            type,
            message
        };

        this.toasts.update(list => [...list, toast]);

        // auto remove after 3 sec
        setTimeout(() => this.remove(toast.id), 3000);
    }

    remove(id: string) {
        this.toasts.update(list => list.filter(t => t.id !== id));
    }
}
