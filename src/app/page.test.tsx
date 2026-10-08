import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Todo, TodoPage } from '@/lib/todos/types';

const { getTodosMock, createTodoMock } = vi.hoisted(() => ({
  getTodosMock: vi.fn(),
  createTodoMock: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock('@/lib/todos/api', () => ({
  ApiError: class ApiError extends Error {},
  getTodos: getTodosMock,
  createTodo: createTodoMock,
}));

import TodoListPage from './page';

const task: Todo = {
  id: 13,
  title: '자료 검토',
  description: '기획 자료 확인',
  assignee: '민지',
  due_date: '2026-10-10',
  priority: 'HIGH',
  status: 'IN_PROGRESS',
  tags: ['기획'],
  created_at: '2026-10-08T00:00:00Z',
  updated_at: '2026-10-08T00:00:00Z',
};
const result: TodoPage = { items: [task], limit: 20, offset: 0 };

describe('TODO list page', () => {
  beforeEach(() => {
    getTodosMock.mockReset().mockResolvedValue(result);
    createTodoMock.mockReset().mockResolvedValue(task);
  });

  it('shows task summary and sends the selected filters to the backend', async () => {
    render(<TodoListPage />);
    expect(await screen.findByRole('link', { name: /자료 검토/ })).toHaveAttribute(
      'href',
      '/todos/13',
    );
    expect(screen.getByText('담당 · 민지')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('상태'), { target: { value: 'IN_PROGRESS' } });
    fireEvent.change(screen.getByLabelText('태그'), { target: { value: '기획' } });
    fireEvent.click(screen.getByRole('button', { name: '필터 적용' }));
    await waitFor(() => {
      expect(getTodosMock).toHaveBeenLastCalledWith({
        status: 'IN_PROGRESS',
        tag: '기획',
        limit: 20,
        offset: 0,
      });
    });
  });

  it('opens creation form and posts validated fields', async () => {
    render(<TodoListPage />);
    await screen.findByRole('link', { name: /자료 검토/ });
    fireEvent.click(screen.getByRole('button', { name: /새 할 일/ }));
    fireEvent.change(screen.getByLabelText(/제목/), { target: { value: '추가 작업' } });
    fireEvent.click(screen.getByRole('button', { name: '할 일 추가' }));
    await waitFor(() => {
      expect(createTodoMock).toHaveBeenCalledWith(expect.objectContaining({ title: '추가 작업' }));
    });
  });
});
