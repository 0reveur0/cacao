/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
const AUTH_TOKEN_STORAGE_KEY = 'cacao-auth-token';

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

function buildUrl(resource: string): string {
  if (resource.startsWith('http://') || resource.startsWith('https://')) {
    return resource;
  }
  return `${API_BASE_URL}${resource.startsWith('/') ? '' : '/'}${resource}`;
}

function getDefaultHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers ?? {});
  const token = getStoredToken();

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function apiFetch<T = unknown>(resource: string, init: RequestInit = {}): Promise<T> {
  const url = buildUrl(resource);
  const headers = getDefaultHeaders(init);

  const response = await fetch(url, {
    credentials: 'same-origin',
    ...init,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  const data = await parseResponse<T>(response);
  if (!response.ok) {
    const message = (data as any)?.message || response.statusText || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export async function apiGet<T = unknown>(resource: string): Promise<T> {
  return apiFetch<T>(resource, { method: 'GET' });
}

export async function apiPost<T = unknown>(resource: string, body?: unknown): Promise<T> {
  const init: RequestInit = { method: 'POST' };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }
  return apiFetch<T>(resource, init);
}

export async function apiPut<T = unknown>(resource: string, body?: unknown): Promise<T> {
  const init: RequestInit = { method: 'PUT' };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }
  return apiFetch<T>(resource, init);
}

export async function apiDelete<T = unknown>(resource: string): Promise<T> {
  return apiFetch<T>(resource, { method: 'DELETE' });
}
