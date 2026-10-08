import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/components/theme-provider';
import SettingsPage from './page';

describe('settings theme selection', () => {
  it('switches the app theme and persists it in a cookie', () => {
    render(
      <ThemeProvider initialTheme="productivity">
        <SettingsPage />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole('radio', { name: /Warm/ }));
    expect(screen.getByRole('radio', { name: /Warm/ })).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'warm');
    expect(document.cookie).toContain('team-todo-theme=warm');
  });
});
