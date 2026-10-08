'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { useTheme } from './theme-provider';

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isSettings = pathname === '/settings';

  return (
    <div className="app-frame">
      <aside className="sidebar" aria-label="주요 메뉴">
        <Link className="brand" href="/" aria-label="Team Todo 홈">
          <Mark />
          <span className="brand-name">
            team<span>todo</span>
          </span>
        </Link>

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="primary-nav">
          <Link className={!isSettings ? 'nav-link is-active' : 'nav-link'} href="/">
            <span className="nav-icon" aria-hidden="true">
              ▤
            </span>
            <span>할 일</span>
            {!isSettings && <span className="nav-indicator" aria-hidden="true" />}
          </Link>
          <Link className={isSettings ? 'nav-link is-active' : 'nav-link'} href="/settings">
            <span className="nav-icon" aria-hidden="true">
              ⚙
            </span>
            <span>설정</span>
            {isSettings && <span className="nav-indicator" aria-hidden="true" />}
          </Link>
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-note">
          <span className="note-orbit" aria-hidden="true">
            ✳
          </span>
          <p>
            작은 일도
            <br />
            차근차근.
          </p>
          <span className="sidebar-theme">{theme === 'warm' ? 'WARM MODE' : 'FOCUS MODE'}</span>
        </div>
        <div className="sidebar-footer">
          LOCAL TEAM SPACE <span>·</span> 01
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <Link className="brand" href="/" aria-label="Team Todo 홈">
              <Mark />
              <span className="brand-name">
                team<span>todo</span>
              </span>
            </Link>
          </div>
          <div className="breadcrumbs">
            <span>TEAM TODO</span>
            <span className="crumb-slash">/</span>
            <span className="crumb-current">{isSettings ? '설정' : '내 작업'}</span>
          </div>
          <div className="topbar-right">
            <span className="theme-indicator">
              <i /> {theme === 'warm' ? 'WARM' : 'PRODUCTIVITY'}
            </span>
            <Link className="topbar-settings" href="/settings" aria-label="설정으로 이동">
              <span aria-hidden="true">⚙</span>
            </Link>
          </div>
        </header>

        <main className="page-content">{children}</main>
        <footer className="mobile-footer">
          <Link className={!isSettings ? 'mobile-nav-link is-active' : 'mobile-nav-link'} href="/">
            <span aria-hidden="true">▤</span> 할 일
          </Link>
          <Link
            className={isSettings ? 'mobile-nav-link is-active' : 'mobile-nav-link'}
            href="/settings"
          >
            <span aria-hidden="true">⚙</span> 설정
          </Link>
        </footer>
      </div>
    </div>
  );
}
