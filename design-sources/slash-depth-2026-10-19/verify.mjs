import { chromium } from '/home/nami/.npm-global/lib/node_modules/@seomator/seo-audit/node_modules/playwright/index.mjs';
import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const root='/home/nami/Desktop/projects/Apps/cloudpg-redesign';
const dir=root+'/design-sources/slash-depth-2026-10-19';
const server=spawn('python3',['-m','http.server','4188','--bind','127.0.0.1','--directory',root+'/dist'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true,executablePath:'/home/nami/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome',args:['--no-sandbox','--use-angle=swiftshader']});
const errors=[],states=[],industries=[];const url='http://127.0.0.1:4188/';
const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
try {
await page.goto(url,{waitUntil:'load'});await page.waitForTimeout(2100);await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
const start=page.locator('#start-here');await start.scrollIntoViewIfNeeded();await page.evaluate(()=>document.querySelector('#start-here').scrollIntoView({block:'start'}));await page.waitForTimeout(800);
for(let i=0;i<3;i++){
await page.locator('.cloud-start__path').nth(i).hover();await page.waitForTimeout(850);
const state=await page.evaluate(()=>({width:innerWidth,active:document.querySelector('[data-audience-panels]').dataset.active,panels:document.querySelectorAll('.cloud-start__path').length,visibleDetails:[...document.querySelectorAll('.cloud-start__detail')].filter(e=>!e.hidden).length,widths:[...document.querySelectorAll('.cloud-start__path')].map(e=>Math.round(e.getBoundingClientRect().width)),images:[...document.querySelectorAll('.cloud-start__photo')].every(e=>e.complete&&e.naturalWidth>0),overflow:document.documentElement.scrollWidth>innerWidth}));
if(state.active!==String(i)||state.panels!==3||state.visibleDetails!==1||!state.images||state.overflow||state.widths[i]<state.widths[(i+1)%3]*1.5)throw Error('Audience '+JSON.stringify(state));
await start.screenshot({path:`${dir}/audience-desktop-${i}.png`});states.push(state);
}
await page.locator('.cloud-start__select').nth(0).focus();await page.keyboard.press('ArrowRight');
const keyboard=await page.evaluate(()=>({active:document.querySelector('[data-audience-panels]').dataset.active,focused:document.activeElement===document.querySelectorAll('.cloud-start__select')[1]}));if(keyboard.active!=='1'||!keyboard.focused)throw Error('Keyboard '+JSON.stringify(keyboard));
for(let i=0;i<5;i++){
await page.evaluate(index=>{const track=document.querySelector('[data-industry-track]'),stage=track.querySelector('.industry-stack-stage'),top=parseFloat(getComputedStyle(stage).top)||0,travel=track.offsetHeight-stage.offsetHeight-top;scrollTo(0,scrollY+track.getBoundingClientRect().top-top+travel*index/4);},i);await page.waitForTimeout(800);
const state=await page.evaluate(()=>{const track=document.querySelector('[data-industry-track]'),i=Number(track.dataset.activeIndustry),panel=track.querySelectorAll('[data-industry-panel]')[i],art=panel.querySelector('.industry-panel-art img'),copy=panel.querySelector('.industry-panel-copy'),r=panel.getBoundingClientRect(),c=copy.getBoundingClientRect(),link=panel.querySelector('.industry-panel-link').getBoundingClientRect();return {index:i,src:art.getAttribute('src'),loaded:art.complete&&art.naturalWidth>0,icons:document.querySelectorAll('.industry-panel-watermark').length,copyBounds:{top:c.top,bottom:c.bottom},panelBounds:{top:r.top,bottom:r.bottom},linkVisible:link.bottom<=r.bottom&&link.top>=r.top,overflows:panel.scrollHeight>panel.clientHeight+2};});
if(state.index!==i||!state.loaded||state.icons||!state.linkVisible||state.overflows)throw Error('Industry '+JSON.stringify(state));
await page.locator('.industry-stack-stage').screenshot({path:`${dir}/industry-desktop-${i}.png`});industries.push(state);
}
for(const width of [768,390,320]){
await page.setViewportSize({width,height:844});await page.evaluate(()=>document.querySelector('#start-here').scrollIntoView({block:'start'}));await page.waitForTimeout(400);
for(let i=0;i<3;i++){
await page.locator('.cloud-start__select').nth(i).click();await page.waitForTimeout(750);
const state=await page.evaluate(()=>({width:innerWidth,active:document.querySelector('[data-audience-panels]').dataset.active,overflow:document.documentElement.scrollWidth>innerWidth,hidden:[...document.querySelectorAll('.cloud-start__detail')].filter(e=>!e.hidden).length,links:[...document.querySelectorAll('.cloud-start__detail:not([hidden]) a')].every(a=>{const r=a.getBoundingClientRect();return r.height>=44&&r.left>=0&&r.right<=innerWidth;})}));if(state.active!==String(i)||state.overflow||state.hidden!==1||!state.links)throw Error('Mobile '+JSON.stringify(state));states.push(state);
}
await start.screenshot({path:`${dir}/audience-${width}.png`});
await page.evaluate(()=>{const track=document.querySelector('[data-industry-track]'),stage=track.querySelector('.industry-stack-stage'),top=parseFloat(getComputedStyle(stage).top)||0;scrollTo(0,scrollY+track.getBoundingClientRect().top-top);});await page.waitForTimeout(600);
const bounds=await page.locator('[data-industry-panel]').first().evaluate(panel=>({overflow:panel.scrollHeight>panel.clientHeight+2,height:panel.clientHeight,scroll:panel.scrollHeight}));if(bounds.overflow)throw Error('Mobile industry overflow '+width+' '+JSON.stringify(bounds));
await page.locator('.industry-stack-stage').screenshot({path:`${dir}/industry-${width}.png`});
}
await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo(0,document.querySelector('#start-here').offsetTop));await page.waitForTimeout(300);
const reduced=await page.evaluate(()=>({transition:getComputedStyle(document.querySelector('.cloud-start__paths')).transitionDuration,industries:[...document.querySelectorAll('[data-industry-panel]')].every(e=>!e.inert&&getComputedStyle(e).visibility==='visible'),overflow:document.documentElement.scrollWidth>innerWidth}));if(parseFloat(reduced.transition)>.001||!reduced.industries||reduced.overflow)throw Error('Reduced '+JSON.stringify(reduced));
const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(url,{waitUntil:'load'});const fallback=await nojs.evaluate(()=>({actions:[...document.querySelectorAll('.cloud-start__detail')].filter(e=>!e.hidden).length,industryImages:document.querySelectorAll('.industry-panel-art img').length,overflow:document.documentElement.scrollWidth>innerWidth}));if(fallback.actions!==3||fallback.industryImages!==5||fallback.overflow)throw Error('No JS '+JSON.stringify(fallback));await nojs.close();
if(errors.length)throw Error(JSON.stringify(errors));
writeFileSync(`${dir}/verification.json`,JSON.stringify({passed:true,states,industries,keyboard,reduced,fallback,errors},null,2));console.log(JSON.stringify({passed:true,states:states.length,industries:industries.length,keyboard,reduced,fallback,errors}));
}finally{await browser.close();server.kill();}
