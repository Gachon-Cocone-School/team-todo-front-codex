import type { TodoPriority, TodoStatus } from './types';

export const statusLabel: Record<TodoStatus, string> = {
  TODO: '할 일',
  IN_PROGRESS: '진행 중',
  DONE: '완료',
};
export const priorityLabel: Record<TodoPriority, string> = {
  LOW: '낮음',
  MEDIUM: '보통',
  HIGH: '높음',
};

export function formatDate(value: string | null): string {
  if (value === null || value.length === 0) return '날짜 미정';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(date);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
