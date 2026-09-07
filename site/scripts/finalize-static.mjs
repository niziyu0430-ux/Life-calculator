import fs from 'node:fs';
import path from 'node:path';
function visit(dir){for(const name of fs.readdirSync(dir)){const p=path.join(dir,name);if(fs.statSync(p).isDirectory())visit(p);else if(p.endsWith('.html')){const html=fs.readFileSync(p,'utf8');fs.writeFileSync(p,html.replace('<html lang="zh-CN"','<html lang="en"'));}}}
visit('dist/client/en');
fs.writeFileSync('dist/client/.nojekyll','');
const legacy={'privacy.html':'/privacy/','about.html':'/about/','contact.html':'/about/','calculators.html':'/#calendar','articles.html':'/#reading','lifecounter.html':'/','lifecountergoogle.html':'/','time-calculator.html':'/#calendar'};
const origin=process.env.SITE_ORIGIN||'https://life-counter-lab.niziyu0430.chatgpt.site';
for(const [from,to] of Object.entries(legacy)){const dest=origin+to;fs.writeFileSync(path.join('dist/client',from),'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0; url='+dest+'"><link rel="canonical" href="'+dest.split('#')[0]+'"><title>页面已迁移 · Life Counter</title></head><body><p>页面已迁移。Page moved.</p><a href="'+dest+'">打开新版 / Open the new page</a></body></html>');}
