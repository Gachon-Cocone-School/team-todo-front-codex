import type { Todo, TodoFields, TodoFilters, TodoPage } from './types';

const API_PREFIX = '/api/backend';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getErrorMessage(payload: unknown, status: number): string {
  if (status === 404) return '요청한 할 일을 찾을 수 없습니다.';
  if (status >= 500) return '서버에 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.';

  if (typeof payload === 'object' && payload !== null && 'detail' in payload) {
    const detail: unknown = (payload as Record<string, unknown>).detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      const firstError: unknown = detail[0];
      if (typeof firstError === 'object' && firstError !== null && 'msg' in firstError) {
        const msg: unknown = (firstError as Record<string, unknown>).msg;
        return `입력 내용을 확인해 주세요: ${String(msg)}`;
      }
    }
  }
  return '요청을 처리하지 못했습니다. 입력 내용을 확인해 주세요.';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  const headers = new Headers(init?.headers);
  if (init?.body !== undefined && !headers.has('content-type'))
    headers.set('content-type', 'application/json');
  try {
    response = await fetch(`${API_PREFIX}${path}`, {
      ...init,
      cache: 'no-store',
      headers,
    });
  } catch {
    throw new ApiError('백엔드에 연결할 수 없습니다. 서버 실행 상태를 확인해 주세요.', 0);
  }

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    throw new ApiError(getErrorMessage(payload, response.status), response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function getTodos(filters: TodoFilters = {}): Promise<TodoPage> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') query.set(key, String(value));
  }
  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  return request<TodoPage>(`/todos${suffix}`);
}

export function getTodo(id: number): Promise<Todo> {
  return request<Todo>(`/todos/${String(id)}`);
}

export function createTodo(fields: TodoFields): Promise<Todo> {
  return request<Todo>('/todos', { method: 'POST', body: JSON.stringify(fields) });
}

export function updateTodo(id: number, fields: Partial<TodoFields>): Promise<Todo> {
  return request<Todo>(`/todos/${String(id)}`, { method: 'PATCH', body: JSON.stringify(fields) });
}

export function deleteTodo(id: number): Promise<undefined> {
  return request<undefined>(`/todos/${String(id)}`, { method: 'DELETE' });
}
