#!/usr/bin/env node
import fs from "node:fs";

const [referencePath, currentPath] = process.argv.slice(2);

if(!referencePath || !currentPath){
  console.error("Usage: node scripts/compare-map-status-snapshots.mjs <reference.json> <current.json>");
  process.exit(2);
}

function readSnapshot(path){
  const parsed=JSON.parse(fs.readFileSync(path,"utf8"));
  if(!Array.isArray(parsed)) throw new Error(`${path} does not contain a snapshot array`);
  return parsed;
}

function itemKey(item){
  return String(item && (item.key || `${item.lat},${item.lon}:${item.label}`) || "");
}

function sourceKey(item){
  return String(item && (item.key || item.source || "") || "");
}

const reference=readSnapshot(referencePath);
const current=readSnapshot(currentPath);
const currentByKey=new Map(current.map(item=>[itemKey(item),item]));
const referenceByKey=new Map(reference.map(item=>[itemKey(item),item]));
const diffs=[];

for(const ref of reference){
  const key=itemKey(ref);
  const cur=currentByKey.get(key);
  if(!cur){
    diffs.push({key,type:"missing-current",reference:ref});
    continue;
  }
  ["count","color","status"].forEach(field=>{
    if(String(ref[field] ?? "")!==String(cur[field] ?? "")){
      diffs.push({key,type:`group-${field}`,reference:ref[field],current:cur[field]});
    }
  });
  const currentSources=new Map((cur.sources || []).map(item=>[sourceKey(item),item]));
  for(const refSource of ref.sources || []){
    const source=sourceKey(refSource);
    const curSource=currentSources.get(source);
    if(!curSource){
      diffs.push({key,type:"missing-source-current",source,reference:refSource});
      continue;
    }
    ["color","status"].forEach(field=>{
      if(String(refSource[field] ?? "")!==String(curSource[field] ?? "")){
        diffs.push({key,type:`source-${field}`,source,reference:refSource[field],current:curSource[field]});
      }
    });
  }
}

for(const cur of current){
  const key=itemKey(cur);
  if(!referenceByKey.has(key)) diffs.push({key,type:"missing-reference",current:cur});
}

if(diffs.length){
  console.error(`Map status parity failed: ${diffs.length} differences`);
  console.error(JSON.stringify(diffs.slice(0,100),null,2));
  process.exit(1);
}

console.log(`Map status parity OK: ${reference.length} groups compared`);
