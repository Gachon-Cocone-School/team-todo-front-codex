import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, createTodo, deleteTodo, getTodo, getTodos, updateTodo } from './api';
import type { Todo, TodoFields } from './types';

const sample: Todo = {
  id: 8,
  title: '테스트',
  description: null,
  assignee: null,
  due_date: null,
  priority: 'MEDIUM',
  status: 'TODO',
  tags: [],
  created_at: '2026-10-08T00:00:00Z',
  updated_at: '2026-10-08T00:00:00Z',
};
const fields: TodoFields = {
  title: sample.title,
  description: null,
  assignee: null,
  due_date: null,
  priority: 'MEDIUM',
  status: 'TODO',
  tags: [],
};

describe('TODO API client', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('serializes filters and pagination as query parameters', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({ items: [sample], limit: 20, offset: 0 }));
    await getTodos({ status: 'TODO', tag: '회의 메모', limit: 20, offset: 0 });
    expect(fetchMock.mock.calls[0]?.[0] as string).toContain('status=TODO');
    expect(fetchMock.mock.calls[0]?.[0] as string).toContain(
      'tag=%ED%9A%8C%EC%9D%98+%EB%A9%94%EB%AA%A8',
    );
  });

  it('calls create, read, patch and delete routes with expected methods', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json(sample, { status: 201 }))
      .mockResolvedValueOnce(Response.json(sample))
      .mockResolvedValueOnce(Response.json({ ...sample, title: '수정' }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    await createTodo(fields);
    await getTodo(8);
    await updateTodo(8, { title: '수정' });
    await deleteTodo(8);
    expect(fetchMock.mock.calls.map((call) => call[1]?.method ?? 'GET')).toEqual([
      'POST',
      'GET',
      'PATCH',
      'DELETE',
    ]);
    expect(fetchMock.mock.calls[0]?.[0] as string).toBe('/api/backend/todos');
    expect(fetchMock.mock.calls[3]?.[0] as string).toBe('/api/backend/todos/8');
  });

  it('converts backend errors and network failures to readable ApiError values', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json({ detail: '제목을 확인해 주세요.' }, { status: 422 }),
    );
    await expect(getTodo(8)).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      message: '제목을 확인해 주세요.',
    });
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('offline'));
    await expect(getTodo(8)).rejects.toBeInstanceOf(ApiError);
  });
});
