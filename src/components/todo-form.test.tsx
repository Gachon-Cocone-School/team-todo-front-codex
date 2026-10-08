import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TodoForm } from './todo-form';

describe('TodoForm', () => {
  it('shows validation feedback without submitting an empty title', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    render(<TodoForm submitLabel="추가" onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: '추가' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('제목');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits normalized form values and reports API errors', async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    const first = render(<TodoForm submitLabel="추가" onSubmit={onSubmit} />);
    const firstForm = within(first.container);
    fireEvent.change(firstForm.getByLabelText(/제목/), { target: { value: '  회의 준비  ' } });
    fireEvent.change(firstForm.getByLabelText(/^태그/), { target: { value: '회의, 공유' } });
    fireEvent.click(firstForm.getByRole('button', { name: '추가' }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: '  회의 준비  ', tags: '회의, 공유' }),
      );
    });
    const rejected = vi.fn(() => Promise.reject(new Error('저장 오류')));
    const second = render(<TodoForm submitLabel="저장" onSubmit={rejected} />);
    const secondForm = within(second.container);
    fireEvent.change(secondForm.getByLabelText(/제목/), { target: { value: '제목' } });
    fireEvent.click(secondForm.getByRole('button', { name: '저장' }));
    expect(await secondForm.findByRole('alert')).toHaveTextContent('저장 오류');
  });
});
