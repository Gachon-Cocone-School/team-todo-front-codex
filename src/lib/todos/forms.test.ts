import { describe, expect, it } from 'vitest';
import {
  emptyTodoForm,
  makeTodoPatch,
  toTodoFields,
  validateDateRange,
  validateTodoForm,
} from './forms';
import type { Todo } from './types';

const todo: Todo = {
  id: 4,
  title: '정리하기',
  description: null,
  assignee: null,
  due_date: null,
  priority: 'MEDIUM',
  status: 'TODO',
  tags: [],
  created_at: '2026-10-08T00:00:00Z',
  updated_at: '2026-10-08T00:00:00Z',
};

describe('TODO form mapping and validation', () => {
  it('requires a title and enforces backend field limits', () => {
    expect(validateTodoForm(emptyTodoForm)).toContain('제목');
    expect(
      validateTodoForm({ ...emptyTodoForm, title: '유효한 제목', description: 'x'.repeat(5001) }),
    ).toContain('5000');
    expect(
      validateTodoForm({ ...emptyTodoForm, title: '유효한 제목', assignee: 'x'.repeat(101) }),
    ).toContain('100');
    expect(
      validateTodoForm({ ...emptyTodoForm, title: '유효한 제목', tags: 'x'.repeat(51) }),
    ).toContain('50');
  });

  it('normalizes optional fields and comma separated tags', () => {
    const fields = toTodoFields({
      ...emptyTodoForm,
      title: '  정리하기  ',
      description: '  내용  ',
      tags: '계획, 실행, 계획',
    });
    expect(fields).toMatchObject({
      title: '정리하기',
      description: '내용',
      assignee: null,
      due_date: null,
      tags: ['계획', '실행'],
    });
  });

  it('creates a minimal patch containing only changed values', () => {
    expect(
      makeTodoPatch(todo, {
        title: todo.title,
        description: null,
        assignee: null,
        due_date: null,
        priority: 'HIGH',
        status: 'TODO',
        tags: [],
      }),
    ).toEqual({ priority: 'HIGH' });
  });

  it('rejects an inverted date range', () => {
    expect(validateDateRange('2026-10-09', '2026-10-08')).not.toBeNull();
    expect(validateDateRange('2026-10-08', '2026-10-09')).toBeNull();
  });
});
