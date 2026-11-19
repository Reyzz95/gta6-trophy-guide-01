import { readFileSync, readdirSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';
const {trophies}=JSON.parse(readFileSync('app/data/trophies.json','utf8'));
assert.equal(trophies.length,55);
assert.equal(new Set(trophies.map(t=>t.name)).size,55);
assert.deepEqual(trophies.map(t=>t.id).sort((a,b)=>a-b),Array.from({length:55},(_,index)=>index+1),'Trophy IDs must uniquely cover 1–55 for checklist controls and routes');
for (const [grade,total] of Object.entries({platinum:1,gold:2,silver:6,bronze:46}))assert.equal(trophies.filter(t=>t.grade===grade).length,total);
assert.equal(trophies.filter(t=>t.hidden).length,28);
assert.deepEqual(trophies.filter(t=>t.missable).map(t=>t.name),['Positive Mental Attitude']);
for(const trophy of trophies){
 assert.ok(trophy.guide.trim().length>150,trophy.name+' needs a full guide');
 assert.ok(['story','missable','collectible','activity'].includes(trophy.kind));
 assert.ok(trophy.sources.length>=1);
 for(const source of trophy.sources){assert.ok(source.name);assert.ok(new URL(source.url).hostname);}
}
function checkLocalAssets(path){for(const name of readdirSync(path)){const file=path+'/'+name;if(statSync(file).isDirectory())checkLocalAssets(file);else if(/\.(html|js|css)$/.test(name))assert.ok(!/(?:https?:|(?<!:)\/\/[^\s])/.test(readFileSync(file,'utf8').replace(/^\s*\/\/.*$/gm,'')),file+' contains a non-local URL');}}
checkLocalAssets('app');
console.log('PASS: 55 unique trophies, grade totals 1/2/6/46, 28 hidden, only one missable, complete sourced guides, local assets.');
