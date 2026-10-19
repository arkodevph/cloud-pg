import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
const artifacts = '/tmp/cloudpg-original-hero';
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
  await call('Runtime.enable');await call('Page.enable');await viewport(1710,990);
  await call('Page.navigate',{url:'http://127.0.0.1:4173/?hero=original'});
  for(let i=0;i<100;i++){if(await run("document.readyState==='complete' && !!document.querySelector('.industry-stack-stage')"))break;await sleep(100);}
  await run('document.fonts.ready.then(()=>true)');
  await run("document.documentElement.style.scrollBehavior='auto'");


  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const states=[];
  for(const width of [1710,390,320]) {
    await viewport(width,width===1710?990:844);await sleep(500);
    const state=await run("({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,parallax:!!document.querySelector('[data-hero-parallax]'),stray:!!document.querySelector('.hero-film__information'),messages:document.querySelectorAll('.hero-film__card').length,heading:document.querySelector('.hero-film h1').innerText,scale:getComputedStyle(document.querySelector('video')).scale,buttons:[...document.querySelectorAll('.hero-film__services a')].every(a=>{const r=a.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44}),audience:!!document.querySelector('.cloud-start')})");
    if(state.overflow||state.parallax||state.stray||state.messages!==2||!state.buttons||!state.audience)throw Error(JSON.stringify(state));
    await capture('hero-original-'+width);states.push(state);
  }
  if(errors.length)throw Error(JSON.stringify(errors));
  writeFileSync(`${artifacts}/verification.json`,JSON.stringify({passed:true,states,errors},null,2));
  console.log(JSON.stringify({passed:true,widths:states.map(s=>s.width),errors}));
} finally {ws?.close();chrome.kill();server.kill();}
