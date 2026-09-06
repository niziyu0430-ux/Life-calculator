import fs from 'node:fs';
const origin=process.env.SITE_ORIGIN||'https://life-counter-lab.handy-wood-8441.chatgpt.site';
if(!['https://life-counter-lab.handy-wood-8441.chatgpt.site','https://life-counter.cn'].includes(origin))throw new Error('Unsupported site origin');
const paths=['','/about','/privacy','/guides/life-in-weeks','/guides/day-milestones','/guides/date-math'];
fs.writeFileSync('public/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['','/en'].flatMap(base=>paths.map(path=>'<url><loc>'+origin+(base+path||'/')+'</loc></url>')).join('')+'</urlset>');
fs.writeFileSync('public/robots.txt','User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
fs.writeFileSync('public/ads.txt','google.com, pub-9460160226236788, DIRECT, f08c47fec0942fa0\n');
