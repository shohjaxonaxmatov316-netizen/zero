/* ZERO — Lelouch dialogue database (Uzbek, Latin). */
const Say=(()=>{
const P={
open:["Endi mening navbatim.","Men Zero'man. Yur, qani ko'raylik.","Dunyo mening qo'limda o'zgaradi.","Men senga buyruq beryapman!","Qirol yolg'iz yuradi. Boshla."],
blunder:["Sen hozir katta xatoga yo'l qo'yding.","Sening xatong — meni oddiy raqib deb o'ylaganing.","Bu yurish senga qimmatga tushadi.","Rahmim kelyapti. Deyarli."],
mistake:["Qiziqarli yurish. Lekin bu yetarli emas.","Har bir yurishning o'z narxi bor.","Aniqlik yetishmayapti.","Sen shoshilding. Men esa kutaman."],
good:["Munosib yurish.","Shaxmatda ham, hayotda ham bir qadam oldinda bo'lish kerak.","Yomon emas. Davom et.","Sen mening rejamni ko'ryapsan, ammo uning oxirini emas."],
brill:["Hmm... Kutilganimdan ancha qobiliyatli ekansan.","Bu yurishni kutmagandim. Tan olaman.","Sen yaxshi kurashding. Ammo hali tugagani yo'q."],
check:["Shax! Endi qanday qutulmoqchisan?","Shax. Qirolingni himoya qil.","Shax! Qo'rquv — aqlni zaiflashtiradigan zanjir."],
pcheck:["Meni qisti-bosmoqchimisan? Bo'lmaydi.","Shax... Xotirjamlik. Hammasi nazoratda.","Qirolimga tahdid? Jasoratli."],
capture:["Bu qurbonlik rejaning bir qismi edi.","Har bir yurishning o'z narxi bor.","Dona yo'qotding. Navbatdagisi kim?"],
idle:["G'alaba qozonish uchun imkoniyat kutmayman. Uni yarataman.","Meni tushunishing shart emas. Faqat to'xtatishga urin.","Men taqdirga bo'ysunmayman.","Haqiqiy kuch — o'z qarorlaring uchun javob bera olishdir.","Mag'lubiyatdan qo'rqadigan inson hech qachon buyuk ish qilolmaydi.","Men mag'lubiyatni rejamning bir qismi sifatida ham qabul qilmayman."],
win:["Checkmate. Bu jang boshidanoq mening nazoratimda edi.","Shaxmat! O'yin tugadi.","Bu natija tasodif emas edi.","Sen yaxshi kurashding. Ammo men yaxshiroq reja tuzgan edim."],
lose:["Qiziqarli... Bu safar sen g'alaba qozonding.","Mag'lubiyat — faqat keyingi rejaning boshlanishi.","Demak, bu safar tarozi sening tomoningga og'di."],
draw:["Durang... Bu hali tugamadi.","Hech kim yutmadi. Hozircha."],
resign:["Taslim bo'lding. Aqlli qaror... yoki qo'rquv?","Qirol yolg'iz yuradi. Sen esa yiqilding."],
undo:["Vaqtni ortga qaytarasanmi? Baribir natija o'zgarmaydi.","Xatoni tuzatish imkoni — g'ayrioddiy sovg'a."],
think:["Hisoblayapman...","Sening yurishlaring hisobga olindi.","Bir necha qadam oldinga qarayapman."]};
const M={open:"Mag'rur",blunder:"Mag'rur",mistake:"Mag'rur",good:"Xotirjam",brill:"Hayratda",check:"Shiddatli",pcheck:"G'azablangan",capture:"Mag'rur",idle:"Xotirjam",win:"Mag'rur",lose:"Mag'lub",draw:"Xotirjam",resign:"Mag'rur",undo:"Xotirjam",think:"O'ylamoqda"};
const C={Mag:"smug",Xot:"calm",Hay:"awe",Shi:"rage",G:"rage",O:"think",Mag2:"calm"};
const rec=[];
function pick(k){const a=P[k]||[];let c=a.filter(x=>!rec.includes(x));if(!c.length)c=a;const s=c[Math.random()*c.length|0];rec.push(s);if(rec.length>14)rec.shift();return s;}
const mood=k=>{const m=M[k]||"Xotirjam";return{label:m,cls:({"Mag'rur":"smug","Xotirjam":"calm","Hayratda":"awe","Shiddatli":"rage","G'azablangan":"rage","O'ylamoqda":"think","Mag'lub":"calm"})[m]};};
return{pick,mood,P};})();
