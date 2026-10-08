'use client';

import { useTheme } from '@/components/theme-provider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="page-stack settings-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">PREFERENCES</p>
          <h1>설정</h1>
          <p className="page-subtitle">앱의 분위기를 선택하고 나만의 작업 공간을 만들어 보세요.</p>
        </div>
      </header>
      <section className="panel settings-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">APPEARANCE</p>
            <h2>테마</h2>
            <p className="section-description">선택한 테마는 이 브라우저에 저장됩니다.</p>
          </div>
          <span className="theme-current">
            현재 · {theme === 'productivity' ? 'Productivity' : 'Warm'}
          </span>
        </div>
        <div className="theme-options" role="radiogroup" aria-label="테마 선택">
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'productivity'}
            className={`theme-option theme-option-productivity ${theme === 'productivity' ? 'selected' : ''}`}
            onClick={() => {
              setTheme('productivity');
            }}
          >
            <span className="theme-preview preview-productivity">
              <span className="preview-sidebar" />
              <span className="preview-content">
                <i />
                <i />
                <i />
              </span>
              <span className="preview-accent" />
            </span>
            <span className="theme-option-copy">
              <strong>Productivity</strong>
              <small>선명하고 집중도 높은 작업 공간</small>
            </span>
            <span className="radio-indicator" aria-hidden="true" />
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'warm'}
            className={`theme-option theme-option-warm ${theme === 'warm' ? 'selected' : ''}`}
            onClick={() => {
              setTheme('warm');
            }}
          >
            <span className="theme-preview preview-warm">
              <span className="preview-sidebar" />
              <span className="preview-content">
                <i />
                <i />
                <i />
              </span>
              <span className="preview-accent" />
            </span>
            <span className="theme-option-copy">
              <strong>Warm</strong>
              <small>차분하고 편안한 분위기</small>
            </span>
            <span className="radio-indicator" aria-hidden="true" />
          </button>
        </div>
        <p className="settings-note" role="status">
          {theme === 'productivity'
            ? 'Productivity 테마를 사용 중입니다.'
            : 'Warm 테마를 사용 중입니다.'}{' '}
          선택 즉시 앱 전체에 적용됩니다.
        </p>
      </section>
    </div>
  );
}
