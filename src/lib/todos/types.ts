export const TODO_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export const TODO_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;

export type TodoStatus = (typeof TODO_STATUSES)[number];
export type TodoPriority = (typeof TODO_PRIORITIES)[number];

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: TodoPriority;
  status: TodoStatus;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TodoPage {
  items: Todo[];
  limit: number;
  offset: number;
}

export interface TodoFields {
  title: string;
  description: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: TodoPriority;
  status: TodoStatus;
  tags: string[];
}

export interface TodoFilters {
  status?: TodoStatus;
  assignee?: string;
  priority?: TodoPriority;
  due_date_from?: string;
  due_date_to?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}
