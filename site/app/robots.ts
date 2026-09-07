import { origin } from './meta';
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: origin + '/sitemap.xml',
  };
}
