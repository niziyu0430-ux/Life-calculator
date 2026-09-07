import type { Metadata } from 'next';
import './globals.css';
import './game.css';
export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  other: { 'google-adsense-account': 'ca-pub-9460160226236788' },
  title: '人生计算器 · 看见时间的形状',
  description:
    '用人生周历看见走过的时间，发现整千天纪念日，计算日期间隔。免费、无需注册。',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
