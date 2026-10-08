'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TodoForm } from '@/components/todo-form';
import { ApiError, deleteTodo, getTodo, updateTodo } from '@/lib/todos/api';
import { makeTodoPatch, toTodoFields, type TodoFormValues } from '@/lib/todos/forms';
import { formatDate, formatDateTime, priorityLabel, statusLabel } from '@/lib/todos/presentation';
import type { Todo } from '@/lib/todos/types';

export default function TodoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const invalidId = !Number.isSafeInteger(id) || id < 1;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (invalidId) return;
    let active = true;
    void getTodo(id)
      .then((result) => {
        if (active) setTodo(result);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(cause instanceof ApiError ? cause.message : '상세 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, invalidId]);
  async function save(values: TodoFormValues) {
    if (todo === null) return;
    const next = toTodoFields(values);
    const patch = makeTodoPatch(todo, next);
    if (Object.keys(patch).length === 0) {
      setEditing(false);
      return;
    }
    const updated = await updateTodo(id, patch);
    setTodo(updated);
    setEditing(false);
  }
  async function remove() {
    if (
      todo === null ||
      !window.confirm(`“${todo.title}” 할 일을 삭제할까요? 삭제한 항목은 복구할 수 없습니다.`)
    )
      return;
    setDeleting(true);
    setError(null);
    try {
      await deleteTodo(id);
      router.push('/');
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : '삭제하지 못했습니다.');
      setDeleting(false);
    }
  }
  return (
    <div className="page-stack detail-page">
      <Link className="back-link" href="/">
        ← 목록으로
      </Link>
      {invalidId ? (
        <div className="panel empty-panel">
          <span className="empty-mark empty-mark-error" aria-hidden="true">
            !
          </span>
          <h1>올바르지 않은 주소입니다</h1>
          <Link href="/" className="button button-primary">
            목록으로 돌아가기
          </Link>
        </div>
      ) : loading ? (
        <div className="panel loading-panel">
          <span className="spinner" aria-hidden="true" />
          <p>할 일 정보를 불러오는 중입니다…</p>
        </div>
      ) : error !== null && todo === null ? (
        <div className="panel empty-panel">
          <span className="empty-mark empty-mark-error" aria-hidden="true">
            !
          </span>
          <h1>할 일을 불러오지 못했어요</h1>
          <p role="alert">{error}</p>
          <Link href="/" className="button button-primary">
            목록으로 돌아가기
          </Link>
        </div>
      ) : (
        todo !== null && (
          <>
            {error !== null && (
              <div role="alert" className="notice notice-error">
                {error}
              </div>
            )}
            {editing ? (
              <section className="panel detail-edit">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">EDIT TASK</p>
                    <h1>할 일 수정</h1>
                  </div>
                </div>
                <TodoForm
                  key={todo.updated_at}
                  initialTodo={todo}
                  submitLabel="변경 사항 저장"
                  onSubmit={save}
                  onCancel={() => {
                    setEditing(false);
                  }}
                />
              </section>
            ) : (
              <article className="panel detail-card">
                <div className="detail-topline">
                  <span className={`status-label status-text-${todo.status.toLowerCase()}`}>
                    {statusLabel[todo.status]}
                  </span>
                  <span className={`priority priority-${todo.priority.toLowerCase()}`}>
                    우선순위 · {priorityLabel[todo.priority]}
                  </span>
                  <div className="detail-actions">
                    <button
                      className="button button-quiet button-small"
                      type="button"
                      onClick={() => {
                        setEditing(true);
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="button button-danger button-small"
                      type="button"
                      disabled={deleting}
                      onClick={() => void remove()}
                    >
                      {deleting ? '삭제 중…' : '삭제'}
                    </button>
                  </div>
                </div>
                <h1 className="detail-title">{todo.title}</h1>
                <div className="detail-facts">
                  <div>
                    <span>담당자</span>
                    <strong>{todo.assignee ?? '미지정'}</strong>
                  </div>
                  <div>
                    <span>마감일</span>
                    <strong>{formatDate(todo.due_date)}</strong>
                  </div>
                  <div>
                    <span>생성일</span>
                    <strong>{formatDateTime(todo.created_at)}</strong>
                  </div>
                  <div>
                    <span>마지막 수정</span>
                    <strong>{formatDateTime(todo.updated_at)}</strong>
                  </div>
                </div>
                <section className="detail-description">
                  <h2>설명</h2>
                  <p>{todo.description ?? '등록된 설명이 없습니다.'}</p>
                </section>
                <section className="detail-tags">
                  <h2>태그</h2>
                  {todo.tags.length > 0 ? (
                    <div className="tag-list">
                      {todo.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p>등록된 태그가 없습니다.</p>
                  )}
                </section>
              </article>
            )}
          </>
        )
      )}
    </div>
  );
}
