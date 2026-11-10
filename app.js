/* ZERO — game controller & UI */
const $=i=>document.getElementById(i),sleep=t=>new Promise(r=>setTimeout(r,t));
const PATH={p:"M22.500 8.500a4.800 4.800 0 0 0-2.600 8.800C16.500 19 14.500 22 14.500 26.500h16c0-4.500-2-7.500-5.400-9.200a4.800 4.800 0 0 0-2.600-8.800zM12 29h21l1.500 6.500h-24zM10 37h25v3H10z",
n:"M13 38c0-9 3-13 8-17-2 0-4 1-5.500 3l-4-1.500c2-4 7-8 12-9.500l1.500-3.500 3 3c6 1.500 10 8 10 17.500v11zM10 38h25v3H10z",
b:"M22.500 4.500a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM22.500 12c5.500 3.500 9 8 9 13 0 3-1.500 5-4 6.500V34h-10v-2.500c-2.500-1.500-4-3.500-4-6.500 0-5 3.500-9 9-13zM12 35h21l1 3H11zM10 38.500h25v3H10z",
r:"M12 8h5v3.500h3.500V8h4v3.500H28V8h5v9l-4 3v11l3 3.500V38H13v-3.500l3-3.500V20l-4-3zM10 38.500h25v3H10z",
q:"M8 14l5 14 3.500-15 6 15 6-15 3.500 15 5-14 1.500 22H6.500zM8 37h29v4H8zM8 12a2 2 0 1 0 .1 0M16.500 10a2 2 0 1 0 .1 0M22.500 9a2 2 0 1 0 .1 0M28.500 10a2 2 0 1 0 .1 0M37 12a2 2 0 1 0 .1 0",
k:"M20.500 3h4v3.500H28v4h-3.500V14c6 2 10 7 10 13v8H10.500v-8c0-6 4-11 10-13v-3.500H17v-4h3.500zM8 37h29v4H8z"};
const pcs=(t,c,pop)=>`<svg class="pc ${c==="w"?"pw":"pb"}${pop?" pop":""}" viewBox="0 0 45 45"><path d="${PATH[t]}"/></svg>`;
const VAL={p:1,n:3,b:3,r:5,q:9};
let g=new Chess(),me="w",lvl=3,flip=false,sel=null,mvs=[],last=null,hint=null,busy=false,over=false,tok=0,ev={},bs={},ql={},pend=null,shOpen=false;

function speak(k,txt){const s=$("say");s.style.opacity=0;const t=txt||Say.pick(k);setTimeout(()=>{s.textContent="«"+t+"»";s.style.opacity=1;},180);
 const m=Say.mood(k);$("mood").textContent=m.label;$("app").className=m.cls;}
function fmt(c){if(c==null)return"0.0";if(Math.abs(c)>=9000)return c>0?"M+":"M−";return(c>0?"+":"")+(c/100).toFixed(1);}
const toW=(cp,turn)=>cp==null?0:(turn==="w"?cp:-cp);
const san=u=>{if(!u)return"—";const m=g.moves({verbose:true}).find(x=>x.from+x.to+(x.promotion||"")===u);return m?m.san:u;};

function render(){
 const B=g.board(),ck=g.in_check()?g.turn():null;let h="";
 for(let i=0;i<64;i++){const r=flip?7-(i>>3):i>>3,f=flip?7-(i&7):i&7,n="abcdefgh"[f]+(8-r),p=B[r][f];
  let c="sq "+((r+f)%2?"d":"l");
  if(last&&(last.from===n||last.to===n))c+=" last";
  if(sel===n)c+=" sel";
  if(hint&&(hint[0]===n||hint[1]===n))c+=" hint";
  const mv=mvs.find(m=>m.to===n);if(mv)c+=p||mv.flags.includes("e")?" cp2":" mv";
  if(p&&p.type==="k"&&p.color===ck)c+=" chk";
  h+=`<div class="${c}" data-n="${n}">${p?pcs(p.type,p.color,last&&last.to===n):""}${i%8===0?`<i class="co r">${8-r}</i>`:""}${i>55?`<i class="co f">${"abcdefgh"[f]}</i>`:""}</div>`;}
 $("bd").innerHTML=h;
 const cap={w:[],b:[]};g.history({verbose:true}).forEach(m=>{if(m.captured)cap[m.color].push(m.captured);});
 const O="qrbnp",row=(a,col)=>a.sort((x,y)=>O.indexOf(x)-O.indexOf(y)).map(t=>pcs(t,col)).join("");
 const opp=me==="w"?"b":"w",mine=cap[me].reduce((s,t)=>s+VAL[t],0),theirs=cap[opp].reduce((s,t)=>s+VAL[t],0),d=theirs-mine;
 $("ct").innerHTML=row(cap[opp],me)+(d>0?`<span>+${d}</span>`:"");
 $("cb").innerHTML=row(cap[me],opp)+(d<0?`<span>+${-d}</span>`:"");
 const e=ev[g.history().length],pc=(me==="w"?1:-1)*(e||0);
 $("evt").textContent=fmt(e==null?null:pc);$("bi").style.width=(e==null?50:100/(1+Math.exp(-pc/400)))+"%";
 $("bU").disabled=busy;
 if(shOpen)sheet();
}
function setBusy(b,txt){busy=b;if(b){$("app").className="think";$("mood").textContent=txt||"O'ylamoqda";}render();}

