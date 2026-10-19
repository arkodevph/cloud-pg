import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
const artifacts = '/tmp/cloudpg-parallax';
const server = spawn('python3', ['-m','http.server','4187','--bind','127.0.0.1','--directory','/home/nami/cloudpg-redesign/dist'], { stdio:'ignore' });
const profile = `${artifacts}/chromium-isolated-${Date.now()}`;
const chrome = spawn('/home/nami/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome', ['--headless=new','--blink-settings=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2','--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-extensions','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'], { stdio:'ignore' });
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
  await call('Page.navigate',{url:'http://127.0.0.1:4187/'});
  for(let i=0;i<100;i++){if(await run("document.readyState==='complete' && !!document.querySelector('.industry-stack-stage')"))break;await sleep(100);}
  await run('document.fonts.ready.then(()=>true)');
  await run("document.documentElement.style.scrollBehavior='auto'");

  const assert = (condition, message) => { if (!condition) throw Error(message); };
  await sleep(4500);
  const copyBefore = await run("JSON.stringify(document.querySelector('.hero-film__copy').getBoundingClientRect().toJSON())");
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:1300,y:700});
  await sleep(3000);
  const moved = await run("[...document.querySelectorAll('[data-hero-depth]')].map(n=>({depth:Number(n.dataset.heroDepth),translate:n.style.translate}))");
  console.log(JSON.stringify({moved,environment:await run("({fine:matchMedia('(pointer:fine)').matches,hover:matchMedia('(hover:hover)').matches,top:document.elementFromPoint(1300,700)?.outerHTML.slice(0,160),script:[...document.scripts].map(s=>s.src)})")}));
  assert(moved.every(n=>parseFloat(n.translate)>1),'All layers must respond to pointer');
  assert(parseFloat(moved[2].translate)>parseFloat(moved[0].translate)*3,'Foreground must move more than background');
  assert(copyBefore===await run("JSON.stringify(document.querySelector('.hero-film__copy').getBoundingClientRect().toJSON())"),'Copy must remain fixed');
  assert(await run("[...document.querySelectorAll('.hero-film__services a')].every(a=>{const r=a.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2).closest('a')===a})"),'Service buttons must remain accessible');
  await sleep(1300);await capture('hero-desktop');
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:899});
  await run("document.querySelector('[data-hero-parallax]').dispatchEvent(new PointerEvent('pointerleave'))");
  await sleep(3000);
  assert(await run("[...document.querySelectorAll('[data-hero-depth]')].every(n=>n.style.translate.split(' ').every(v=>parseFloat(v)===0))"),'Layers must return to center');
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:1300,y:700});await sleep(500);
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await sleep(250);
  console.log(await run("({reduce:matchMedia('(prefers-reduced-motion:reduce)').matches,layers:[...document.querySelectorAll('[data-hero-depth]')].map(n=>getComputedStyle(n).translate),styles:[...document.styleSheets].map(s=>s.href)})"));
  assert(await run("[...document.querySelectorAll('[data-hero-depth]')].every(n=>getComputedStyle(n).translate==='none'||getComputedStyle(n).translate.split(' ').every(v=>parseFloat(v)===0))"),'Reduced motion must reset layers');
  assert(await run("document.querySelector('video').paused"),'Reduced motion must pause video');
  await capture('hero-reduced-motion');
  await call('Emulation.setEmulatedMedia',{features:[]});
  for(const width of [390,320]) {
    await call('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
    await call('Emulation.setTouchEmulationEnabled',{enabled:true});
    await sleep(600);
    assert(await run("document.documentElement.scrollWidth<=innerWidth"),'Mobile overflow at '+width);
    assert(await run("[...document.querySelectorAll('.hero-film__services a')].every(n=>{const r=n.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44})"),'Mobile buttons clipped at '+width);
    await capture('hero-mobile-'+width);
  }
  assert(!errors.length,'Page exceptions: '+JSON.stringify(errors));
  const result={passed:true,moved,checks:['depth response','fixed copy','clickable buttons','return to center','reduced motion','paused video','390/320 layouts'],errors};
  writeFileSync(`${artifacts}/verification.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));
} finally {ws?.close();chrome.kill();server.kill();}
