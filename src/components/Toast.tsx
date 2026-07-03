/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  messages: ToastMessage[];
  notify: (message: Omit<ToastMessage, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function createId() {
  return `toast-${Math.random().toString(36).slice(2, 11)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const notify = (message: Omit<ToastMessage, 'id'>) => {
    const toast: ToastMessage = { id: createId(), ...message };
    setMessages((current) => [...current, toast]);
    window.setTimeout(() => {
      setMessages((current) => current.filter((item) => item.id !== toast.id));
    }, 4500);
  };

  const dismiss = (id: string) => {
    setMessages((current) => current.filter((item) => item.id !== id));
  };

  const contextValue = useMemo(() => ({ messages, notify, dismiss }), [messages]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3 px-4 sm:px-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className="pointer-events-auto rounded-2xl border px-4 py-3 shadow-sm"
            style={{
              backgroundColor: message.variant === 'success' ? '#ECFDF5' : message.variant === 'error' ? '#FEF2F2' : '#EFF6FF',
              borderColor: message.variant === 'success' ? '#A7F3D0' : message.variant === 'error' ? '#FECACA' : '#BFDBFE',
              color: message.variant === 'error' ? '#B91C1C' : '#1E293B',
              fontFamily: 'var(--font-body)',
            }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {message.variant === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : message.variant === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{message.title}</p>
                {message.description && (
                  <p className="mt-1 text-sm leading-5 text-slate-600">{message.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(message.id)}
                className="text-slate-500 transition-colors hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
