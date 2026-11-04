// Uso: npm i world-atlas@2 topojson-client@3 in una cartella G, poi: node scripts/build-contorni.js G dati (mappa-mondo.topo.json = world-atlas/countries-50m.json copiato così com è)
const G=process.argv[2], OUT=process.argv[3]; const fs=require('fs');
const topo=require(G+'/node_modules/topojson-client');
const r=(x)=>Math.round(x*1e2)/1e2, r4=(x)=>Math.round(x*1e4)/1e4;
function round(geom,f){const m=c=>typeof c[0]==='number'?[f(c[0]),f(c[1])]:c.map(m);return {type:geom.type,coordinates:m(geom.coordinates)};}
function fc(file,obj,f,filter){const t=require(G+'/node_modules/world-atlas/'+file);const g=topo.feature(t,t.objects[obj]);
 return {type:'FeatureCollection',features:g.features.filter(filter||(()=>true)).map(x=>({type:'Feature',properties:{},geometry:round(x.geometry,f)}))};}

// Italia e paesi vicini (ISO numerico): IT 380, SM 674, VA 336, FR 250, CH 756, AT 040, SI 705, HR 191, MT 470, BA 070, ME 499, AL 008, TN 788, DZ 012, LY 434, DE 276, LI 438, MC 492, GR 300, RS 688, HU 348
const vicini=new Set(['380','674','336','250','756','040','705','191','470','070','499','008','788','012','434','276','438','492','300','688','348']);
const t=require(G+'/node_modules/world-atlas/countries-10m.json');
fs.writeFileSync(OUT+'/mappa-italia.json',JSON.stringify({type:'FeatureCollection',features:topo.feature(t,t.objects.countries).features.filter(x=>vicini.has(x.id)).map(x=>({type:'Feature',properties:{it:x.id==='380'||x.id==='674'||x.id==='336'},geometry:round(x.geometry,r4)}))}));
