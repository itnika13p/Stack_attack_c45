import { test,expect } from '@playwright/test';

test('desktop title, real keyboard gameplay, pause, options and restart navigation',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.clock.install();await page.goto('./');
  const canvas=page.locator('canvas');await expect(canvas).toHaveAttribute('data-scene','title');
  await page.clock.runFor(100);await canvas.screenshot({path:'docs/screenshots/title.png'});
  await page.keyboard.press('Enter');await expect(canvas).toHaveAttribute('data-scene','playing');
  await page.clock.runFor(100);const initial=await canvas.screenshot();
  await page.keyboard.down('ArrowRight');await page.keyboard.press('Space');await page.clock.runFor(600);await page.keyboard.up('ArrowRight');
  const moved=await canvas.screenshot();expect(moved.equals(initial)).toBe(false);
  await canvas.screenshot({path:'docs/screenshots/desktop-gameplay.png'});
  await page.keyboard.press('Enter');await expect(canvas).toHaveAttribute('data-scene','paused');
  await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');await expect(canvas).toHaveAttribute('data-scene','settings');
  await page.keyboard.press('Enter');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('stack-attack-c45:v1')!).sound)).toBe(false);
  await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('stack-attack-c45:v1')!).sensitivity)).toBe('high');
  await page.keyboard.press('Escape');await page.keyboard.press('Enter');await expect(canvas).toHaveAttribute('data-scene','playing');
  await page.keyboard.press('Escape');await page.clock.runFor(100);await canvas.screenshot({path:'docs/screenshots/paused.png'});
  expect(errors).toEqual([]);
});

test('mobile real touch tap, diagonal and reverse drags; release and cancellation',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
  const page=await context.newPage();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install();await page.goto('./');const canvas=page.locator('canvas');
  const rect=(await canvas.boundingBox())!;
  const x=rect.x+rect.width*0.55,y=rect.y+rect.height*0.7;
  await page.touchscreen.tap(rect.x+rect.width/2,rect.y+rect.height*0.8);
  await expect(canvas).toHaveAttribute('data-scene','playing');await page.clock.runFor(100);
  const before=await canvas.screenshot();await page.touchscreen.tap(x,y);await page.clock.runFor(170);
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  await page.clock.runFor(400);
  const cdp=await context.newCDPSession(page);
  const touch=async(type:'touchStart'|'touchMove'|'touchEnd'|'touchCancel',px=x,py=y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'||type==='touchCancel'?[]:[{x:px,y:py,id:1}]});
  await touch('touchStart');await touch('touchMove',x+60,y-35);await page.clock.runFor(180);
  await touch('touchMove',x-35,y-35);await page.clock.runFor(180);await touch('touchEnd');await page.clock.runFor(500);
  await touch('touchStart');await touch('touchMove',x+50,y);await touch('touchCancel');await page.clock.runFor(100);
  await page.screenshot({path:'docs/screenshots/mobile-gameplay.png'});
  const metrics=await canvas.evaluate(el=>{const r=el.getBoundingClientRect();return {ratio:r.width/r.height,pixels:getComputedStyle(el).imageRendering,overflow:document.documentElement.scrollHeight>innerHeight};});
  expect(metrics.ratio).toBeCloseTo(101/64);expect(metrics.overflow).toBe(false);
  await page.touchscreen.tap(rect.x+10,rect.y+8);await expect(canvas).toHaveAttribute('data-scene','paused');
  expect(errors).toEqual([]);await context.close();
});

test('production service worker cold reload works offline, including repository subpath',async({page,context})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/Stack_attack_c45/');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.reload();await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);await page.reload();
  await expect(page.locator('canvas')).toHaveAttribute('data-scene','title');
  await page.keyboard.press('Enter');await expect(page.locator('canvas')).toHaveAttribute('data-scene','playing');
  await page.keyboard.press('Space');expect(errors).toEqual([]);
});

test('losing and restarting through actual idle gameplay',async({page})=>{
  test.setTimeout(90000);
  await page.addInitScript(()=>{Crypto.prototype.getRandomValues=function<T extends ArrayBufferView|null>(array:T):T{if(array instanceof Uint32Array)array.fill(45);return array;};});
  await page.clock.install();await page.goto('./');await page.keyboard.press('Enter');
  for(let n=0;n<80;n++){
    await page.clock.runFor(1000);
    if(await page.locator('canvas').getAttribute('data-scene')==='over')break;
  }
  await expect(page.locator('canvas')).toHaveAttribute('data-scene','over');
  await page.clock.runFor(100);await page.locator('canvas').screenshot({path:'docs/screenshots/game-over.png'});
  const score=await page.evaluate(()=>JSON.parse(localStorage.getItem('stack-attack-c45:v1')!).highScore);expect(score).toBeGreaterThan(0);
  await page.keyboard.press('Enter');await expect(page.locator('canvas')).toHaveAttribute('data-scene','playing');
  await page.reload();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('stack-attack-c45:v1')!).highScore)).toBe(score);
});

test('blur automatically pauses and returning never resumes without input',async({page})=>{
  await page.goto('./');await page.keyboard.press('Enter');
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  await expect(page.locator('canvas')).toHaveAttribute('data-scene','paused');
  await page.keyboard.press('Enter');await expect(page.locator('canvas')).toHaveAttribute('data-scene','playing');
});
