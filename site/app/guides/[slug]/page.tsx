import Article from '../../article';
import { guides } from '../../content';
import { pageMeta } from '../../meta';
export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = guides.find((g) => g.slug === slug);
  return g
    ? pageMeta(
        '/guides/' + slug,
        g.zh.title + ' · 人生计算器',
        g.zh.description,
      )
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <Article slug={(await params).slug} />;
}
