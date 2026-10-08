import type { Todo, TodoFields, TodoPriority, TodoStatus } from './types';

export interface TodoFormValues {
  title: string;
  description: string;
  assignee: string;
  due_date: string;
  priority: TodoPriority;
  status: TodoStatus;
  tags: string;
}

export const emptyTodoForm: TodoFormValues = {
  title: '',
  description: '',
  assignee: '',
  due_date: '',
  priority: 'MEDIUM',
  status: 'TODO',
  tags: '',
};

export function todoToForm(todo: Todo): TodoFormValues {
  return {
    title: todo.title,
    description: todo.description ?? '',
    assignee: todo.assignee ?? '',
    due_date: todo.due_date ?? '',
    priority: todo.priority,
    status: todo.status,
    tags: todo.tags.join(', '),
  };
}

export function validateTodoForm(values: TodoFormValues): string | null {
  const title = values.title.trim();
  if (title.length === 0) return '제목을 입력해 주세요.';
  if (title.length > 200) return '제목은 200자 이내로 입력해 주세요.';
  if (values.description.length > 5000) return '설명은 5000자 이내로 입력해 주세요.';
  if (values.assignee.length > 100) return '담당자는 100자 이내로 입력해 주세요.';

  const tags = values.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  if (tags.some((tag) => tag.length > 50)) return '태그는 각각 50자 이내로 입력해 주세요.';

  return null;
}

export function toTodoFields(values: TodoFormValues): TodoFields {
  return {
    title: values.title.trim(),
    description: values.description.trim().length > 0 ? values.description.trim() : null,
    assignee: values.assignee.trim().length > 0 ? values.assignee.trim() : null,
    due_date: values.due_date.length > 0 ? values.due_date : null,
    priority: values.priority,
    status: values.status,
    tags: [
      ...new Set(
        values.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
          .map((tag) => tag.normalize('NFKC')),
      ),
    ],
  };
}

export function makeTodoPatch(current: Todo, next: TodoFields): Partial<TodoFields> {
  const patch: Partial<TodoFields> = {};
  if (current.title !== next.title) patch.title = next.title;
  if (current.description !== next.description) patch.description = next.description;
  if (current.assignee !== next.assignee) patch.assignee = next.assignee;
  if (current.due_date !== next.due_date) patch.due_date = next.due_date;
  if (current.priority !== next.priority) patch.priority = next.priority;
  if (current.status !== next.status) patch.status = next.status;
  if (current.tags.join('\u0000') !== next.tags.join('\u0000')) patch.tags = next.tags;
  return patch;
}

export function validateDateRange(from: string, to: string): string | null {
  if (from.length > 0 && to.length > 0 && from > to) {
    return '시작일은 종료일보다 늦을 수 없습니다.';
  }
  return null;
}
