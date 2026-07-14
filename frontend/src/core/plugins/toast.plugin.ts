/**
 * core/plugins/toast.plugin.ts
 *
 * Lightweight toast notification system with no external dependency.
 * Registered as a Vue plugin so any component can call `useToast()`
 * (re-exported here for convenience; the actual host component that
 * renders the toasts visually will live under `shared/components` once
 * that scope is generated).
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success('Task created');
 *   toast.error('Could not save changes');
 */

import { reactive, readonly, type App, type Plugin } from 'vue';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  text: string;
  durationMs: number;
}

interface ToastState {
  messages: ToastMessage[];
}

const state = reactive<ToastState>({ messages: [] });

const DEFAULT_DURATION_MS = 4000;

function push(variant: ToastVariant, text: string, durationMs = DEFAULT_DURATION_MS): string {
  const id = crypto.randomUUID();
  state.messages.push({ id, variant, text, durationMs });

  if (durationMs > 0) {
    setTimeout(() => dismiss(id), durationMs);
  }

  return id;
}

function dismiss(id: string): void {
  const index = state.messages.findIndex((message) => message.id === id);
  if (index !== -1) {
    state.messages.splice(index, 1);
  }
}

function clear(): void {
  state.messages.splice(0, state.messages.length);
}

export function useToast() {
  return {
    messages: readonly(state.messages),
    success: (text: string, durationMs?: number) => push('success', text, durationMs),
    error: (text: string, durationMs?: number) => push('error', text, durationMs),
    info: (text: string, durationMs?: number) => push('info', text, durationMs),
    warning: (text: string, durationMs?: number) => push('warning', text, durationMs),
    dismiss,
    clear,
  };
}

export const toastPlugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$toast = useToast();
    app.provide('toast', useToast());
  },
};