/* ---- play ---- */
$("bd").onclick=e=>{const q=e.target.closest(".sq");if(!q||busy||over||g.turn()!==me)return;const n=q.dataset.n,m=mvs.find(x=>x.to===n);
 if(sel&&m){if(m.flags.includes("p")){pend={from:sel,to:n};return promoUI();}return playerMove({from:sel,to:n});}
 const p=g.get(n);if(p&&p.color===me){sel=n;mvs=g.moves({square:n,verbose:true});}else{sel=null;mvs=[];}render();};
function promoUI(){modal("Piyodani almashtir","",[],`<div class="row pm">${["q","r","b","n"].map(t=>`<div class="btn" data-t="${t}">${pcs(t,me)}</div>`).join("")}</div>`);
 $("md").querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{close();playerMove({...pend,promotion:b.dataset.t});});}
async function playerMove(o){
 const t=tok,n0=g.history().length,m=g.move(o);last=m;sel=null;mvs=[];hint=null;render();
 if(end())return;
 setBusy(true);const t0=Date.now();
 const a=await Engine.analyze(g.fen(),8);if(t!==tok)return;
 const n=n0+1,cp=toW(a.cp,g.turn()),sg=me==="w"?1:-1;ev[n]=cp;
 const loss=sg*(ev[n0]-cp),same=bs[n0]&&bs[n0]===m.from+m.to+(m.promotion||""),gain=ev[n0-1]!==undefined?sg*(cp-ev[n0-1]):0;
 let k=null;
 if(same&&gain>=200&&loss<20){ql[n]="!!";k="brill";}
 else if(loss>300){ql[n]="??";k="blunder";}
 else if(loss>130){ql[n]="?";k="mistake";}
 else{if(loss>50)ql[n]="?!";else if(same)ql[n]="!";
  if(g.in_check())k="pcheck";else if(m.captured&&VAL[m.captured]>=5&&Math.random()<.6)k="capture";else if(same&&Math.random()<.25)k="good";}
 if(k)speak(k);else $("mood").textContent="O'ylamoqda";
 render();
 await botTurn(k?1300-(Date.now()-t0):0);
}
async function botTurn(wait){
 const t=tok;setBusy(true);await sleep(Math.max(wait||0,150));
 const u=await Engine.play(g.fen(),lvl);if(t!==tok)return;
 const m=g.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]});last=m;render();
 if(end())return;
 const a=await Engine.analyze(g.fen(),9);if(t!==tok)return;
 const n=g.history().length;ev[n]=toW(a.cp,g.turn());bs[n]=a.best;
 if(g.in_check())speak("check");else if(m.captured&&VAL[m.captured]>=3&&Math.random()<.5)speak("capture");else if(Math.random()<.12)speak("idle");else{$("mood").textContent="Mag'rur";$("app").className="smug";}
 setBusy(false);
}
function end(){
 if(!g.game_over())return false;over=true;busy=false;let ti,k,sub="";
 if(g.in_checkmate()){const pw=g.turn()!==me;ti=pw?"G'ALABA":"MAG'LUBIYAT";k=pw?"lose":"win";sub=pw?"Shax va mat. Sen yutding.":"Shax va mat. Lelouch yutdi.";}
 else{ti="DURANG";k="draw";sub=g.in_stalemate()?"Pat":g.in_threefold_repetition()?"Uch marta takrorlanish":g.insufficient_material()?"Material yetarli emas":"50 yurish qoidasi";}
 speak(k);render();const line=Say.pick(k);setTimeout(()=>result(ti,sub,line),900);return true;
}
function result(ti,sub,line){modal(ti,`${sub}<br><br>«${line}»`,[["Yangi o'yin",setup,"pr"],["Doskani ko'rish",close]]);}

/* ---- controls ---- */
function newGame(){tok++;Engine.stop();g=new Chess();sel=null;mvs=[];last=null;hint=null;ev={0:0};bs={};ql={};over=false;busy=false;flip=me==="b";render();speak("open");if(me==="b")botTurn(600);}
$("bU").onclick=()=>{if(busy)return;const h=g.history().length;if(!h)return;if(over)over=false;
 const k=Math.min(h,g.turn()===me?2:1);for(let i=0;i<k;i++){const n=g.history().length;delete ev[n];delete bs[n];delete ql[n];g.undo();}
 const hv=g.history({verbose:true});last=hv[hv.length-1]||null;sel=null;mvs=[];hint=null;render();speak("undo");if(g.turn()!==me)botTurn(800);};
