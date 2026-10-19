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
  await call('Page.navigate',{url:'http://127.0.0.1:4173/?hubb=showcase'});
  for(let i=0;i<100;i++){if(await run("document.readyState==='complete' && !!document.querySelector('.industry-stack-stage')"))break;await sleep(100);}
  await run('document.fonts.ready.then(()=>true)');
  await run("document.documentElement.style.scrollBehavior='auto'");

  const assert=(condition,message)=>{if(!condition)throw Error(message);};
  await run("document.querySelector('#payment-hubb').scrollIntoView({block:'start'})");await sleep(600);
  const select=async name=>{
    await run(`document.querySelector('[data-hubb-scene="${name}"]').click()`);await sleep(600);
    const result=await run("({active:document.querySelector('.hubb-page.is-active').dataset.phonePage,pressed:document.querySelector('[data-hubb-scene][aria-pressed=true]').dataset.hubbScene,caption:document.querySelector('[data-hubb-scene-caption]').textContent,playing:document.querySelector('[data-hubb-motion]').classList.contains('hubb-playing')})");
    assert(result.active===name&&result.pressed===name&&!result.playing,'Choice selection '+name+': '+JSON.stringify(result));return result;
  };
  const choices=[];for(const name of ['account','arrangement','support']) {choices.push(await select(name));await capture('hubb-desktop-'+name);}
  const geometry=[];
  for(const width of [1710,1440,768,390,320]) {
    await viewport(width,width>760?990:844);await run("document.querySelector('#payment-hubb').scrollIntoView({block:'start'})");await select('account');
    const state=await run("({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,transform:getComputedStyle(document.querySelector('.hubb-device')).transform,animation:getComputedStyle(document.querySelector('.hubb-device')).animationName,hardware:!!document.querySelector('.hubb-safari,.hubb-device__notch,.hubb-status'),buttons:[...document.querySelectorAll('[data-hubb-scene]')].map(n=>({height:n.getBoundingClientRect().height,width:n.getBoundingClientRect().width,left:n.getBoundingClientRect().left})),scene:[...document.querySelectorAll('.hubb-page')].map(n=>({name:n.dataset.phonePage,height:n.clientHeight,content:n.scrollHeight})),portal:document.querySelector('.hubb-device').getBoundingClientRect().toJSON(),panel:document.querySelector('.hubb-showcase').getBoundingClientRect().toJSON()})");
    assert(!state.overflow&&state.transform==='none'&&state.animation==='none'&&!state.hardware,'Grounded preview/layout at '+width+': '+JSON.stringify(state));
    assert(state.portal.left>=state.panel.left&&state.portal.right<=state.panel.right,'Portal must stay inside the presentation panel');
    assert(state.buttons.every(n=>n.height>=44&&n.left>=0&&n.left+n.width<=width),'Control geometry at '+width);
    assert(state.scene.every(n=>n.content<=n.height+1),'Clipped demo page at '+width+': '+JSON.stringify(state.scene));
    geometry.push(state);await capture('hubb-layout-'+width);
  }
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await sleep(500);
  await select('arrangement');await select('support');
  await call('Emulation.setEmulatedMedia',{features:[]});await viewport(1440,900);await select('account');
  await run("document.querySelector('.hubb-motion__toggle').click()");await sleep(5600);
  assert(await run("document.querySelector('.hubb-page.is-active').dataset.phonePage==='payment'"),'Demo must advance from account to payment');
  await run("document.querySelector('.hubb-motion__toggle').click()");
  const before=await run("document.querySelector('[data-hubb-motion]').dataset.demoStep");await sleep(1200);
  assert(before===await run("document.querySelector('[data-hubb-motion]').dataset.demoStep"),'Pause must hold the scene');
  await run("document.querySelector('[data-hubb-scene=account]').focus()");
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  assert(await run("getComputedStyle(document.activeElement).outlineStyle!=='none'"),'Keyboard focus visible');
  assert(await run("document.querySelectorAll('[data-hero-depth]').length===3 && !document.querySelector('.hero-film__information') && !!document.querySelector('.cloud-start')"),'Hero and audience section retained');
  assert(errors.length===0,'Page errors '+JSON.stringify(errors));
  writeFileSync(`${artifacts}/verification.json`,JSON.stringify({passed:true,choices,geometry,errors},null,2));console.log(JSON.stringify({passed:true,widths:geometry.map(s=>s.width),choices,errors}));
} finally {ws?.close();chrome.kill();server.kill();}
