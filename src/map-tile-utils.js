export const MAP_TILE_URL_TEMPLATE="https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const MAP_TILE_CACHE_NAME="astip-szz-map-tiles-v1";

function clampTile(value,z){
  const max=Math.pow(2,z)-1;
  return Math.max(0,Math.min(max,value));
}

function lonToTileX(lon,z){
  return clampTile(Math.floor((Number(lon)+180)/360*Math.pow(2,z)),z);
}

function latToTileY(lat,z){
  const limited=Math.max(-85.05112878,Math.min(85.05112878,Number(lat)));
  const rad=limited*Math.PI/180;
  return clampTile(Math.floor((1-Math.log(Math.tan(rad)+1/Math.cos(rad))/Math.PI)/2*Math.pow(2,z)),z);
}

function mapTileUrl(z,x,y){
  return MAP_TILE_URL_TEMPLATE
    .replace("{z}",String(z))
    .replace("{x}",String(x))
    .replace("{y}",String(y));
}

function boundsValue(bounds,key){
  const method="get"+key.charAt(0).toUpperCase()+key.slice(1);
  if(bounds && typeof bounds[method]==="function") return bounds[method]();
  return Number(bounds && bounds[key]);
}

export function mapTileUrlsForBounds(bounds,zooms,maxTiles=Infinity){
  const west=boundsValue(bounds,"west");
  const east=boundsValue(bounds,"east");
  const north=boundsValue(bounds,"north");
  const south=boundsValue(bounds,"south");
  if(![west,east,north,south].every(Number.isFinite)) return [];
  const urls=[];
  for(const zRaw of zooms){
    const z=Math.max(3,Math.min(17,Number(zRaw)));
    if(!Number.isFinite(z)) continue;
    const x1=lonToTileX(west,z);
    const x2=lonToTileX(east,z);
    const y1=latToTileY(north,z);
    const y2=latToTileY(south,z);
    const xStart=Math.min(x1,x2), xEnd=Math.max(x1,x2);
    const yStart=Math.min(y1,y2), yEnd=Math.max(y1,y2);
    for(let x=xStart;x<=xEnd;x++){
      for(let y=yStart;y<=yEnd;y++){
        urls.push(mapTileUrl(z,x,y));
        if(urls.length>=maxTiles) return urls;
      }
    }
  }
  return urls;
}

export function visibleMapTileUrlsForMap(map,maxTiles=650){
  if(!map || typeof map.getBounds!=="function") return [];
  const bounds=map.getBounds().pad(0.15);
  const zoom=Math.max(3,Math.min(17,Math.round(map.getZoom() || 7)));
  const zooms=[];
  for(let z=zoom;z<=Math.min(17,zoom+2);z++) zooms.push(z);
  return mapTileUrlsForBounds(bounds,zooms,maxTiles);
}

export function czechOfflineMapTileUrls(){
  return [];
}
