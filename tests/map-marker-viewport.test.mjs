import test from "node:test";
import assert from "node:assert/strict";

import { createMapMarkerRenderHelpers } from "../src/map-marker-render-utils.js";

test("mapa udržuje značky jen ve viditelné oblasti s rezervou",()=>{
  const added=[];
  const removed=[];
  let limits={south:49,west:14,north:50,east:16};
  const bounds=()=>({
    pad:()=>bounds(),
    contains:([lat,lon])=>lat>=limits.south && lat<=limits.north && lon>=limits.west && lon<=limits.east,
    getSouthWest:()=>({lat:limits.south,lng:limits.west}),
    getNorthEast:()=>({lat:limits.north,lng:limits.east})
  });
  const map={getBounds:bounds,on:()=>{}};
  const layer={removeLayer:marker=>removed.push(marker)};
  const leaflet={
    circleMarker:coords=>({coords,on(){return this;},addTo(){added.push(coords);return this;}}),
    marker:coords=>({coords,on(){return this;},addTo(){added.push(coords);return this;}}),
    divIcon:options=>options,
    DomEvent:{stop:()=>{}}
  };
  const helpers=createMapMarkerRenderHelpers({
    detailKey:row=>row.id,
    escValue:value=>value,
    getLastVisiblePlaceGroups:()=>[],
    getLayer:()=>layer,
    getLeaflet:()=>leaflet,
    getMap:()=>map,
    getRowsIndexVersion:()=>1,
    groupColor:()=>"green",
    groupPopupHtml:()=>"",
    groupPrimaryRow:group=>group.rows[0],
    markerRowsSignature:()=>"rows",
    openDetailById:()=>{},
    resetSourcePopupActivationGuard:()=>{}
  });
  const groups=[
    {key:"inside",lat:49.5,lon:15,rows:[{id:"inside",lat:49.5,lon:15}]},
    {key:"outside",lat:48,lon:13,rows:[{id:"outside",lat:48,lon:13}]}
  ];
  helpers.renderMapGroups(groups);
  assert.deepEqual(added,[[49.5,15]]);
  limits={south:47.5,west:12.5,north:48.5,east:13.5};
  helpers.renderMapGroups(groups);
  assert.deepEqual(added,[[49.5,15],[48,13]]);
  assert.equal(removed.length,1);
});

test("velká sada značek se vykreslí po dávkách mezi snímky",()=>{
  const frames=[];
  const previousRaf=globalThis.requestAnimationFrame;
  globalThis.requestAnimationFrame=callback=>{ frames.push(callback); return frames.length; };
  const added=[];
  const bounds={
    pad:()=>bounds,
    contains:()=>true,
    getSouthWest:()=>({lat:47,lng:12}),
    getNorthEast:()=>({lat:52,lng:19})
  };
  const helpers=createMapMarkerRenderHelpers({
    detailKey:row=>row.id,
    escValue:value=>value,
    getLastVisiblePlaceGroups:()=>[],
    getLayer:()=>({removeLayer:()=>{}}),
    getLeaflet:()=>({
      circleMarker:coords=>({on(){return this;},addTo(){added.push(coords);return this;}}),
      marker:coords=>({on(){return this;},addTo(){added.push(coords);return this;}}),
      divIcon:options=>options,
      DomEvent:{stop:()=>{}}
    }),
    getMap:()=>({getBounds:()=>bounds,on:()=>{}}),
    getRowsIndexVersion:()=>1,
    groupColor:()=>"green",
    groupPopupHtml:()=>"",
    groupPrimaryRow:group=>group.rows[0],
    markerRowsSignature:()=>"rows",
    openDetailById:()=>{},
    resetSourcePopupActivationGuard:()=>{}
  });
  const groups=Array.from({length:161},(_,index)=>({
    key:`g-${index}`,
    lat:49+(index/10000),
    lon:15,
    rows:[{id:`r-${index}`,lat:49+(index/10000),lon:15}]
  }));
  try{
    helpers.renderMapGroups(groups);
    assert.equal(added.length,80);
    assert.equal(frames.length,1);
    while(frames.length) frames.shift()();
    assert.equal(added.length,161);
  }finally{
    globalThis.requestAnimationFrame=previousRaf;
  }
});
