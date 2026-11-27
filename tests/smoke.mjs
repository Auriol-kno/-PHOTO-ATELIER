import {test} from 'node:test';
import assert from 'node:assert/strict';
import {kindOf,readableSize} from '../src/storage.js';

test('RAW is metadata-only input',()=>{
 assert.equal(kindOf({name:'NIKON_0001.NEF',type:'application/octet-stream'}),'RAW');
 assert.equal(kindOf({name:'A6.CR3',type:''}),'RAW');
 assert.equal(kindOf({name:'IMG.DNG',type:'image/x-adobe-dng'}),'RAW');
});
test('photo previews are eligible for supported image formats',()=>{
 assert.equal(kindOf({name:'PORTRAIT.JPG',type:'image/jpeg'}),'Zdjęcie');
 assert.equal(kindOf({name:'mood.webp',type:'image/webp'}),'Zdjęcie');
 assert.equal(kindOf({name:'photo.heic',type:'application/octet-stream'}),'Zdjęcie');
});
test('profiles and documents are not mistaken for photos',()=>{
 assert.equal(kindOf({name:'Leica.xmp',type:'application/octet-stream'}),'Preset');
 assert.equal(kindOf({name:'Nikon.NP3',type:''}),'Preset');
 assert.equal(kindOf({name:'lesson.pdf',type:'application/pdf'}),'Materiał');
});
test('human readable size formatting',()=>{
 assert.equal(readableSize(1),'1 B');
 assert.equal(readableSize(1024),'1 KB');
 assert.equal(readableSize(1048576),'1.0 MB');
});
