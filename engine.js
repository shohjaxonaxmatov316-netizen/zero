/* ZERO — chess engine: Stockfish.js (Web Worker) + built-in fallback. Requires chess.js. */
const LV=[
 {elo:800, skill:0, depth:1, ms:300, fd:1, noise:350},
 {elo:1000,skill:2, depth:2, ms:400, fd:1, noise:180},
 {elo:1200,skill:4, depth:3, ms:500, fd:2, noise:120},
 {elo:1500,skill:8, depth:5, ms:700, fd:2, noise:50},
 {elo:1800,skill:12,depth:8, ms:1000,fd:2, noise:15},
 {elo:2000,skill:16,depth:10,ms:1400,fd:3, noise:5},
 {elo:2500,skill:20,depth:14,ms:2200,fd:3, noise:0}];
const Engine=(()=>{
 let w=null,cb=null,sc=null,chain=Promise.resolve(),type="loading";
 const CDN="https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js";
 function boot(u){return new Promise((ok,no)=>{
  let x;try{x=u.startsWith("http")?new Worker(URL.createObjectURL(new Blob(['importScripts("'+u+'")']))):new Worker(u);}catch(e){return no(e);}
  const t=setTimeout(()=>{x.terminate();no("timeout");},25000);
  x.onerror=e=>{clearTimeout(t);no(e);};
  x.onmessage=e=>{const l=String(e.data);if(l==="uciok")x.postMessage("isready");
   else if(l==="readyok"){clearTimeout(t);w=x;x.onmessage=onmsg;x.onerror=null;ok();}};
  x.postMessage("uci");});}
 function onmsg(e){const l=String(e.data);
  if(l.startsWith("info")&&l.includes(" score ")){const m=l.match(/score (cp|mate) (-?\d+)/);if(m){const v=+m[2];sc=m[1]==="cp"?v:(v>0?10000-v:-10000-v);}}
  else if(l.startsWith("bestmove")){const f=cb;cb=null;if(f)f({best:l.split(" ")[1],cp:sc});}}
 const init=(async()=>{for(const u of ["stockfish.js",CDN]){try{await boot(u);type="sf";return type;}catch(e){}}type="fb";return type;})();
 function sf(fen,skill,go){const p=chain.then(()=>new Promise(r=>{cb=r;sc=null;
  w.postMessage("setoption name Skill Level value "+skill);w.postMessage("position fen "+fen);w.postMessage("go "+go);}));
  chain=p.catch(()=>{});return p;}
 /* fallback: small alpha-beta */
 const PV={p:100,n:320,b:330,r:500,q:900,k:0};
 function ev(g){let s=0;g.board().forEach((row,r)=>row.forEach((p,f)=>{if(!p)return;let v=PV[p.type];
  if(p.type==="p")v+=(p.color==="w"?6-r:r-1)*7;else if(p.type!=="k"&&p.type!=="r")v+=12-(Math.abs(3.5-r)+Math.abs(3.5-f))*3;
  s+=p.color==="w"?v:-v;}));return s;}
 function nega(g,d,a,b){if(!d)return(g.turn()==="w"?1:-1)*ev(g);const ms=g.moves({verbose:true});
  if(!ms.length)return g.in_check()?-99999-d:0;ms.sort((x,y)=>(y.captured?1:0)-(x.captured?1:0));let best=-1e9;
  for(const m of ms){g.move(m);const v=-nega(g,d-1,-b,-a);g.undo();if(v>best)best=v;if(best>a)a=best;if(a>=b)break;}return best;}
 async function fb(fen,d,noise){await new Promise(r=>setTimeout(r,40));const g=new Chess(fen),ms=g.moves({verbose:true});let bm=null,bv=-1e9,bc=0;
  for(const m of ms){g.move(m);const v=-nega(g,d-1,-1e9,1e9);g.undo();const s=v+Math.random()*noise;if(s>bv){bv=s;bm=m;bc=v;}}
  return{best:bm?bm.from+bm.to+(bm.promotion||""):null,cp:g.turn()==="w"?bc:-bc};}
 return{
  init:()=>init,get type(){return type;},
  async play(fen,i){await init;const L=LV[i];if(type==="sf")return(await sf(fen,L.skill,"depth "+L.depth+" movetime "+L.ms)).best;return(await fb(fen,L.fd,L.noise)).best;},
  async analyze(fen,d){await init;if(type==="sf")return sf(fen,20,"depth "+d+" movetime 700");return fb(fen,2,0);},
  stop(){if(w&&cb)w.postMessage("stop");}};
})();
