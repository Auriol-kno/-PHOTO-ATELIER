import {listAssets,importFiles,deleteAsset,readableSize,catalogueBackup,restoreCatalogue} from './storage.js';
import {BUILTIN_STYLES, BRAND_INFO, TONE_FIELDS, normalizeTone, cssFilter, percentageFromPointer, comparisonClip, validateSavedProfiles} from './catalog.js';

const S={
 page:localStorage.getItem('pa-page')||'home',theme:localStorage.getItem('pa-theme')||'dark',
 brand:'Wszystkie',fileFilter:'Wszystkie',assets:[],imageUrls:new Map(),photoId:null,
 left:'hass-natural',right:'leica-classic',split:50,compareMode:'split',recipeContrast:0,recipeSaturation:0,
 styleQuery:'',customStyles:[],editId:'hass-natural',editTone:null,editName:'',editBack:'styles',
 done:JSON.parse(localStorage.getItem('pa-done')||'[]'),
 missions:JSON.parse(localStorage.getItem('pa-missions')||'[]')
};
const IMAGES={
 landscape:'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=850&q=80',
 portrait:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=850&q=80',
 street:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=850&q=80',
 film:'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=850&q=80'
};
const STYLES=BUILTIN_STYLES;
const OWN_KEY='pa-custom-profiles-v1';
function loadCustomStyles(){
  try {return validateSavedProfiles(JSON.parse(localStorage.getItem(OWN_KEY)||'[]'));}
  catch {return [];}
}
S.customStyles=loadCustomStyles();
function allStyles(){return [...STYLES,...S.customStyles];}
function persistCustomStyles(){localStorage.setItem(OWN_KEY,JSON.stringify(S.customStyles));}
function openEditor(id){
  const current=style(id);
  S.editId=current.id;
  S.editTone=normalizeTone(current.tone);
  S.editName=current.brand==='Moje profile'?current.title:current.title+' — mój';
  S.editBack=S.page;
  navTo('editor');
}
function buildCustomProfile(){
  const base=style(S.editId);
  const name=String(S.editName||'').trim().slice(0,70);
  if(!name)return null;
  const rawId=typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
  return {id:'user-'+rawId,brand:'Moje profile',title:name,
    note:'Własna interpretacja · baza: '+base.brand+' / '+base.title,
    image:base.image,baseId:base.baseId||base.id,
    tone:normalizeTone(S.editTone),type:'Autorski · lokalnie',source:'',verified:false,created:new Date().toISOString()};
}
const LESSONS=[
 ['Światło i ekspozycja','Ten sam kadr o trzech porach dnia'],
 ['Kompozycja i perspektywa','Pięć interpretacji jednej lokalizacji'],
 ['Balans bieli','AWB, 5200 K i szara karta'],
 ['Natural Color','Zieleń, niebo i skóra bez przesycenia'],
 ['Fotografia uliczna','Geometria, światło i chwila'],
 ['Charakter filmu','Portra, Classic Chrome i Velvia'],
 ['Lightroom Classic','Krzywe, HSL i preset XMP'],
 ['Autorska seria','10 spójnych kadrów i własna receptura']
];
const MISSIONS=[
 ['Jeden kolor','Zbuduj kadr z jedną dominującą barwą'],
 ['Miękkie światło','Wykorzystaj okno lub zachmurzenie'],
 ['Leica Street','Złap scenę miejską z wyrazistą geometrią'],
 ['Hasselblad Natural','Sfotografuj skórę, zieleń i neutralną biel'],
 ['Nikon Zf — 35 mm','Jedno ogniskowanie, dziesięć świadomych kadrów'],
 ['Fotografia o świcie','Opowiedz historię w trzech ujęciach']
];
const MODS=[
 ['files','Pliki i chmura','▤','Źródła, podglądy i backup'],
 ['lightroom','Lightroom Studio','◫','Receptury do edycji'],
 ['nikon','Nikon Studio','◎','Picture Control Nikon Zf'],
 ['color','Color Science','◈','Analiza tonu i barwy'],
 ['missions','Photo Missions','◇','Zadania fotograficzne'],
 ['mentor','AI Photo Mentor','✧','Przyszła analiza zdjęć'],
 ['portfolio','Portfolio','▧','Twoje fotograficzne serie'],
 ['references','Reference Library','▥','Historia i źródła'],
 ['settings','Ustawienia','⚙','Prywatność i wygląd']
];
const NAV=[['home','Start','⌂'],['styles','Style','◉'],['compare','Compare','◫'],['academy','Nauka','✦'],['more','Więcej','☷']];
const root=document.getElementById('app'),tabs=document.getElementById('tabs');
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function style(id){return allStyles().find(s=>s.id===id)||STYLES[0];}
function navTo(page){S.page=page;localStorage.setItem('pa-page',page);draw();root.scrollTop=0;}
function title(k,t,d){return '<div class="eyebrow">'+k+'</div><h1>'+t+'</h1><p class="sub">'+d+'</p>';}
function btn(label,action,secondary){return '<button class="btn '+(secondary?'secondary':'')+'" data-act="'+action+'">'+label+'</button>';}
function styleTile(s){
 return '<div class="style-card"><button class="style-picture" data-act="choose-style" data-id="'+esc(s.id)+'" aria-label="Porównaj '+esc(s.brand+' '+s.title)+'">'+
 '<span class="style-art" style="background-image:linear-gradient(0deg,#18231d44,#18231d22),url('+IMAGES[s.image]+');filter:'+cssFilter(s.tone)+'"></span></button>'+
 '<span class="style-info"><b>'+esc(s.brand+' · '+s.title)+'</b><small>'+esc(s.note)+'</small>'+
 '<span class="style-meta">'+esc(s.brand==='Moje profile'?'Mój profil':'Inspired · preview')+'</span></span>'+
 '<div class="style-actions"><button data-act="choose-style" data-id="'+esc(s.id)+'">Porównaj ↗</button><button data-act="edit-style" data-id="'+esc(s.id)+'">Dostosuj ✎</button></div></div>';
}
function card(k,v){return '<div class="stat"><strong>'+k+'</strong><small>'+v+'</small></div>';}
function notice(t){return '<div class="notice">'+t+'</div>';}
function home(){
 const count=S.assets.length,preview=S.assets.filter(a=>a.preview).length;
 return title('YOUR CREATIVE DARKROOM','Make every frame matter.','Świadoma fotografia, profesjonalna kolorystyka i Twoje materiały w jednym miejscu.')+
 '<div class="hero"><span class="eyebrow">NOWA KOLEKCJA</span><b>Hasselblad<br>Natural Color</b><p>Odkryj charakter barw i porównuj własne zdjęcia w różnych estetykach.</p><div style="margin-top:16px">'+btn('Odkrywaj style','styles')+'</div></div>'+
 '<div class="stat-row">'+card(String(count),'Materiałów')+card(String(preview),'Podglądów')+card(String(S.done.length)+'/8','Lekcji')+'</div>'+
 '<div class="section-title"><h2>Twoje studio</h2><button class="link" data-act="more">Wszystkie moduły →</button></div>'+
 '<div class="tiles"><button class="tile" data-act="files"><span class="glyph">▤</span><b>Pliki i chmura</b><small>Dodaj zdjęcia, RAW-y i presety</small></button><button class="tile" data-act="compare"><span class="glyph">◫</span><b>Compare Lab</b><small>Porównanie A/B na własnym zdjęciu</small></button><button class="tile" data-act="academy"><span class="glyph">✦</span><b>Photo Academy</b><small>Nauka fotograficznego warsztatu</small></button><button class="tile" data-act="lightroom"><span class="glyph">☷</span><b>Lightroom Studio</b><small>Receptury i parametry kolorów</small></button></div>'+
 '<div class="section-title"><h2>Wybrane style</h2><button class="link" data-act="styles">Zobacz całość →</button></div><div class="tiles">'+STYLES.slice(0,2).map(styleTile).join('')+'</div>'+
 notice('Tryb local-first: PHOTO ATELIER nie wysyła Twoich zdjęć na serwer. Ten prototyp zapisuje wyłącznie małe podglądy i metadane na urządzeniu.');
}
function styleResults(){
 const q=S.styleQuery.trim().toLocaleLowerCase('pl');
 const matching=allStyles().filter(s=>(S.brand==='Wszystkie'||s.brand===S.brand)&&(!q||[s.brand,s.title,s.note,s.family].join(' ').toLocaleLowerCase('pl').includes(q)));
 return '<div class="row" style="margin-bottom:12px"><span class="tag">'+matching.length+' profili</span><span class="tiny">Podgląd demonstracyjny · CSS</span></div>'+
 (matching.length?'<div class="tiles">'+matching.map(styleTile).join('')+'</div>':'<div class="drop"><b>Nie znaleziono profilu</b><small>Zmień markę lub wpisz inne słowo.</small></div>');
}
function stylesPage(){
 const brands=['Wszystkie','Moje profile',...BRAND_INFO.map(x=>x.brand)];
 return title('STYLE LIBRARY','The color signatures.','Rozszerzona kolekcja '+STYLES.length+' inspiracji z '+BRAND_INFO.length+' marek i systemów. Twórz własne warianty bez zmiany oryginału.')+
 '<div class="stat-row">'+card(String(STYLES.length),'Inspiracji')+card(String(BRAND_INFO.length),'Marek')+card(String(S.customStyles.length),'Moich profili')+'</div>'+
 '<div class="field" style="margin-top:17px"><label for="style-search">Szukaj po marce, nazwie i charakterze koloru</label><input class="text-input" id="style-search" type="search" placeholder="Np. Leica, Portret, Monochrom..." value="'+esc(S.styleQuery)+'"></div>'+
 '<div class="pills brands-scroll">'+brands.map(b=>'<button class="pill '+(b===S.brand?'active':'')+'" data-act="brand" data-value="'+esc(b)+'">'+esc(b)+'</button>').join('')+'</div>'+
 '<div id="style-results">'+styleResults()+'</div>'+
 '<div class="btnrow" style="margin-top:18px">'+btn('Eksportuj moje profile JSON','export-profiles',true)+btn('Importuj moje profile','import-profiles',true)+'</div>'+
 notice('Nazwy profili pochodzą z rodzin kolorystycznych producentów, lecz efekty zdjęć to autorskie wizualizacje CSS. Nie są to oficjalne presety, profile ICC/DCP ani skalibrowane kopie barw.');
}
function coverAsset(a) {
 const src=S.imageUrls.get(a.id);
 return src?'<img src="'+src+'" alt="Podgląd '+esc(a.name)+'">':'<div class="thumb">'+(a.kind==='RAW'?'RAW':a.kind==='Preset'?'XMP':'▤')+'</div>';
}
function assetRow(a,action){
 return '<div class="entry">'+coverAsset(a)+'<div class="info"><b>'+esc(a.name)+'</b><small>'+esc(a.kind)+' · '+readableSize(a.size)+'<br>Oryginał poza aplikacją</small></div>'+
 (action?'<button class="action" data-act="use-photo" data-id="'+esc(a.id)+'">Otwórz</button>':'<button class="action" data-act="delete-file" data-id="'+esc(a.id)+'" aria-label="Usuń wpis '+esc(a.name)+'">Usuń</button>')+'</div>';
}
function filesPage(){
 const images=S.assets.filter(a=>a.preview);
 const filterNames=['Wszystkie','Zdjęcie','RAW','Preset','Materiał'];
 const filtered=S.assets.filter(a=>S.fileFilter==='Wszystkie'||S.fileFilter===a.kind);
 return title('ASSET WORKSPACE','Twoje pliki. Twoje zasady.','Kataloguj materiały z urządzenia, aplikacji Pliki i źródeł chmurowych.')+
 '<div class="drop"><b>＋ Dodaj zdjęcia lub materiały</b><small>JPG · PNG · WebP · RAW/NEF · XMP · NP3 · PDF<br>Możesz wybrać iCloud Drive lub inne źródło w selektorze plików.</small><div style="margin-top:14px">'+btn('Wybierz pliki','import')+'</div></div>'+
 '<div class="section-title"><h2>Stan katalogu</h2></div><div class="stat-row">'+card(String(S.assets.length),'Wpisów')+card(String(images.length),'Podglądów')+card('0','W chmurze app')+'</div>'+
 '<div class="section-title"><h2>Materiały</h2><button class="link" data-act="backup">Eksport indeksu ↓</button></div>'+
 '<div class="pills">'+filterNames.map(f=>'<button class="pill '+(f===S.fileFilter?'active':'')+'" data-act="file-filter" data-value="'+f+'">'+f+'</button>').join('')+'</div>'+
 '<div class="card pad">'+(filtered.length?filtered.map(a=>assetRow(a,false)).join(''):'<p class="small muted">Brak materiałów w tym widoku. Dodaj zdjęcie, aby zacząć.</p>')+'</div>'+
 '<div class="section-title"><h2>Połączenia</h2></div><div class="card pad">'+
 '<div class="setting"><div class="row"><b>Na tym urządzeniu</b><span class="badge">Aktywny katalog</span></div><p>Metadane i małe podglądy zapisujemy w IndexedDB. Przeglądarka może je usunąć — eksportuj kopie indeksu.</p></div>'+
 '<div class="setting"><div class="row"><b>iCloud Drive / Pliki</b><span class="badge">Import ręczny</span></div><p>Systemowy selektor otwiera pliki z dostępnych dostawców. Nie oznacza to stałej synchronizacji folderu.</p><button class="link" data-act="import">Otwórz Pliki →</button></div>'+
 '<div class="setting"><div class="row"><b>Supabase Cloud</b><span class="badge">Nie połączono</span></div><p>Przygotowano projekt prywatnej synchronizacji. Konto i przesyłanie zdjęć nie są jeszcze aktywne.</p></div>'+
 '<div class="setting"><div class="row"><b>Komputer / NAS</b><span class="badge">Planowane</span></div><p>Stały indeks folderów na Windows wymaga aplikacji towarzyszącej, nie zwykłej strony na iPhone.</p></div></div>'+
 '<div class="btnrow" style="margin-top:15px">'+btn('Eksport katalogu','backup',true)+btn('Import indeksu','restore',true)+'</div>'+
 notice('Ważne: import RAW zapisuje obecnie tylko wpis w katalogu; oryginalny NEF nie jest kopiowany ani wywoływany. JPEG/PNG/WebP otrzymują niewielki podgląd, jeśli przeglądarka potrafi go utworzyć.');
}
function chosenPhoto(){return S.imageUrls.get(S.photoId)||IMAGES.landscape;}
function updateSplitUI(){
 const clip=comparisonClip(S.compareMode,S.split);
 document.getElementById('after')?.style.setProperty('clip-path',clip);
 document.getElementById('split-line')?.style.setProperty('left',S.split+'%');
 document.getElementById('split-handle')?.style.setProperty('left',S.split+'%');
 const control=document.getElementById('compare');
 if(control&&S.compareMode==='split')control.setAttribute('aria-valuenow',String(S.split));
 const range=document.getElementById('split-range');
 if(range)range.value=String(S.split);
}
function compare(){
 const a=style(S.left),b=style(S.right),mode=S.compareMode;
 const photoOptions=S.assets.filter(x=>S.imageUrls.has(x.id));
 const select=(selected,selector)=>'<select class="select" data-select="'+selector+'" aria-label="Wybierz profil '+selector+'">'+allStyles().map(s=>'<option value="'+esc(s.id)+'" '+(s.id===selected?'selected':'')+'>'+esc(s.brand+' · '+s.title)+'</option>').join('')+'</select>';
 const viewControl='<div class="compare-switch" role="group" aria-label="Tryb porównywania">'+
   [['a','◂ A','Pokaż tylko profil A'],['split','◫ A/B','Przesuń linię podziału'],['b','B ▸','Pokaż tylko profil B']].map(([v,label,description])=>
    '<button class="compare-choice '+(v===mode?'active':'')+'" data-act="compare-mode" data-value="'+v+'" aria-label="'+description+'" aria-pressed="'+(v===mode?'true':'false')+'">'+label+'</button>').join('')+'</div>';
 const aria=mode==='split'?'role="slider" aria-label="Porównanie A/B. Przesuń w poziomie palcem lub klawiszami strzałek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+S.split+'" tabindex="0"':'role="img" aria-label="Widok profilu '+(mode==='a'?'A':'B')+'"';
 return title('COMPARE LAB','See the difference.','Przesuwaj palcem bezpośrednio po fotografii albo dotknij A lub B, aby zobaczyć cały kadr jednym stylem.')+
 viewControl+
 '<div class="compare touch-compare" id="compare" '+aria+'>'+
 '<div class="layer" style="background-image:url('+chosenPhoto()+');filter:'+cssFilter(a.tone)+'"></div>'+
 '<div class="layer after" id="after" style="background-image:url('+chosenPhoto()+');filter:'+cssFilter(b.tone)+';clip-path:'+comparisonClip(mode,S.split)+'"></div>'+
 (mode==='split'?'<div class="divider" id="split-line" style="left:'+S.split+'%"></div><div class="handle" id="split-handle" style="left:'+S.split+'%">↔</div>':'')+
 '<span class="toplabel left">'+esc(a.brand+' / '+a.title)+'</span><span class="toplabel right">'+esc(b.brand+' / '+b.title)+'</span></div>'+
 (mode==='split'?'<input id="split-range" class="range" type="range" min="0" max="100" value="'+S.split+'" aria-label="Pozycja linii porównania, od 0 do 100 procent">':'<p class="small muted" style="margin:10px 0">Dotknij ikony ◫ A/B, aby wrócić do przesuwanego porównania.</p>')+
 '<div class="tiles compare-profiles"><div class="field"><label>Profil A</label>'+select(S.left,'left')+'<button class="link" data-act="edit-left">Dostosuj A ✎</button></div>'+
 '<div class="field"><label>Profil B</label>'+select(S.right,'right')+'<button class="link" data-act="edit-right">Dostosuj B ✎</button></div></div>'+
 '<div class="section-title"><h2>Twoje zdjęcie</h2><button class="link" data-act="import">Dodaj nowe ＋</button></div>'+
 '<div class="card pad">'+(photoOptions.length?photoOptions.map(a=>assetRow(a,true)).join(''):'<p class="small muted">Używamy demonstracyjnego kadru. Dodaj własny JPG, PNG lub WebP — obie warstwy użyją dokładnie tego samego pliku.</p>')+'</div>'+
 notice('Efekty są demonstracyjne (CSS), nie odtwarzają kalibracji aparatu ani profesjonalnego silnika RAW/ICC. Własne profile zapisujemy tylko na urządzeniu.');
}
function editor(){
 const src=style(S.editId);
 const tone=S.editTone||normalizeTone(src.tone);
 const fields=TONE_FIELDS.map(f=>'<div class="editor-field"><div class="row"><label for="tone-'+f.key+'">'+esc(f.label)+'</label><output id="value-'+f.key+'">'+tone[f.key]+'</output></div>'+
  '<input class="range" id="tone-'+f.key+'" data-tone="'+f.key+'" type="range" min="'+f.min+'" max="'+f.max+'" step="1" value="'+tone[f.key]+'"></div>').join('');
 return title('COLOR EDITOR','Make it yours.','Edytuj wygląd i zapisz nową wersję jako własny profil. Oryginalny wzorzec pozostaje bez zmian.')+
 '<div class="row"><span class="tag">Baza: '+esc(src.brand+' · '+src.title)+'</span><span class="badge">CSS · Preview</span></div>'+
 '<div class="editor-preview" style="background-image:url('+chosenPhoto()+')"><div id="editor-effect" style="filter:'+cssFilter(tone)+';background-image:url('+chosenPhoto()+')"></div></div>'+
 '<div class="field"><label for="custom-name">Nazwa Twojego profilu</label><input class="text-input" id="custom-name" type="text" maxlength="70" value="'+esc(S.editName)+'" placeholder="Np. Moja Leica Street"></div>'+
 '<div class="card pad"><div class="row"><span class="tag">Parametry</span><button class="link" data-act="reset-tone">Przywróć bazę</button></div>'+fields+'</div>'+
 '<div class="btnrow" style="margin-top:15px">'+btn('Zapisz jako mój profil','save-custom')+btn('Anuluj','editor-cancel',true)+'</div>'+
 (src.brand==='Moje profile'?'<div style="margin-top:12px">'+btn('Usuń tę wersję z biblioteki','delete-custom',true)+'</div>':'')+
 notice('* Temperatura i pozostałe suwaki to uproszczona wizualizacja CSS, a nie kalibracja WB w Kelvinach. Zapisany profil działa w PHOTO ATELIER; eksport XMP/NP3 będzie osobnym etapem.');
}
function academy(){
 return title('PHOTO ACADEMY','Learn to see.','Ośmiotygodniowa ścieżka od ekspozycji do świadomego zarządzania kolorem.')+
 '<div class="stat-row">'+card(S.done.length+'/8','Zrobione')+card('8','Lekcji')+card('Zf','Aparat')+'</div>'+
 '<div class="section-title"><h2>Program nauki</h2></div><div class="stack">'+LESSONS.map((l,i)=>'<button class="lesson" data-act="lesson" data-id="'+i+'"><span class="no">'+(i+1)+'</span><span class="descr"><b>'+esc(l[0])+'</b><small>'+esc(l[1])+'</small></span><span class="badge">'+(S.done.includes(i)?'✓':'Oznacz')+'</span></button>').join('')+'</div>'+
 notice('Zaznaczenia lekcji są zapisywane lokalnie na tym urządzeniu.');
}
function missions(){
 return title('PHOTO MISSIONS','Go out and make it.','Motywacja oparta na praktyce i regularnych sesjach fotograficznych.')+
 '<div class="stat-row">'+card(S.missions.length+'/6','Zadań')+card('6','Wyzwań')+card('Zf','Aparat')+'</div><div class="section-title"><h2>Twoja lista</h2></div>'+
 MISSIONS.map((m,i)=>'<button class="lesson" data-act="mission" data-id="'+i+'"><span class="no">'+(S.missions.includes(i)?'✓':i+1)+'</span><span class="descr"><b>'+esc(m[0])+'</b><small>'+esc(m[1])+'</small></span></button>').join('')+
 notice('Misje można oznaczać jako wykonane. W kolejnych etapach dołączymy fotografie i historię postępów.');
}
function lightroom(){
 return title('LIGHTROOM STUDIO','Build your signature.','Receptury kolorystyczne, które rozwiną się w sprawdzony eksport presetów Lightroom Classic.')+
 '<div class="card pad"><span class="tag">Receptura demonstracyjna</span><h2 style="margin:8px 0 14px">Natural Color Study</h2>'+
 '<div class="field"><label>Kontrast <b id="v-contrast">'+S.recipeContrast+'</b></label><input class="range" id="recipe-contrast" type="range" min="-50" max="50" value="'+S.recipeContrast+'"></div>'+
 '<div class="field"><label>Nasycenie <b id="v-sat">'+S.recipeSaturation+'</b></label><input class="range" id="recipe-sat" type="range" min="-50" max="50" value="'+S.recipeSaturation+'"></div>'+
 btn('Zapisz recepturę JSON','recipe-export')+'</div>'+
 '<div class="section-title"><h2>Plan eksportu</h2></div><div class="card pad"><div class="setting"><b>Lightroom Classic XMP</b><p>Obsługiwany po walidacji właściwości i importu w Lightroom Classic; nie generujemy fałszywych presetów.</p></div><div class="setting"><b>Profile Adobe</b><p>Osobny format i pipeline, nie to samo co preset parametryczny.</p></div><div class="setting"><b>Color Science</b><p>HSL, krzywe RGB, Color Grading i profil wejściowy aparatu.</p></div></div>';
}
function nikon(){
 const labels=['HASS Natural','HASS Portrait','HASS Landscape','HASS Nordic','HASS Golden','HASS Editorial'];
 return title('NIKON STUDIO','A camera with character.','Przepisy Picture Control, workflow Nikon Zf i eksport na kartę SD po testach sprzętowych.')+
 '<div class="card pad"><div class="row"><div><span class="tag">Aparat główny</span><h2 style="margin-top:6px">Nikon Zf</h2></div><span class="badge">Personalizacja</span></div><p class="sub" style="margin-bottom:0">Flexible Color → NX Studio → Picture Control → karta SD</p></div>'+
 '<div class="section-title"><h2>Hasselblad inspired</h2></div><div class="card pad">'+labels.map((l,i)=>'<div class="setting"><div class="row"><b>C-'+(i+1)+' · '+l+'</b><span class="badge">Projekt</span></div><p>Styl autorski do weryfikacji na Nikon Zf.</p></div>').join('')+'</div>'+
 notice('Pliki NP3 nie są generowane w tej wersji. Sam format nie gwarantuje zgodności z aparatem; wymagane są NX Studio i test Nikon Zf.');
}
function color(){
 return title('COLOR SCIENCE','Understand the light.','Warsztat świadomego koloru: tony skóry, naturalna zieleń, błękity i kontrola świateł.')+
 '<div class="card pad"><span class="tag">Przestrzeń barw — ilustracja</span><div class="color-bars" style="margin:16px 0">'+['#b27b70','#d3a278','#d5b77a','#8a9b76','#629b95','#5f7f9c','#76678c','#a97e9b'].map(c=>'<span style="background:'+c+'"></span>').join('')+'</div><p class="small muted">Próbki służą do nauki rozróżniania kolorów; nie są pomiarami ΔE ani wynikami analizy RAW.</p></div>'+
 '<div class="section-title"><h2>Plan laboratorium</h2></div><div class="tiles">'+[['Krzywe RGB','Światła, półtony, cienie'],['ColorChecker','Kontrolowane próbki'],['HSL','Odcień i saturacja'],['Gamut','ICC, DNG i przestrzeń barw']].map(x=>'<div class="tile"><span class="glyph">◈</span><b>'+x[0]+'</b><small>'+x[1]+'</small></div>').join('')+'</div>';
}
function portfolio(){
 const photos=S.assets.filter(a=>S.imageUrls.has(a.id));
 return title('YOUR PORTFOLIO','A body of work.','Własne fotografie, wybrane serie, wersje edycji i świadomy rozwój.')+
 '<div class="stat-row">'+card(String(photos.length),'Podglądów')+card('0','Albumów')+card('Lokalnie','Źródło')+'</div>'+
 '<div class="section-title"><h2>Twoje fotografie</h2><button class="link" data-act="import">Dodaj ＋</button></div>'+
 (photos.length?'<div class="tiles">'+photos.map(a=>'<button class="style-card" data-act="use-photo" data-id="'+esc(a.id)+'"><img style="width:100%;height:170px;object-fit:cover" src="'+S.imageUrls.get(a.id)+'" alt="'+esc(a.name)+'"><span class="style-info"><b>'+esc(a.name)+'</b><small>Otwórz w Compare Lab</small></span></button>').join('')+'</div>':
 '<div class="drop"><b>Twoja galeria zaczyna się od pierwszego kadru</b><small>Wybierz JPG lub PNG. Zapiszemy jego miniaturę, nie oryginał.</small><div style="margin-top:15px">'+btn('Dodaj zdjęcie','import')+'</div></div>');
}
function references(){
 return title('REFERENCE LIBRARY','Study the masters.','Kolekcje '+BRAND_INFO.length+' marek i systemów oraz dokumentacja ich kolorystyki.')+
 BRAND_INFO.map((b,i)=>'<div class="card pad" style="margin-bottom:10px"><span class="tag">COLLECTION '+String(i+1).padStart(2,'0')+'</span>'+
 '<div class="row"><h2 style="margin:7px 0">'+esc(b.brand)+'</h2><span class="badge">'+b.count+' profili</span></div>'+
 '<p class="small muted">'+esc(b.family)+'</p><div class="row" style="margin-top:10px"><button class="link" data-act="brand-link" data-value="'+esc(b.brand)+'">Otwórz kolekcję →</button>'+
 '<a class="ref-link" href="'+b.url+'" target="_blank" rel="noopener noreferrer">Dokumentacja ↗</a></div></div>').join('')+
 notice('Nazwy kolekcji mają źródła producenckie, ale renderingi PHOTO ATELIER to autorskie wizualizacje CSS.');
}
function mentor(){
 return title('AI PHOTO MENTOR','The eye behind the frame.','Analiza kompozycji, światła i koloru z poszanowaniem prywatności Twoich fotografii.')+
 '<div class="card pad"><span class="tag">Moduł planowany</span><h2 style="margin:9px 0">Najpierw prywatność.</h2><p class="sub">AI nie analizuje obecnie żadnych zdjęć. Przed uruchomieniem analizy zostanie przedstawiony zakres danych i wymagane potwierdzenie.</p>'+
 '<div class="badges"><span class="badge">Kompozycja</span><span class="badge">Światło</span><span class="badge">Kolor</span><span class="badge">Technika</span></div></div>'+
 notice('Docelowo preferowana analiza lokalna; opcjonalny serwer tylko za zgodą. Lokalizacja GPS z EXIF powinna być usuwana przed wysyłką.');
}
function settings(){
 return title('PREFERENCJE','Your personal darkroom.','Kontrola wyglądu, danych, prywatności i połączeń.')+
 '<div class="section-title"><h2>Wygląd</h2></div><div class="card pad"><div class="setting"><div class="row"><b>Motyw</b><div class="btnrow"><button class="pill '+(S.theme==='dark'?'active':'')+'" data-act="theme" data-value="dark">Ciemny</button><button class="pill '+(S.theme==='light'?'active':'')+'" data-act="theme" data-value="light">Jasny</button></div></div></div></div>'+
 '<div class="section-title"><h2>Przechowywanie</h2></div><div class="card pad"><div class="setting"><b>Local-first</b><p>Metadane i miniatury pozostają w prywatnej przestrzeni przeglądarki. Nie traktuj jej jako archiwum oryginałów.</p></div><div class="setting"><b>Chmura</b><p>Nie połączono. Żaden RAW ani podgląd nie jest automatycznie przesyłany.</p></div><div class="setting"><b>Backup katalogu</b><p>Eksportuje nazwy, typy, rozmiary i identyfikatory. Nie zawiera zdjęć.</p></div><div class="btnrow" style="margin-top:12px">'+btn('Eksport indeksu','backup',true)+btn('Import indeksu','restore',true)+'</div></div>'+
 '<div class="section-title"><h2>Sprzęt</h2></div><div class="card pad"><div class="setting"><b>Aparat</b><p>Nikon Zf · NEF</p></div><div class="setting"><b>Wywoływarka</b><p>Adobe Lightroom Classic · planowana integracja</p></div></div>';
}
function more(){
 return title('WORKSPACE','All your tools.','Dwanaście modułów profesjonalnego warsztatu fotograficznego oraz osobny katalog plików.')+
 '<div class="tiles">'+[['styles','Style Library','◉','Kolekcje barw'],['compare','Compare Lab','◫','Porównania A/B'],['academy','Photo Academy','✦','Lekcje i rozwój'],...MODS].map(m=>'<button class="tile" data-act="'+m[0]+'"><span class="glyph">'+m[2]+'</span><b>'+m[1]+'</b><small>'+m[3]+'</small></button>').join('')+'</div>';
}
const pages={home,styles:stylesPage,compare,editor,academy,files:filesPage,lightroom,nikon,color,missions,mentor,portfolio,references,settings,more};
function draw(){
 document.body.classList.toggle('light',S.theme==='light');
 root.innerHTML=(pages[S.page]||home)();
 tabs.innerHTML=NAV.map(n=>'<button class="tab '+(S.page===n[0]?'active':'')+'" data-act="'+n[0]+'"><span>'+n[2]+'</span><span>'+n[1]+'</span></button>').join('');
}
let toastTimer;
function toast(message){const n=document.getElementById('notice');n.textContent=message;n.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.style.display='none',3600);}
async function refresh(){
 for(const u of S.imageUrls.values()) URL.revokeObjectURL(u);
 S.imageUrls.clear();
 try{ S.assets=await listAssets();S.assets.sort((a,b)=>String(b.imported).localeCompare(String(a.imported)));
 for(const a of S.assets) if(a.preview instanceof Blob) S.imageUrls.set(a.id,URL.createObjectURL(a.preview));
 }catch(err){console.error(err);toast('Lokalna baza danych jest niedostępna');}
 draw();
}
function downloadJSON(data,name){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function saveProgress(){localStorage.setItem('pa-done',JSON.stringify(S.done));localStorage.setItem('pa-missions',JSON.stringify(S.missions));}
document.addEventListener('click',async e=>{
 const target=e.target.closest('[data-act]'); if(!target)return;
 const a=target.dataset.act,id=target.dataset.id;
 if(a==='import'){document.getElementById('file-input').click();return;}
 if(a==='backup'){downloadJSON(await catalogueBackup(),'PHOTO_ATELIER_katalog.json');toast('Pobrano indeks bez oryginałów');return;}
 if(a==='restore'){document.getElementById('restore-input').click();return;}
 if(a==='delete-file'){if(confirm('Usunąć wpis i miniaturę z katalogu? Oryginał pozostanie bez zmian.')){await deleteAsset(id);if(S.photoId===id)S.photoId=null;await refresh();}return;}
 if(a==='use-photo'){if(!S.imageUrls.has(id)){toast('Brak podglądu — wybierz JPEG/PNG/WebP');return;}S.photoId=id;navTo('compare');return;}
 if(a==='brand'){S.brand=target.dataset.value;draw();return;}
 if(a==='brand-link'){S.brand=target.dataset.value;navTo('styles');return;}
 if(a==='file-filter'){S.fileFilter=target.dataset.value;draw();return;}
 if(a==='choose-style'){S.right=id;S.compareMode='split';navTo('compare');return;}
 if(a==='edit-style'){S.editSlot='right';openEditor(id);return;}
 if(a==='edit-left'){S.editSlot='left';openEditor(S.left);return;}
 if(a==='edit-right'){S.editSlot='right';openEditor(S.right);return;}
 if(a==='compare-mode'){S.compareMode=target.dataset.value;draw();return;}
 if(a==='editor-cancel'){navTo(S.editBack==='compare'?'compare':'styles');return;}
 if(a==='reset-tone'){S.editTone=normalizeTone(style(S.editId).tone);draw();return;}
 if(a==='save-custom'){
   const p=buildCustomProfile();
   if(!p){toast('Wpisz nazwę profilu');return;}
   if(S.customStyles.length>=100){toast('Limit 100 własnych profili');return;}
   S.customStyles.push(p);
   try{persistCustomStyles();}catch{S.customStyles.pop();toast('Nie udało się zapisać profilu');return;}
   if(S.editBack==='compare'&&S.editSlot==='left')S.left=p.id;else S.right=p.id;
   S.brand='Moje profile';navTo(S.editBack==='compare'?'compare':'styles');
   toast('Zapisano własny profil na urządzeniu');return;
 }
 if(a==='delete-custom'){
   if(style(S.editId).brand!=='Moje profile'||!confirm('Usunąć własny profil?'))return;
   const before=S.customStyles;
   S.customStyles=before.filter(p=>p.id!==S.editId);
   try{persistCustomStyles();}catch{S.customStyles=before;toast('Błąd zapisu');return;}
   if(S.left===S.editId)S.left='hass-natural';
   if(S.right===S.editId)S.right='leica-classic';
   S.brand='Moje profile';navTo('styles');toast('Usunięto profil');return;
 }
 if(a==='export-profiles'){
   downloadJSON({format:'photo-atelier-profiles-v1',date:new Date().toISOString(),profiles:S.customStyles,
     note:'Wizualizacje CSS, bez oryginalnych profili producentów'},'PHOTO_ATELIER_Moje_Profile.json');
   toast('Zapisano plik kopii własnych profili');return;
 }
 if(a==='import-profiles'){
   const f=document.createElement('input');f.type='file';f.accept='.json,application/json';
   f.onchange=async()=>{
     if(!f.files?.length)return;
     try{
       const d=JSON.parse(await f.files[0].text());
       if(d.format!=='photo-atelier-profiles-v1'||!Array.isArray(d.profiles))throw Error('Nieobsługiwany plik');
       const existing=new Set(S.customStyles.map(x=>x.id));
       const addition=validateSavedProfiles(d.profiles).filter(x=>!existing.has(x.id)).slice(0,100-S.customStyles.length);
       const before=S.customStyles;S.customStyles=[...before,...addition];
       try{persistCustomStyles();}catch(e){S.customStyles=before;throw e;}
       S.brand='Moje profile';S.styleQuery='';draw();toast('Zaimportowano '+addition.length+' profili');
     }catch(err){toast('Błąd importu: '+err.message);}
   };f.click();return;
 }
 if(a==='lesson'){const n=Number(id);S.done=S.done.includes(n)?S.done.filter(x=>x!==n):[...S.done,n];saveProgress();draw();return;}
 if(a==='mission'){const n=Number(id);S.missions=S.missions.includes(n)?S.missions.filter(x=>x!==n):[...S.missions,n];saveProgress();draw();return;}
 if(a==='theme'){S.theme=target.dataset.value;localStorage.setItem('pa-theme',S.theme);draw();return;}
 if(a==='recipe-export'){downloadJSON({format:'photo-atelier-recipe-v1',kind:'demo',title:'Natural Color Study',contrast:S.recipeContrast,saturation:S.recipeSaturation,warning:'Not a verified XMP or NP3 file'},'PhotoAtelier_receptura_demo.json');toast('Zapisano demonstracyjną recepturę JSON');return;}
 navTo(a==='menu'?'more':a);
});
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.id==='split-range'){S.split=Number(t.value);updateSplitUI();}
 if(t.id==='style-search'){S.styleQuery=t.value;const el=document.getElementById('style-results');if(el)el.innerHTML=styleResults();}
 if(t.id==='custom-name')S.editName=t.value;
 if(t.dataset.tone){
   if(!S.editTone)return;
   S.editTone[t.dataset.tone]=Number(t.value);
   document.getElementById('value-'+t.dataset.tone).textContent=t.value;
   document.getElementById('editor-effect')?.style.setProperty('filter',cssFilter(S.editTone));
 }
 if(t.id==='recipe-contrast'){S.recipeContrast=Number(t.value);document.getElementById('v-contrast').textContent=t.value;}
 if(t.id==='recipe-sat'){S.recipeSaturation=Number(t.value);document.getElementById('v-sat').textContent=t.value;}
});
document.addEventListener('change',async e=>{
 const t=e.target;
 if(t.dataset.select){S[t.dataset.select]=t.value;draw();return;}
 if(t.id==='file-input'){
   if(!t.files?.length)return;
   try{const {added,skipped}=await importFiles(t.files);await refresh();toast('Dodano '+added.length+' materiałów. Pominięto '+skipped.length+' duplikatów.');}
   catch(err){console.error(err);toast('Błąd zapisu — sprawdź wolne miejsce i uprawnienia');}
   t.value='';return;
 }
 if(t.id==='restore-input'&&t.files?.[0]){
  try{const data=JSON.parse(await t.files[0].text());const n=await restoreCatalogue(data);await refresh();toast('Zaimportowano indeks: '+n+' rekordów');}
  catch(err){toast('Nie udało się wczytać indeksu: '+err.message);}
  t.value='';
 }
});
let draggedPointer=null;
function setSplitFromPointer(e,stage){
 const rect=stage.getBoundingClientRect();
 S.split=percentageFromPointer(e.clientX,rect.left,rect.width);
 updateSplitUI();
}
document.addEventListener('pointerdown',e=>{
 const stage=e.target.closest('#compare');
 if(!stage||S.page!=='compare'||S.compareMode!=='split')return;
 draggedPointer=e.pointerId;
 try{stage.setPointerCapture(e.pointerId);}catch{}
 setSplitFromPointer(e,stage);e.preventDefault();
});
document.addEventListener('pointermove',e=>{
 if(draggedPointer!==e.pointerId||S.compareMode!=='split')return;
 const stage=document.getElementById('compare');
 if(stage){setSplitFromPointer(e,stage);e.preventDefault();}
});
function releaseSplit(e){if(draggedPointer!==e.pointerId)return;draggedPointer=null;}
document.addEventListener('pointerup',releaseSplit);
document.addEventListener('pointercancel',releaseSplit);
document.addEventListener('keydown',e=>{
 const stage=e.target.closest?.('#compare');
 if(!stage||S.compareMode!=='split')return;
 if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
  S.split=Math.max(0,Math.min(100,S.split+(e.key==='ArrowLeft'?-2:2)));
  updateSplitUI();e.preventDefault();
 }
});
if('serviceWorker' in navigator && location.protocol==='https:') navigator.serviceWorker.register('/sw.js').catch(()=>{});
refresh();