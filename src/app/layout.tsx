import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Epilogue, Inter, Plus_Jakarta_Sans } from 'next/font/google';

import { AppShell } from '@/components/app-shell';
import { ThemeProvider, type ThemeName } from '@/components/theme-provider';

import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const epilogue = Epilogue({ subsets: ['latin'], variable: '--font-epilogue' });

export const metadata: Metadata = {
  title: 'Team Todo — 함께 정리하는 오늘',
  description: '팀의 할 일을 선명하게 정리하는 로컬 워크스페이스',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get('team-todo-theme')?.value;
  const initialTheme: ThemeName = savedTheme === 'warm' ? 'warm' : 'productivity';

  return (
    <html lang="ko" data-theme={initialTheme}>
      <body className={`${jakarta.variable} ${inter.variable} ${epilogue.variable}`}>
        <ThemeProvider initialTheme={initialTheme}>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
