import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const docs=path.join(root,'docs');
const origin='https://life-counter.cn';
const read=p=>fs.readFileSync(path.join(docs,p),'utf8');
const resolveUrl=url=>{let p=decodeURIComponent(url.pathname).replace(/^\/+/, '');const direct=path.resolve(docs,p);assert.ok(direct===docs||direct.startsWith(docs+path.sep),'Path escapes release');if(fs.existsSync(direct)&&fs.statSync(direct).isFile())return direct;return path.join(direct,'index.html')};
const xml=read('sitemap.xml');
const entries=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(entries.length,12,'Expected 12 substantive bilingual pages');
assert.equal(new Set(entries).size,entries.length,'Duplicate sitemap URL');
let links=0,assets=0;
for(const entry of entries){
 const url=new URL(entry);assert.equal(url.origin,origin,'Sitemap has a wrong domain');
 const file=resolveUrl(url);assert.ok(fs.existsSync(file),'Missing sitemap page: '+entry);
 const html=fs.readFileSync(file,'utf8');
 assert.match(html,/<title>[^<]+<\/title>/,'Missing page title');
 assert.ok(!html.includes('lifecalculator.com')&&!html.includes('handy-wood-8441.chatgpt.site'),'Stale template domain in '+entry);
 const canonical=html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);assert.ok(canonical,'Missing canonical: '+entry);assert.equal(new URL(canonical[1]).href.replace(/\/$/,''),url.href.replace(/\/$/,''),'Wrong canonical: '+entry);
 const en=url.pathname.startsWith('/en');assert.ok(html.includes('<html lang="'+(en?'en':'zh-CN')+'"'),'Wrong document language: '+entry);
 for(const tag of html.matchAll(/<link\b[^>]*>/g)){if(!/rel="alternate"/.test(tag[0]))continue;const href=tag[0].match(/href="([^"]+)"/)?.[1];if(!href)continue;const target=new URL(href,url);assert.equal(target.origin,origin);assert.ok(fs.existsSync(resolveUrl(target)),'Broken language alternate: '+href);}
 for(const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)){const raw=match[1].replaceAll('&amp;','&');if(raw.startsWith('mailto:')){assert.equal(raw,'mailto:niziyu0430@gmail.com');continue}const target=new URL(raw,url);if(target.origin!==origin)continue;const targetFile=resolveUrl(target);assert.ok(fs.existsSync(targetFile),'Broken internal link: '+raw+' on '+entry);if(target.hash){const targetHtml=fs.readFileSync(targetFile,'utf8');assert.ok(targetHtml.includes('id="'+target.hash.slice(1)+'"'),'Missing anchor: '+raw)}links++;}
 for(const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"#]+)"[^>]*>/g)){const target=new URL(match[1].replaceAll('&amp;','&'),url);if(target.origin!==origin||!target.pathname.startsWith('/_next/'))continue;assert.ok(fs.existsSync(resolveUrl(target)),'Missing runtime asset: '+target.pathname);assets++;}
}
assert.equal(read('CNAME').trim(),'life-counter.cn','Wrong CNAME');
assert.equal(read('ads.txt').trim(),'google.com, pub-9460160226236788, DIRECT, f08c47fec0942fa0','Unexpected publisher');
assert.ok(read('robots.txt').includes('Sitemap: '+origin+'/sitemap.xml'),'Wrong robots sitemap');
assert.ok(fs.existsSync(path.join(docs,'.nojekyll')),'GitHub Pages must retain underscored assets');
assert.ok(fs.existsSync(path.join(docs,'404.html')),'Missing static 404 page');
console.log(JSON.stringify({result:'passed',pages:entries.length,internalLinksChecked:links,runtimeAssetReferencesChecked:assets,origin,checks:['canonical','language alternates','document language','sitemap targets','internal links and anchors','runtime assets','CNAME','ads.txt','robots','GitHub Pages assets','404 document']},null,2));

