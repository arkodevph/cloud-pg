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

  await viewport(1710,990);
  await run("document.querySelector('#payment-hubb').scrollIntoView({block:'start'})");await sleep(700);
  const state=await run("({stage:!!document.querySelector('.hubb-mobile-stage,.hubb-showcase'),phone:!!document.querySelector('.hubb-device__notch'),clip:getComputedStyle(document.querySelector('.hubb-device__screen')).clipPath,overflow:document.documentElement.scrollWidth>innerWidth,playing:document.querySelector('[data-hubb-motion]').classList.contains('hubb-playing')})");
  assert(!state.stage&&state.phone&&!state.overflow&&state.playing&&state.clip.includes('36px'),'Floating phone and clipping: '+JSON.stringify(state));
  await capture('floating-phone-restored');
  const before=await run("document.querySelector('[data-hubb-motion]').dataset.demoStep");await sleep(5500);
  assert(before!==await run("document.querySelector('[data-hubb-motion]').dataset.demoStep"),'Phone screens must animate');
  await viewport(320,844);await run("document.querySelector('#payment-hubb').scrollIntoView({block:'start'})");await sleep(500);
  assert(await run("document.documentElement.scrollWidth<=innerWidth"),'Mobile overflow');
  assert(!errors.length,'Page exceptions');
  writeFileSync(`${artifacts}/floating-verification.json`,JSON.stringify({passed:true,state,errors},null,2));console.log(JSON.stringify({passed:true,state,errors}));
} finally {ws?.close();chrome.kill();server.kill();}
