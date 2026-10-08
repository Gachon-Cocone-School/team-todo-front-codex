import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Todo } from '@/lib/todos/types';

const { getTodoMock, updateTodoMock, deleteTodoMock, pushMock, confirmMock } = vi.hoisted(() => ({
  getTodoMock: vi.fn(),
  updateTodoMock: vi.fn(),
  deleteTodoMock: vi.fn(),
  pushMock: vi.fn(),
  confirmMock: vi.fn(),
}));
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '13' }),
  useRouter: () => ({ push: pushMock }),
}));
vi.mock('@/lib/todos/api', () => ({
  ApiError: class ApiError extends Error {},
  getTodo: getTodoMock,
  updateTodo: updateTodoMock,
  deleteTodo: deleteTodoMock,
}));

import TodoDetailPage from './page';

const task: Todo = {
  id: 13,
  title: '자료 검토',
  description: '기획 자료 확인',
  assignee: '민지',
  due_date: '2026-10-10',
  priority: 'HIGH',
  status: 'TODO',
  tags: ['기획'],
  created_at: '2026-10-08T00:00:00Z',
  updated_at: '2026-10-08T00:00:00Z',
};

describe('TODO detail page', () => {
  beforeEach(() => {
    getTodoMock.mockReset().mockResolvedValue(task);
    updateTodoMock.mockReset().mockResolvedValue({ ...task, title: '수정된 자료 검토' });
    deleteTodoMock.mockReset().mockResolvedValue(undefined);
    pushMock.mockReset();
    confirmMock.mockReset().mockReturnValue(true);
    vi.stubGlobal('confirm', confirmMock);
  });

  it('loads task data, saves edits as a partial update, and reflects the response', async () => {
    render(<TodoDetailPage />);
    expect(await screen.findByRole('heading', { name: '자료 검토' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '수정' }));
    fireEvent.change(screen.getByLabelText(/제목/), { target: { value: '수정된 자료 검토' } });
    fireEvent.click(screen.getByRole('button', { name: '변경 사항 저장' }));
    await waitFor(() => {
      expect(updateTodoMock).toHaveBeenCalledWith(13, { title: '수정된 자료 검토' });
    });
    expect(await screen.findByRole('heading', { name: '수정된 자료 검토' })).toBeInTheDocument();
  });

  it('confirms deletion and returns to the list', async () => {
    render(<TodoDetailPage />);
    await screen.findByRole('heading', { name: '자료 검토' });
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    await waitFor(() => {
      expect(deleteTodoMock).toHaveBeenCalledWith(13);
    });
    expect(confirmMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
