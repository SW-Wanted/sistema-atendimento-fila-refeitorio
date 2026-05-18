import { Injectable, signal } from '@angular/core';

export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

export interface FeedbackState {
  type: FeedbackType;
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  readonly state = signal<FeedbackState | null>(null);

  show(type: FeedbackType, title: string, message: string) {
    this.state.set({ type, title, message });
  }

  success(title: string, message: string) {
    this.show('success', title, message);
  }

  error(title: string, message: string) {
    this.show('error', title, message);
  }

  info(title: string, message: string) {
    this.show('info', title, message);
  }

  warning(title: string, message: string) {
    this.show('warning', title, message);
  }

  close() {
    this.state.set(null);
  }
}