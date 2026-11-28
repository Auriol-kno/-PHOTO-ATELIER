import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BRAND_INFO, BUILTIN_STYLES, TONE_FIELDS, cssFilter, comparisonClip, percentageFromPointer, normalizeTone, validateSavedProfiles} from '../src/catalog.js';

test('catalogue spans professional digital and film systems',()=>{
 assert.ok(BRAND_INFO.length>=15,'At least 15 brand families');
 assert.ok(BUILTIN_STYLES.length>=90,'At least 90 curated named looks');
 const unique=new Set(BUILTIN_STYLES.map(s=>s.id));
 assert.equal(unique.size,BUILTIN_STYLES.length);
 assert.ok(BUILTIN_STYLES.every(s=>s.brand&&s.title&&s.source&&s.verified===false));
 assert.ok(BUILTIN_STYLES.some(s=>s.brand==='Nikon'));
 assert.ok(BUILTIN_STYLES.some(s=>s.brand==='Hasselblad'));
 assert.ok(BUILTIN_STYLES.some(s=>s.brand==='Fujifilm'));
});
test('style rendering creates valid bounded CSS values',()=>{
 const x=cssFilter({brightness:999,contrast:-1000,saturation:22,warmth:-33,hue:999,fade:9,mono:110});
 assert.match(x,/brightness\(/);
 assert.match(x,/grayscale\(1\.00\)/);
 assert.ok(!x.includes('NaN'));
 assert.equal(normalizeTone({brightness:999}).brightness,40);
 assert.equal(normalizeTone({fade:-90}).fade,0);
 assert.equal(TONE_FIELDS.length,7);
});
test('touch comparison position clamps to photo bounds',()=>{
 assert.equal(percentageFromPointer(10,10,200),0);
 assert.equal(percentageFromPointer(110,10,200),50);
 assert.equal(percentageFromPointer(210,10,200),100);
 assert.equal(percentageFromPointer(-100,10,200),0);
 assert.equal(percentageFromPointer(400,10,200),100);
 assert.equal(percentageFromPointer(100,10,0),50);
});
test('compare supports split, full A and full B',()=>{
 assert.equal(comparisonClip('split',65),'inset(0 0 0 65%)');
 assert.equal(comparisonClip('a',50),'inset(0 100% 0 0)');
 assert.equal(comparisonClip('b',50),'inset(0 0 0 0)');
 assert.equal(comparisonClip('split',-10),'inset(0 0 0 0%)');
 assert.equal(comparisonClip('split',120),'inset(0 0 0 100%)');
});
test('custom profiles are validated and cannot replace built-ins',()=>{
 const sample={id:'user-1234567',title:'Mój profil',tone:{brightness:15,contrast:22,saturation:-20,hue:8,warmth:10,fade:5,mono:0},baseId:'hass-natural'};
 const out=validateSavedProfiles([sample,sample,{...sample,id:'hass-natural'},{...sample,id:'user-2222222',title:' ' }]);
 assert.equal(out.length,1);
 assert.equal(out[0].brand,'Moje profile');
 assert.equal(out[0].baseId,'hass-natural');
 assert.equal(out[0].tone.contrast,22);
});
