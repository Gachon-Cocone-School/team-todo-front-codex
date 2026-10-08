'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ApiError, createTodo, getTodos } from '@/lib/todos/api';
import { toTodoFields, validateDateRange, type TodoFormValues } from '@/lib/todos/forms';
import { formatDate, priorityLabel, statusLabel } from '@/lib/todos/presentation';
import { TodoForm } from '@/components/todo-form';
import type { Todo, TodoFilters, TodoPage, TodoPriority, TodoStatus } from '@/lib/todos/types';

const PAGE_SIZE = 20;

export default function TodoListPage() {
  const [page, setPage] = useState<TodoPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    assignee: '',
    priority: '',
    due_date_from: '',
    due_date_to: '',
    tag: '',
  });
  const [applied, setApplied] = useState<TodoFilters>({});
  const [filterError, setFilterError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try {
      setPage(await getTodos({ ...applied, limit: PAGE_SIZE, offset }));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : '목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [applied, offset]);
  // This effect synchronizes the displayed list with the active query.
  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);
  function applyFilters(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const rangeError = validateDateRange(filters.due_date_from, filters.due_date_to);
    if (rangeError !== null) {
      setFilterError(rangeError);
      return;
    }
    setFilterError(null);
    const next: TodoFilters = {};
    if (filters.status !== '') next.status = filters.status as TodoStatus;
    if (filters.priority !== '') next.priority = filters.priority as TodoPriority;
    if (filters.assignee.trim() !== '') next.assignee = filters.assignee.trim();
    if (filters.due_date_from !== '') next.due_date_from = filters.due_date_from;
    if (filters.due_date_to !== '') next.due_date_to = filters.due_date_to;
    if (filters.tag.trim() !== '') next.tag = filters.tag.trim();
    setLoading(true);
    setError(null);
    setOffset(0);
    setApplied(next);
  }
  function clearFilters() {
    setFilters({
      status: '',
      assignee: '',
      priority: '',
      due_date_from: '',
      due_date_to: '',
      tag: '',
    });
    setFilterError(null);
    setLoading(true);
    setError(null);
    setOffset(0);
    setApplied({});
  }
  async function onCreate(values: TodoFormValues) {
    await createTodo(toTodoFields(values));
    setCreating(false);
    setLoading(true);
    setError(null);
    if (offset === 0) await refresh();
    else setOffset(0);
  }
  const todos: Todo[] = page?.items ?? [];
  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <p className="eyebrow">TEAM WORKSPACE</p>
          <h1>할 일 목록</h1>
          <p className="page-subtitle">해야 할 일을 정리하고, 하나씩 완료해 보세요.</p>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={() => {
            setCreating((value) => !value);
          }}
          aria-expanded={creating}
        >
          <span aria-hidden="true">＋</span> 새 할 일
        </button>
      </header>
      {creating && (
        <section className="panel create-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NEW TASK</p>
              <h2>새 할 일 만들기</h2>
            </div>
            <button
              className="icon-button"
              type="button"
              aria-label="생성 취소"
              onClick={() => {
                setCreating(false);
              }}
            >
              ×
            </button>
          </div>
          <TodoForm
            submitLabel="할 일 추가"
            onSubmit={onCreate}
            onCancel={() => {
              setCreating(false);
            }}
          />
        </section>
      )}
      <form className="panel filter-panel" onSubmit={applyFilters}>
        <div className="filter-title">
          <div>
            <p className="eyebrow">YOUR BOARD</p>
            <h2>작업 찾아보기</h2>
          </div>
          <span className="count-pill">
            {page === null ? '—' : `${String(page.items.length)}개 표시`}
          </span>
        </div>
        <div className="filters-grid">
          <label className="field">
            <span>상태</span>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
              }}
            >
              <option value="">전체 상태</option>
              <option value="TODO">할 일</option>
              <option value="IN_PROGRESS">진행 중</option>
              <option value="DONE">완료</option>
            </select>
          </label>
          <label className="field">
            <span>우선순위</span>
            <select
              value={filters.priority}
              onChange={(e) => {
                setFilters({ ...filters, priority: e.target.value });
              }}
            >
              <option value="">전체 우선순위</option>
              <option value="HIGH">높음</option>
              <option value="MEDIUM">보통</option>
              <option value="LOW">낮음</option>
            </select>
          </label>
          <label className="field">
            <span>담당자</span>
            <input
              value={filters.assignee}
              onChange={(e) => {
                setFilters({ ...filters, assignee: e.target.value });
              }}
              placeholder="담당자 이름"
            />
          </label>
          <label className="field">
            <span>태그</span>
            <input
              value={filters.tag}
              onChange={(e) => {
                setFilters({ ...filters, tag: e.target.value });
              }}
              placeholder="태그 검색"
            />
          </label>
          <label className="field">
            <span>마감일 시작</span>
            <input
              type="date"
              value={filters.due_date_from}
              onChange={(e) => {
                setFilters({ ...filters, due_date_from: e.target.value });
              }}
            />
          </label>
          <label className="field">
            <span>마감일 종료</span>
            <input
              type="date"
              value={filters.due_date_to}
              onChange={(e) => {
                setFilters({ ...filters, due_date_to: e.target.value });
              }}
            />
          </label>
        </div>
        {filterError !== null && (
          <p role="alert" className="form-error">
            {filterError}
          </p>
        )}
        <div className="filter-actions">
          <button className="button button-primary button-small" type="submit">
            필터 적용
          </button>
          <button className="button button-quiet button-small" type="button" onClick={clearFilters}>
            초기화
          </button>
        </div>
      </form>
      {error !== null && (
        <div className="notice notice-error" role="alert">
          <span>{error}</span>
          <button
            className="button button-small"
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              void refresh();
            }}
          >
            다시 시도
          </button>
        </div>
      )}
      <section className="todo-section" aria-label="할 일 결과" aria-busy={loading}>
        {loading ? (
          <div className="panel loading-panel">
            <span className="spinner" aria-hidden="true" />
            <p>할 일을 불러오는 중입니다…</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="panel empty-panel">
            <span className="empty-mark" aria-hidden="true">
              ✓
            </span>
            <h2>
              {Object.keys(applied).length > 0
                ? '조건에 맞는 할 일이 없어요'
                : '아직 할 일이 없어요'}
            </h2>
            <p>
              {Object.keys(applied).length > 0
                ? '필터 조건을 바꾸거나 초기화해 보세요.'
                : '새 할 일을 추가하고 팀의 흐름을 시작해 보세요.'}
            </p>
            <button
              className="button button-primary"
              type="button"
              onClick={() => {
                setCreating(true);
              }}
            >
              할 일 추가
            </button>
          </div>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </section>
      <nav className="pagination" aria-label="목록 페이지 이동">
        <span>
          {String(offset + 1)}–{String(offset + todos.length)} 항목
        </span>
        <div>
          <button
            type="button"
            className="button button-quiet button-small"
            disabled={offset === 0 || loading}
            onClick={() => {
              setLoading(true);
              setOffset(Math.max(0, offset - PAGE_SIZE));
            }}
          >
            ← 이전
          </button>
          <button
            type="button"
            className="button button-quiet button-small"
            disabled={loading || todos.length < PAGE_SIZE}
            onClick={() => {
              setLoading(true);
              setOffset(offset + PAGE_SIZE);
            }}
          >
            다음 →
          </button>
        </div>
      </nav>
    </div>
  );
}

function TodoCard({ todo }: { todo: Todo }) {
  return (
    <Link href={`/todos/${String(todo.id)}`} className="todo-card">
      <div className="todo-card-main">
        <span className={`status-dot status-${todo.status.toLowerCase()}`} aria-hidden="true" />
        <div className="todo-card-copy">
          <div className="todo-card-title-row">
            <h3>{todo.title}</h3>
            <span className={`priority priority-${todo.priority.toLowerCase()}`}>
              {priorityLabel[todo.priority]}
            </span>
          </div>
          {todo.description !== null && <p className="todo-description">{todo.description}</p>}
          <div className="todo-meta">
            <span className={`status-label status-text-${todo.status.toLowerCase()}`}>
              {statusLabel[todo.status]}
            </span>
            {todo.assignee !== null && <span>담당 · {todo.assignee}</span>}
            <span>마감 · {formatDate(todo.due_date)}</span>
          </div>
          {todo.tags.length > 0 && (
            <div className="tag-list">
              {todo.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="card-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </Link>
  );
}
