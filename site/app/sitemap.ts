import { origin } from './meta';
import { guides } from './content';
export default function sitemap() {
  return ['', '/en'].flatMap((base) =>
    [
      '',
      '/about',
      '/privacy',
      '/week-planner',
      ...guides.map((g) => '/guides/' + g.slug),
    ].map((path) => ({ url: origin + (base + path || '/') })),
  );
}
