import fs from 'node:fs';
import path from 'node:path';
function visit(dir){for(const name of fs.readdirSync(dir)){const p=path.join(dir,name);if(fs.statSync(p).isDirectory())visit(p);else if(p.endsWith('.html')){const html=fs.readFileSync(p,'utf8');fs.writeFileSync(p,html.replace('<html lang="zh-CN"','<html lang="en"'));}}}
visit('dist/client/en');
fs.writeFileSync('dist/client/.nojekyll','');
