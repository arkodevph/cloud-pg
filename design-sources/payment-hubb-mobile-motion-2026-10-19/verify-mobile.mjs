import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
const artifacts = '/tmp/cloudpg-hubb-research';
const server = spawn('python3', ['-m','http.server','4187','--bind','127.0.0.1','--directory','/home/nami/cloudpg-redesign/dist'], { stdio:'ignore' });
const profile = `${artifacts}/chromium-isolated-${Date.now()}`;
const chrome = spawn('/home/nami/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome', ['--headless=new','--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-extensions','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'], { stdio:'ignore' });
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));
let ws;
try {
  let target,port;
  for (let i=0;i<100;i++) {
    try { if(existsSync(`${profile}/DevToolsActivePort`)) { port=readFileSync(`${profile}/DevToolsActivePort`,'utf8').split('\n')[0]; target=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==='page'); if(target)break; } } catch {}
    await sleep(100);
  }
  if(!target) throw Error('Independent Chromium did not start');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  let id=0;
  const pending=new Map(), errors=[];
  ws.addEventListener('message',event=>{
    const response=JSON.parse(event.data);
    if(response.method==='Runtime.exceptionThrown') errors.push(response.params.exceptionDetails);
    if(response.id){ const promise=pending.get(response.id);if(!promise)return; pending.delete(response.id);response.error?promise.reject(Error(JSON.stringify(response.error))):promise.resolve(response.result); }
  });
  const call=(method,params={})=>new Promise((resolve,reject)=>{const request=++id;pending.set(request,{resolve,reject});ws.send(JSON.stringify({id:request,method,params}));});
  const run=async expression=>{const response=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(response.exceptionDetails)throw Error(response.exceptionDetails.exception?.description||response.exceptionDetails.text);return response.result.value;};
  const viewport=(width,height)=>call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  const capture=async name=>{const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});writeFileSync(`${artifacts}/${name}.png`,Buffer.from(shot.data,'base64'));};
  await call('Runtime.enable');await call('Page.enable');await viewport(1440,900);
  await call('Page.navigate',{url:'http://127.0.0.1:4173/?hubb=mobile-motion'});
  for(let i=0;i<100;i++){if(await run("document.readyState==='complete' && !!document.querySelector('.industry-stack-stage')"))break;await sleep(100);}
  await run('document.fonts.ready.then(()=>true)');
  await run("document.documentElement.style.scrollBehavior='auto'");

  const assert=(condition,message)=>{if(!condition)throw Error(message);};
  const states=[];
  for(const width of [1710,1440,768,390,320]) {
    await viewport(width,width>700?1040:844);
    await run("document.querySelector('.hubb-mobile-stage').scrollIntoView({block:'start'})");await sleep(700);
    const state=await run("({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,phone:!!document.querySelector('.hubb-device__notch')&&!!document.querySelector('.hubb-safari'),portal:!!document.querySelector('.hubb-showcase'),progress:document.querySelectorAll('.hubb-mobile-progress>span').length,transform:getComputedStyle(document.querySelector('.hubb-device')).transform,playing:document.querySelector('[data-hubb-motion]').classList.contains('hubb-playing'),phoneRect:document.querySelector('.hubb-device').getBoundingClientRect().toJSON(),stageRect:document.querySelector('.hubb-mobile-stage').getBoundingClientRect().toJSON()})");
    assert(!state.overflow&&state.phone&&!state.portal&&state.progress===3,'Mobile motion concept at '+width+': '+JSON.stringify(state));
    assert(state.phoneRect.left>=state.stageRect.left&&state.phoneRect.right<=state.stageRect.right,'Phone clipped by stage '+width);
    states.push(state);await capture('mobile-motion-'+width);
  }
  await viewport(1440,1040);await run("document.querySelector('.hubb-mobile-stage').scrollIntoView({block:'start'})");await sleep(500);
  const before=await run("document.querySelector('[data-hubb-motion]').dataset.demoStep");await sleep(5500);
  assert(before!==await run("document.querySelector('[data-hubb-motion]').dataset.demoStep"),'Phone screen sequence must advance');
  await run("document.querySelector('.hubb-motion__toggle').click()");
  assert(await run("!document.querySelector('[data-hubb-motion]').classList.contains('hubb-playing')"),'Pause must stop phone motion');
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await sleep(700);
  assert(await run("!document.querySelector('[data-hubb-motion]').classList.contains('hubb-playing')"),'Reduced motion must stop autoplay');
  assert(await run("document.querySelectorAll('[data-hero-depth]').length===3&&!!document.querySelector('.cloud-start')"),'Hero parallax and audience section retained');
  assert(!errors.length,'Page errors '+JSON.stringify(errors));
  writeFileSync(`${artifacts}/mobile-verification.json`,JSON.stringify({passed:true,states,errors},null,2));console.log(JSON.stringify({passed:true,widths:states.map(s=>s.width),errors}));
} finally {ws?.close();chrome.kill();server.kill();}
