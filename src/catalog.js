// Curated catalogue of *inspired* demo looks, not manufacturer ICC/DCP/LUT profiles.
// Official model/profile names are included for reference; image rendering is CSS-only.
// Schema is intentionally provider-independent for future verified color profiles.
export const LOOKS = Object.freeze({
 natural:     {brightness:2, contrast:-4,saturation:-6,warmth:0,hue:0,fade:3,mono:0},
 portrait:    {brightness:3, contrast:-8,saturation:-9,warmth:9,hue:0,fade:8,mono:0},
 landscape:   {brightness:2, contrast:11,saturation:16,warmth:0,hue:0,fade:0,mono:0},
 nordic:      {brightness:4, contrast:-9,saturation:-24,warmth:-12,hue:3,fade:7,mono:0},
 golden:      {brightness:3, contrast:-2,saturation:3,warmth:25,hue:-2,fade:7,mono:0},
 editorial:   {brightness:0,contrast:8,saturation:-17,warmth:2,hue:0,fade:7,mono:0},
 vivid:       {brightness:2,contrast:13,saturation:29,warmth:1,hue:0,fade:0,mono:0},
 neutral:     {brightness:0,contrast:-9,saturation:-13,warmth:0,hue:0,fade:0,mono:0},
 film:        {brightness:2,contrast:-4,saturation:-22,warmth:9,hue:-2,fade:12,mono:0},
 chrome:      {brightness:-1,contrast:12,saturation:-27,warmth:-5,hue:2,fade:3,mono:0},
 negative:    {brightness:-2,contrast:12,saturation:-11,warmth:11,hue:3,fade:9,mono:0},
 cinema:      {brightness:-3,contrast:8,saturation:-31,warmth:-7,hue:1,fade:10,mono:0},
 bleached:    {brightness:-4,contrast:21,saturation:-40,warmth:-8,hue:0,fade:0,mono:0},
 retro:       {brightness:1,contrast:8,saturation:-12,warmth:27,hue:-4,fade:12,mono:0},
 mono:        {brightness:2,contrast:9,saturation:0,warmth:0,hue:0,fade:1,mono:100},
 softmono:    {brightness:4,contrast:-10,saturation:0,warmth:0,hue:0,fade:15,mono:100},
 hardmono:    {brightness:-5,contrast:30,saturation:0,warmth:0,hue:0,fade:0,mono:100},
 teal:        {brightness:-2,contrast:16,saturation:6,warmth:-18,hue:9,fade:2,mono:0},
 powder:      {brightness:4,contrast:-9,saturation:-7,warmth:-23,hue:7,fade:8,mono:0},
 forest:      {brightness:-1,contrast:8,saturation:4,warmth:-9,hue:12,fade:3,mono:0},
 faded:       {brightness:7,contrast:-19,saturation:-19,warmth:6,hue:0,fade:23,mono:0},
 slide:       {brightness:2,contrast:18,saturation:35,warmth:2,hue:-1,fade:0,mono:0},
 sunset:      {brightness:-1,contrast:13,saturation:13,warmth:30,hue:-6,fade:4,mono:0}
});
const C=[
 {brand:'Hasselblad',family:'Średni format / cyfrowe',url:'https://master.hasselblad.com/learn/hasselblad-natural-colour-solution/',items:[
 ['hass-natural','Natural Color / HNCS inspired','Naturalne odcienie skóry i subtelne światła','natural','landscape'],
 ['hass-portrait','Portrait Study','Łagodne przejścia barw i naturalna cera','portrait','portrait'],
 ['hass-landscape','Landscape Study','Pojemne światła i oszczędne podbicie kolorów','landscape','landscape'],
 ['hass-nordic','Nordic Light','Chłodne półtony i spokojna zieleń','nordic','landscape'],
 ['hass-golden','Golden Light','Naturalna, ciepła tonacja popołudnia','golden','film'],
 ['hass-editorial','Editorial Neutral','Stonowana fotografia modowa i produktowa','editorial','portrait']
 ]},
 {brand:'Leica',family:'Cyfrowe / Leica Looks',url:'https://leica-camera.com/en-int/photography/leica-looks',items:[
 ['leica-classic','Leica Classic','Analogowy charakter i kontrast scen ulicznych','chrome','street'],
 ['leica-contemporary','Leica Contemporary','Nowoczesne, klarowne barwy','natural','street'],
 ['leica-bleach','Leica Bleach','Chłodne przygaszenie i większy kontrast','bleached','street'],
 ['leica-chrome','Leica Chrome','Selektywna, stonowana kolorystyka','chrome','street'],
 ['leica-sepia','Leica Sepia','Klasyczny ciepły monochrom','retro','film'],
 ['leica-selenium','Leica Selenium','Zimny, subtelny monochrom','softmono','street'],
 ['leica-mono','Leica Monochrom','Kontrastowa interpretacja czerni i bieli','hardmono','street'],
 ['leica-m9','M9 CCD Study','Autorska interpretacja charakteru barw CCD','negative','street']
 ]},
 {brand:'Fujifilm',family:'Film Simulation',url:'https://www.fujifilm-x.com/global/products/film-simulation/',items:[
 ['fuji-provia','PROVIA / STANDARD','Naturalna wszechstronność i pełny kolor','natural','landscape'],
 ['fuji-velvia','VELVIA / VIVID','Nasycone niebo i zieleń krajobrazu','slide','landscape'],
 ['fuji-astia','ASTIA / SOFT','Subtelny portret i delikatne odcienie','portrait','portrait'],
 ['fuji-chrome','CLASSIC CHROME','Stonowany dokumentalny charakter','chrome','street'],
 ['fuji-classic-neg','CLASSIC Neg.','Kontrastowe akcenty w estetyce negatywu','negative','street'],
 ['fuji-nostalgic','NOSTALGIC Neg.','Ciepłe światła i klimat fotografii filmowej','golden','film'],
 ['fuji-reala','REALA ACE','Realistyczne barwy i klarowna tonalność','natural','landscape'],
 ['fuji-proneg','PRO Neg. Std','Spokojny, kontrolowany portret','portrait','portrait'],
 ['fuji-eterna','ETERNA / CINEMA','Miękki kontrast i filmowe półtony','cinema','street'],
 ['fuji-bleach','ETERNA BLEACH BYPASS','Niskie nasycenie i wyraziste cienie','bleached','street'],
 ['fuji-acros','ACROS','Drobnoziarnisty wygląd monochromatyczny','mono','street']
 ]},
 {brand:'Nikon',family:'Picture Control',url:'https://onlinemanual.nikonimglib.com/zf/en/picture_controls_guid-a25e1e42-5373-bd1b-2b29-a1193384268a_30.html',items:[
 ['nikon-standard','Standard','Zrównoważona kolorystyka Nikon','natural','landscape'],
 ['nikon-neutral','Neutral','Mniej kontrastu, baza do edycji','neutral','portrait'],
 ['nikon-vivid','Vivid','Żywe nasycenie i krajobraz','vivid','landscape'],
 ['nikon-portrait','Portrait','Miękkie oddanie skóry','portrait','portrait'],
 ['nikon-rich-portrait','Rich Tone Portrait','Portret o bogatszej tonalności','golden','portrait'],
 ['nikon-landscape','Landscape','Wyraziste krajobrazy i budynki','landscape','landscape'],
 ['nikon-flat','Flat','Niewielki kontrast dla dalszej edycji','neutral','landscape'],
 ['nikon-deep-mono','Deep Tone Monochrome','Głębsze półtony i cienie','hardmono','street'],
 ['nikon-flat-mono','Flat Monochrome','Miękka tonalność czarno-biała','softmono','street']
 ]},
 {brand:'Canon',family:'Picture Style',url:'https://cam.start.canon/en/C015/manual/c015.pdf',items:[
 ['canon-standard','Standard','Uniwersalny wygląd EOS','natural','landscape'],
 ['canon-portrait','Portrait','Delikatniejsza tonacja skóry','portrait','portrait'],
 ['canon-landscape','Landscape','Wzmocniony kolor natury','vivid','landscape'],
 ['canon-detail','Fine Detail','Klarowny detal i wyraźne mikrostruktury','landscape','street'],
 ['canon-neutral','Neutral','Płaska baza do późniejszej edycji','neutral','street'],
 ['canon-faithful','Faithful','Stonowany, realistyczny punkt wyjścia','natural','portrait'],
 ['canon-mono','Monochrome','Klasyczny monochrom EOS','mono','street']
 ]},
 {brand:'Sony',family:'Creative Look',url:'https://www.sony.pl/interchangeable-lens-cameras/creativelook',items:[
 ['sony-st','ST / Standard','Podstawowy uniwersalny wygląd','natural','landscape'],
 ['sony-pt','PT / Portrait','Spokojniejsze tony skóry','portrait','portrait'],
 ['sony-nt','NT / Neutral','Neutralna baza do postprodukcji','neutral','landscape'],
 ['sony-vv','VV / Vivid','Szybkie nasycenie i kontrast','vivid','landscape'],
 ['sony-vv2','VV2 / Vivid 2','Mocniejsze, energetyczne barwy','slide','landscape'],
 ['sony-fl','FL / Film','Filmowa miękkość i przygaszenie','film','street'],
 ['sony-in','IN / Instant','Lekki nostalgiczny charakter','retro','film'],
 ['sony-sh','SH / Soft Highkey','Jasny, łagodny efekt','faded','portrait'],
 ['sony-bw','BW / Black & White','Monochrom o naturalnej tonalności','mono','street']
 ]},
 {brand:'Panasonic LUMIX',family:'Photo Style',url:'https://www.panasonic.com/global/consumer/lumix/lumix-color.html',items:[
 ['lumix-standard','Standard','Zrównoważony LUMIX','natural','landscape'],
 ['lumix-vivid','Vivid','Kolorowy krajobraz','vivid','landscape'],
 ['lumix-natural','Natural','Spokojna prezentacja barw','neutral','portrait'],
 ['lumix-classic','L.ClassicNeo','Nostalgiczny ton i delikatny kontrast','film','street'],
 ['lumix-lmono','L.Monochrome','Wyraziste tony czerni i bieli','mono','street'],
 ['lumix-lmonod','L.Monochrome D','Ciemniejsze, mocniejsze monochromaty','hardmono','street'],
 ['lumix-leicamono','LEICA Monochrome','Kontrastowe cienie i mocne światła','hardmono','street']
 ]},
 {brand:'OM SYSTEM / Olympus',family:'Picture Mode / Art Filter',url:'https://explore.omsystem.com/',items:[
 ['om-natural','Natural','Neutralny charakter aparatów OM','natural','landscape'],
 ['om-vivid','Vivid','Dynamiczne niebo, flora i fauna','vivid','landscape'],
 ['om-muted','Muted','Kontrolowana saturacja i delikatne barwy','faded','portrait'],
 ['om-portrait','Portrait','Miękkie portrety','portrait','portrait'],
 ['om-mono','Monotone','Spokojny monochrom','mono','street'],
 ['om-dramatic','Dramatic Tone inspired','Wyraziste światła i głębokie cienie','hardmono','street']
 ]},
 {brand:'Ricoh GR',family:'Image Control',url:'https://www.ricoh-imaging.co.jp/english/products/gr-3/spec/index.html',items:[
 ['ricoh-positive','Positive Film','Wyrazisty slajdowy charakter','slide','street'],
 ['ricoh-negative','Negative Film','Klasyczny kontrastowy negatyw','negative','street'],
 ['ricoh-retro','Retro','Ciepłe przygaszone barwy','retro','film'],
 ['ricoh-bleach','Bleach Bypass','Stalowy kontrast i niskie nasycenie','bleached','street'],
 ['ricoh-mono','Hard Monotone','Twarde krawędzie i głęboka czerń','hardmono','street'],
 ['ricoh-soft','Soft Monotone','Miękki monochrom','softmono','portrait'],
 ['ricoh-cinema','Cinema inspired','Filmowy klimat GR','cinema','street']
 ]},
 {brand:'PENTAX',family:'Custom Image',url:'https://www.ricoh-imaging.co.jp/english/support/qa/kp/index.html',items:[
 ['pentax-natural','Natural','Naturalne barwy PENTAX','natural','landscape'],
 ['pentax-radiant','Radiant','Wyraziste barwy i ciepły kontrast','golden','landscape'],
 ['pentax-vibrant','Vibrant','Silniejsze nasycenie','vivid','landscape'],
 ['pentax-muted','Muted','Mniejsza saturacja i delikatność','faded','portrait'],
 ['pentax-reversal','Reversal Film','Slajdowa paleta kolorów','slide','landscape'],
 ['pentax-bleach','Bleach Bypass','Analogowy, odbarwiony kontrast','bleached','street']
 ]},
 {brand:'SIGMA',family:'Color Modes',url:'https://www.sigma-global.com/en/shooting-with-sigma/sigma_color_mode_library/',items:[
 ['sigma-teal','Teal and Orange','Kontrast chłodu i ciepłych tonów','teal','street'],
 ['sigma-gold','Warm Gold','Ciepłe stonowane półtony','golden','film'],
 ['sigma-powder','Powder Blue','Chłodne, miękkie błękity','powder','landscape'],
 ['sigma-forest','Forest Green','Zielenie i głębokie cienie','forest','landscape'],
 ['sigma-fovblue','FOV Classic Blue','Autorska interpretacja klasycznych błękitów Foveon','chrome','landscape'],
 ['sigma-cinema','Cinema','Przygaszona atmosfera filmowa','cinema','street'],
 ['sigma-mono','Monochrome','Kontrastowy czarno-biały obraz','mono','street']
 ]},
 {brand:'Phase One',family:'Medium Format Study (autorski)',url:'https://www.phaseone.com/',items:[
 ['phase-natural','IQ Natural Study','Neutralny, kontrolowany kolor średniego formatu','natural','landscape'],
 ['phase-portrait','IQ Portrait Study','Miękkie przejścia w odcieniach skóry','portrait','portrait'],
 ['phase-editorial','Editorial Study','Spokojna paleta fotografii komercyjnej','editorial','portrait']
 ]},
 {brand:'Kodak',family:'Film stock inspired',url:'https://www.kodak.com/',items:[
 ['kodak-portra','Portra 400','Ciepłe naturalne odcienie skóry','portrait','portrait'],
 ['kodak-portra160','Portra 160','Stonowany klasyczny negatyw','faded','portrait'],
 ['kodak-gold','Gold 200','Nostalgiczne ciepłe słońce','golden','film'],
 ['kodak-ektar','Ektar 100','Energetyczne kolory o wysokim nasyceniu','slide','landscape'],
 ['kodak-e100','Ektachrome E100','Przejrzysty slajdowy charakter','vivid','landscape'],
 ['kodak-trix','Tri-X 400','Kontrastowy analogowy monochrom','hardmono','street']
 ]},
 {brand:'Ilford',family:'B&W film inspired',url:'https://www.ilfordphoto.com/',items:[
 ['ilford-hp5','HP5 Plus','Reportażowy monochrom','mono','street'],
 ['ilford-delta','Delta 100','Drobnoziarnista miękka gradacja','softmono','portrait'],
 ['ilford-pan','PAN F Plus','Wysoki kontrast i gładkie światła','hardmono','street']
 ]},
 {brand:'Polaroid',family:'Instant film inspired',url:'https://www.polaroid.com/',items:[
 ['polaroid-now','Color Instant Study','Przygaszone, ciepłe barwy natychmiastowe','retro','film'],
 ['polaroid-faded','Faded Instant','Wyblakła i miękka paleta','faded','portrait']
 ]},
 {brand:'DJI',family:'Camera looks (autorski)',url:'https://www.dji.com/',items:[
 ['dji-standard','Natural Study','Czytelny cyfrowy krajobraz','natural','landscape'],
 ['dji-cinema','Cinematic Study','Przygaszona filmowa kolorystyka','cinema','street']
 ]},
 {brand:'GoPro',family:'Camera looks (autorski)',url:'https://gopro.com/',items:[
 ['gopro-natural','Natural Study','Umiarkowany kontrast i nasycenie','natural','landscape'],
 ['gopro-vivid','Vibrant Study','Pełne kolory fotografii podróżniczej','vivid','landscape']
 ]}
];
export const BRAND_INFO = C.map(({brand,family,url,items})=>({brand,family,url,count:items.length}));
export const BUILTIN_STYLES = C.flatMap(({brand,family,url,items})=>items.map(([id,title,note,look,image])=>({
  id,brand,title,note,image,tone:{...LOOKS[look]},type:'Inspiracja · CSS',family,source:url,look,verified:false
})));
export const TONE_FIELDS = [
 {key:'brightness',label:'Jasność',min:-40,max:40},
 {key:'contrast',label:'Kontrast',min:-50,max:50},
 {key:'saturation',label:'Nasycenie',min:-70,max:70},
 {key:'warmth',label:'Temperatura barwna*',min:-40,max:40},
 {key:'hue',label:'Przesunięcie odcienia',min:-35,max:35},
 {key:'fade',label:'Matowość / Fade',min:0,max:45},
 {key:'mono',label:'Monochrom',min:0,max:100}
];
export const DEFAULT_TONE = Object.freeze({brightness:0,contrast:0,saturation:0,warmth:0,hue:0,fade:0,mono:0});
export function normalizeTone(input={}) {
 const o={};
 for(const f of TONE_FIELDS) {
   const v=Number(input?.[f.key]);
   o[f.key]=Number.isFinite(v)?Math.max(f.min,Math.min(f.max,Math.round(v))):DEFAULT_TONE[f.key];
 }
 return o;
}
export function cssFilter(tone={}) {
 const t=normalizeTone(tone);
 const contrast=Math.max(.35,(100+t.contrast-t.fade*.36)/100);
 const saturation=Math.max(.1,(100+t.saturation)/100);
 const brightness=Math.max(.45,(100+t.brightness+t.fade*.16)/100);
 // "warmth" is a *visual approximation*, not physical white balance in Kelvin.
 const warmSepia=Math.max(0,t.warmth)*.008;
 const coolShift=Math.min(0,t.warmth)*.26;
 return 'brightness('+brightness.toFixed(3)+') contrast('+contrast.toFixed(3)+') saturate('+saturation.toFixed(3)+') sepia('+warmSepia.toFixed(3)+') hue-rotate('+(t.hue+coolShift).toFixed(1)+'deg) grayscale('+(t.mono/100).toFixed(2)+')';
}
export function percentageFromPointer(clientX,left,width) {
 if(!Number.isFinite(width)||width<=0)return 50;
 return Math.max(0,Math.min(100,Math.round(((clientX-left)/width)*100)));
}
export function comparisonClip(mode='split',split=50) {
 if(mode==='a')return 'inset(0 100% 0 0)';
 if(mode==='b')return 'inset(0 0 0 0)';
 return 'inset(0 0 0 '+Math.max(0,Math.min(100,Number(split)||0))+'%)';
}
export function validateSavedProfiles(items) {
 if(!Array.isArray(items))return [];
 const unique=new Set(BUILTIN_STYLES.map(x=>x.id));
 return items.slice(0,100).flatMap(x=>{
   if(!x||typeof x!=='object'||typeof x.id!=='string'||!/^user-[a-z0-9-]{6,64}$/.test(x.id)||unique.has(x.id))return [];
   if(typeof x.title!=='string'||!x.title.trim())return [];
   unique.add(x.id);
   const base=BUILTIN_STYLES.find(s=>s.id===x.baseId);
   return [{
     id:x.id,brand:'Moje profile',title:x.title.trim().slice(0,70),note:typeof x.note==='string'?x.note.slice(0,180):'Autorski wariant',
     image:base?.image||'landscape',baseId:base?.id||null,tone:normalizeTone(x.tone),
     type:'Autorski · lokalnie',source:'',verified:false,created:typeof x.created==='string'?x.created:''
   }];
 });
}
