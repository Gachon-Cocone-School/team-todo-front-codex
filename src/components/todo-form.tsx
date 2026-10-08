'use client';

import { useState } from 'react';
import {
  emptyTodoForm,
  validateTodoForm,
  todoToForm,
  type TodoFormValues,
} from '@/lib/todos/forms';
import type { Todo } from '@/lib/todos/types';

interface Props {
  initialTodo?: Todo;
  submitLabel: string;
  onSubmit: (values: TodoFormValues) => Promise<void>;
  onCancel?: () => void;
}

export function TodoForm({ initialTodo, submitLabel, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<TodoFormValues>(
    initialTodo !== undefined ? todoToForm(initialTodo) : emptyTodoForm,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  function change<K extends keyof TodoFormValues>(key: K, value: TodoFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }
  async function submit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateTodoForm(values);
    if (validation !== null) {
      setError(validation);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  }
  return (
    <form
      className="todo-form"
      onSubmit={(event) => {
        void submit(event);
      }}
      noValidate
    >
      <label className="field field-wide">
        <span>
          제목 <b aria-hidden="true">*</b>
        </span>
        <input
          autoFocus
          value={values.title}
          maxLength={200}
          onChange={(event) => {
            change('title', event.target.value);
          }}
          placeholder="예: 주간 회의 자료 준비"
        />
      </label>
      <label className="field field-wide">
        <span>설명</span>
        <textarea
          value={values.description}
          maxLength={5000}
          rows={4}
          onChange={(event) => {
            change('description', event.target.value);
          }}
          placeholder="필요한 내용을 적어 주세요"
        />
      </label>
      <label className="field">
        <span>담당자</span>
        <input
          value={values.assignee}
          maxLength={100}
          onChange={(event) => {
            change('assignee', event.target.value);
          }}
          placeholder="이름"
        />
      </label>
      <label className="field">
        <span>마감일</span>
        <input
          type="date"
          value={values.due_date}
          onChange={(event) => {
            change('due_date', event.target.value);
          }}
        />
      </label>
      <label className="field">
        <span>상태</span>
        <select
          value={values.status}
          onChange={(event) => {
            change('status', event.target.value as TodoFormValues['status']);
          }}
        >
          <option value="TODO">할 일</option>
          <option value="IN_PROGRESS">진행 중</option>
          <option value="DONE">완료</option>
        </select>
      </label>
      <label className="field">
        <span>우선순위</span>
        <select
          value={values.priority}
          onChange={(event) => {
            change('priority', event.target.value as TodoFormValues['priority']);
          }}
        >
          <option value="LOW">낮음</option>
          <option value="MEDIUM">보통</option>
          <option value="HIGH">높음</option>
        </select>
      </label>
      <label className="field field-wide">
        <span>태그</span>
        <input
          value={values.tags}
          onChange={(event) => {
            change('tags', event.target.value);
          }}
          placeholder="쉼표로 구분 · 디자인, 회의"
        />
        <small>태그는 쉼표로 구분해 입력해 주세요.</small>
      </label>
      {error !== null && (
        <p className="form-error field-wide" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions field-wide">
        <button className="button button-primary" type="submit" disabled={saving}>
          {saving ? '저장 중…' : submitLabel}
        </button>
        {onCancel !== undefined && (
          <button
            className="button button-quiet"
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