$("bF").onclick=()=>{flip=!flip;render();};
$("bH").onclick=async()=>{if(busy||over||g.turn()!==me)return;const t=tok,n=g.history().length;let b=bs[n];
 if(!b){setBusy(true,"Tahlil");const a=await Engine.analyze(g.fen(),10);if(t!==tok)return;b=bs[n]=a.best;ev[n]=toW(a.cp,g.turn());setBusy(false);}
 hint=[b.slice(0,2),b.slice(2,4)];render();speak("good","Eng yaxshi yurish: "+san(b)+". Buni senga faqat bir marta aytaman.");};
$("bA").onclick=()=>{shOpen=true;sheet();};
$("bM").onclick=()=>modal("Menyu","",[["Yangi o'yin",setup,"pr"],["Qayta boshlash",()=>sure("Qayta boshlash","Joriy o'yin yo'qoladi.",newGame)],["Taslim bo'lish",()=>sure("Taslim bo'lish","Haqiqatan taslim bo'lasizmi?",resign)],["Yopish",close]]);
function resign(){if(over)return;tok++;Engine.stop();over=true;busy=false;render();speak("resign");setTimeout(()=>result("TASLIM","Siz taslim bo'ldingiz.",Say.pick("resign")),700);}
function sure(t,m,fn){modal(t,m,[["Ha",()=>{close();fn();},"pr"],["Yo'q",close]]);}

/* ---- modals ---- */
function modal(t,p,btns,extra){shOpen=false;$("ov").className="ov on";$("md").innerHTML=`<h2>${t}</h2>${p?`<p>${p}</p>`:""}${extra||""}`;
 btns.forEach(([l,f,c])=>{const b=document.createElement("div");b.className="btn "+(c||"");b.textContent=l;b.onclick=()=>{if(f===close||f===setup||c!=="pr")f();else f();};$("md").appendChild(b);});}
function close(){shOpen=false;$("ov").className="ov";}
function setup(){let col=me==="b"?"b":"w";
 modal("ZERO","Raqibingni tanla.",[["Jangni boshlash",()=>{me=col==="r"?(Math.random()<.5?"w":"b"):col;close();newGame();},"pr"]],
 `<div class="lb">DONALAR</div><div class="row" id="cc">${[["w","Oq"],["b","Qora"],["r","Tasodifiy"]].map(([v,l])=>`<div class="btn${v===col?" on":""}" data-v="${v}">${l}</div>`).join("")}</div>
 <div class="lb">QIYINLIK (ELO)</div><div class="row" id="lc">${LV.map((l,i)=>`<div class="btn${i===lvl?" on":""}" data-i="${i}">${l.elo}</div>`).join("")}</div>`);
 const go=$("md").lastChild;$("md").appendChild(go);
 $("cc").onclick=e=>{const v=e.target.dataset.v;if(!v)return;col=v;[...$("cc").children].forEach(x=>x.classList.toggle("on",x.dataset.v===v));};
 $("lc").onclick=e=>{const v=e.target.dataset.i;if(v==null)return;lvl=+v;[...$("lc").children].forEach(x=>x.classList.toggle("on",x.dataset.i===v));};}
function sheet(){const h=g.history(),e=ev[h.length],pc=e==null?null:(me==="w"?1:-1)*e;let rows="";
 for(let i=0;i<h.length;i+=2)rows+=`<tr><td>${i/2+1}.</td><td>${h[i]}${ql[i+1]||""}</td><td>${h[i+1]?h[i+1]+(ql[i+2]||""):""}</td></tr>`;
 $("ov").className="ov on sh";$("md").innerHTML=`<h2>TAHLIL</h2><div class="kv">Baho (senga nisbatan)<b>${fmt(pc)}</b></div><div class="kv">Eng yaxshi yurish<b>${bs[h.length]&&g.turn()===me?san(bs[h.length]):"—"}</b></div><div class="kv">Daraja<b>${LV[lvl].elo} Elo</b></div><div class="kv">Dvigatel<b>${Engine.type==="sf"?"Stockfish":"Rezerv"}</b></div><div class="lb" style="margin-top:6px">YURISHLAR (!! a'lo, ! yaxshi, ?! noaniq, ? xato, ?? qo'pol xato)</div><table>${rows||"<tr><td></td><td>Hali yurish yo'q</td></tr>"}</table>`;
 const b=document.createElement("div");b.className="btn";b.textContent="Yopish";b.onclick=close;$("md").appendChild(b);shOpen=true;}
$("ov").onclick=e=>{if(e.target.id==="ov"&&$("md").querySelector("[data-t]")==null&&shOpen)close();};

Engine.init().then(t=>{const e=$("eng");if(t==="sf"){e.textContent="Stockfish ✓";e.className="ok";}else{e.textContent="Rezerv dvigatel";e.className="fb";}});
render();setup();
