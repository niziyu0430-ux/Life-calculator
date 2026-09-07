import Experiment from './article-experiment';
import { guides } from './content';
import { notFound } from 'next/navigation';
export function PageShell({
  en,
  title,
  children,
}: {
  en: boolean;
  title: string;
  children: React.ReactNode;
}) {
  const base = en ? '/en' : '';
  return (
    <div lang={en ? 'en' : 'zh-CN'}>
      <header>
        <a className="brand" href={base || '/'}>
          <span className="brandmark">◷</span>
          {en ? 'Life Counter' : '人生计算器'}
        </a>
        <a href={base || '/'}>← {en ? 'Back to the tools' : '返回计算器'}</a>
      </header>
      <main className="prose">
        <p className="eyebrow">LIFE COUNTER / FIELD NOTES</p>
        <h1>{title}</h1>
        {children}
      </main>
      <footer>
        <span>© 2026 Life Counter</span>
        <div>
          <a href={base + '/about'}>{en ? 'About & contact' : '关于与联系'}</a>
          <a href={base + '/privacy'}>{en ? 'Privacy' : '隐私说明'}</a>
        </div>
      </footer>
    </div>
  );
}
export default function Article({
  slug,
  en = false,
}: {
  slug: string;
  en?: boolean;
}) {
  const g = guides.find((g) => g.slug === slug);
  if (!g) notFound();
  const data = en ? g.en : g.zh;
  return (
    <PageShell en={en} title={data.title}>
      <p className="article-meta">
        {en
          ? 'Life Counter editorial notes · Updated September 7, 2026'
          : '人生计算器编辑手记 · 更新于 2026 年 9 月 7 日'}{' '}
        ·{' '}
        <a
          href={(en ? '' : '/en') + '/guides/' + slug}
          lang={en ? 'zh-CN' : 'en'}
        >
          {en ? '中文版' : 'Read in English'}
        </a>
      </p>
      <p className="lead">{data.description}</p>
      <img
        className="article-cover"
        src={
          slug.includes('milestone')
            ? '/images/time-hourglass.webp'
            : '/images/time-garden.webp'
        }
        alt={
          en
            ? 'An original paper-sculpture illustration about time'
            : '关于时间的原创纸艺风格插画'
        }
        width="1536"
        height="1024"
      />
      <nav
        className="article-toc"
        aria-label={en ? 'In this note' : '本篇目录'}
      >
        {data.sections.map((s, i) => (
          <a key={s.heading} href={'#section-' + i}>
            {String(i + 1).padStart(2, '0')} {s.heading}
          </a>
        ))}
      </nav>
      <Experiment slug={slug} en={en} />
      {data.sections.map((s, i) => (
        <section key={s.heading} id={'section-' + i}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
      {slug === 'date-math' && (
        <section>
          <h2>{en ? 'Reference reading' : '参考资料'}</h2>
          <ul>
            <li>
              <a href="https://aa.usno.navy.mil/faq/calendars">
                U.S. Naval Observatory — Calendars
              </a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date">
                MDN — JavaScript Date
              </a>
            </li>
          </ul>
        </section>
      )}
      {slug === 'milestone-calendar' && (
        <p>
          <a href="https://www.rfc-editor.org/rfc/rfc5545#section-3.6.1">
            iCalendar RFC 5545 · All-day event format
          </a>
        </p>
      )}
      <div className="article-cta">
        <h2>{en ? 'Try it with your own dates' : '换成你的日期，试一试'}</h2>
        <a href={en ? '/en' : '/'}>
          {en ? 'Open the calculator' : '打开人生计算器'} ↗
        </a>
      </div>
      <h2>{en ? 'Keep reading' : '继续阅读'}</h2>
      {guides
        .filter((x) => x.slug !== slug)
        .map((x) => (
          <p key={x.slug}>
            <a href={(en ? '/en' : '') + '/guides/' + x.slug}>
              {en ? x.en.title : x.zh.title} ↗
            </a>
          </p>
        ))}
    </PageShell>
  );
}
