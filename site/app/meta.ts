import type { Metadata } from 'next';
export const origin =
  process.env.SITE_ORIGIN || 'https://life-counter-lab.niziyu0430.chatgpt.site';
export function pageMeta(
  path: string,
  title: string,
  description: string,
  en = false,
): Metadata {
  const zh = path,
    english = '/en' + path;
  return {
    title,
    description,
    alternates: {
      canonical: origin + (en ? english : zh || '/'),
      languages: {
        'zh-CN': origin + (zh || '/'),
        en: origin + english,
        'x-default': origin + (zh || '/'),
      },
    },
    openGraph: {
      title,
      description,
      url: origin + (en ? english : zh || '/'),
      type: 'website',
      locale: en ? 'en_US' : 'zh_CN',
    },
    robots: { index: true, follow: true },
  };
}
