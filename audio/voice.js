/* AIC Practice voice v4: plays recorded clips through ONE persistent <audio> element
   (unlocked on the first touch, then reused) so iOS Safari / home-screen mode allows
   later and chained plays. speechSynthesis is used ONLY when a clip file fails to load. */
(function(){
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/voice\.js.*$/,'');
var PRAISE=['great-job','you-did-it','way-to-go','awesome-work','super','amazing-job'];
var RETRY=['almost','try-again'];
var el=new Audio();el.preload='auto';el.setAttribute('playsinline','');el.setAttribute('webkit-playsinline','');
var q=[],fb='',tok=0,unlocked=false,blocked=null;
var log=window.__voiceLog=[];function L(m){log.push(m);try{console.log('[voice] '+m)}catch(e){}}
function tts(t){L('tts: '+t);try{if(!t||!('speechSynthesis'in window))return;speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.rate=0.85;u.lang='en-US';speechSynthesis.speak(u)}catch(e){}}
function stop(){tok++;q=[];blocked=null;try{el.pause()}catch(e){}try{speechSynthesis.cancel()}catch(e){}}
function playCur(my,k){
 el.muted=false;var p;try{p=el.play()}catch(e){p=Promise.reject(e)}
 if(p&&p.then)p.then(function(){if(my===tok)L('clip: '+k)},function(err){
  if(my!==tok)return;
  if(err&&err.name==='NotAllowedError'){L('blocked (autoplay), retry on next tap: '+k);blocked={my:my,k:k};}
  else if(err&&err.name==='AbortError'){/* superseded by a newer clip */}
  else{L('play error '+(err&&err.name)+': '+k);missing(my)}
 });
}
function missing(my){if(my!==tok)return;var t=fb;stop();tts(t)}
function next(my){if(my!==tok)return;if(!q.length)return;var k=q.shift();el.src=BASE+k+'.mp3';playCur(my,k)}
el.addEventListener('ended',function(){next(tok)});
el.addEventListener('error',function(){if(el.src&&q!==null){L('clip missing: '+el.src);missing(tok)}});
/* clips: array of slugs; fallback: spoken by the device only if a clip file is missing */
window.sayClips=function(clips,fallback){stop();fb=fallback||'';q=(clips||[]).slice();if(!q.length)return;next(tok)};
window.praise=function(){return PRAISE[Math.floor(Math.random()*PRAISE.length)]};
window.retry=function(){return RETRY[Math.floor(Math.random()*RETRY.length)]};
window.numClip=function(n){return 'n'+n};
/* Every tap: unlock the shared element once, and resume a clip that autoplay blocked. */
function gesture(){
 if(blocked){var b=blocked;blocked=null;if(b.my===tok){playCur(b.my,b.k);unlocked=true;return}}
 if(unlocked)return;unlocked=true;
 if(!el.src||el.ended||el.paused&&!q.length){var s=el.src;el.muted=true;el.src=BASE+'super.mp3';
  var p=el.play();if(p&&p.then)p.then(function(){el.pause();el.currentTime=0;el.muted=false;L('unlocked')},function(){el.muted=false;unlocked=false});}
}
['touchend','pointerup','click','keydown'].forEach(function(ev){document.addEventListener(ev,gesture,{capture:true,passive:true})});
})();
