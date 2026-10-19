import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
const artifacts = '/tmp/cloudpg-intro-research';
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
  await call('Page.navigate',{url:'http://127.0.0.1:4187/'});
  for(let i=0;i<100;i++){if(await run("document.readyState==='complete' && !!document.querySelector('.industry-stack-stage')"))break;await sleep(100);}
  await run('document.fonts.ready.then(()=>true)');
  await run("document.documentElement.style.scrollBehavior='auto'");

  const assert=(condition,message)=>{if(!condition)throw Error(message);};
  const states=[];
  for(const width of [1440,390,320]) {
    await viewport(width,width===1440?900:844);
    await run("document.querySelector('.cloud-start').scrollIntoView({block:'start'})");
    await sleep(600);
    const state=await run(`({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,oldStatement:!!document.querySelector('.intro-statement'),heading:document.querySelector('.cloud-start h2').innerText,panels:[...document.querySelectorAll('.cloud-start__path')].map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})),links:[...document.querySelectorAll('.cloud-start a')].map(a=>({text:a.innerText,href:a.getAttribute('href'),height:a.getBoundingClientRect().height,withinViewport:a.getBoundingClientRect().left>=0&&a.getBoundingClientRect().right<=innerWidth}))})`);
    assert(!state.overflow,'Overflow at '+width);
    assert(!state.oldStatement,'Old statement must be removed');
    assert(state.links.every(a=>a.height>=44&&a.withinViewport),'Targets must be usable at '+width);
    assert(width===1440?state.panels[0].y===state.panels[1].y:state.panels[0].y<state.panels[1].y,'Responsive panel arrangement');
    states.push(state);
    await capture('cloud-start-'+width);
  }
  await viewport(1440,900);
  await run("document.querySelector('.cloud-start__link').click()");await sleep(300);
  assert(await run("location.hash==='#solutions' && Math.abs(document.querySelector('#solutions').getBoundingClientRect().top-120)<3"),'Services anchor must land below navigation');
  for(const path of ['/debt-placement/','/payment-management/','/contact-us/']) {
    const response=await fetch('http://127.0.0.1:4187'+path);assert(response.ok,'Destination '+path);
  }
  assert(await run("!!document.querySelector('[data-hero-parallax]') && !!document.querySelector('.industry-stack-track') && !!document.querySelector('.process-globe')"),'Existing sections must remain');
  await run("document.querySelector('.cloud-start__link').focus()");
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  assert(await run("getComputedStyle(document.activeElement).outlineStyle!=='none'"),'Keyboard focus must be visible');
  assert(!errors.length,'Page errors: '+JSON.stringify(errors));
  writeFileSync(`${artifacts}/verification.json`,JSON.stringify({passed:true,states,errors},null,2));
  console.log(JSON.stringify({passed:true,widths:states.map(s=>s.width),linksChecked:4,errors}));
} finally {ws?.close();chrome.kill();server.kill();}
