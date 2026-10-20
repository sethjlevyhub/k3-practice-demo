/* AIC Practice voice: plays recorded clips; falls back to speechSynthesis. */
(function(){
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/voice\.js.*$/,'');
var PRAISE=['great-job','you-did-it','way-to-go','awesome-work','super','amazing-job'];
var RETRY=['almost','try-again'];
var cur=null,q=[],tok=0,unlocked=false;
function tts(t){try{if(!t||!('speechSynthesis'in window))return;speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.rate=0.85;u.lang='en-US';speechSynthesis.speak(u)}catch(e){}}
function stop(){tok++;q=[];if(cur){try{cur.pause()}catch(e){}cur=null}try{speechSynthesis.cancel()}catch(e){}}
function next(my,fb){if(my!==tok)return;if(!q.length){cur=null;return}var k=q.shift(),a=new Audio(BASE+k+'.mp3');cur=a;var failed=false;
 function fail(){if(failed||my!==tok)return;failed=true;stop();tts(fb)}
 a.onended=function(){next(my,fb)};a.onerror=fail;var p=a.play();if(p&&p.catch)p.catch(fail)}
/* clips: array of slugs; fallback: text spoken by browser if a clip can't play */
window.sayClips=function(clips,fallback){stop();q=clips.slice();next(tok,fallback)};
window.praise=function(){return PRAISE[Math.floor(Math.random()*PRAISE.length)]};
window.retry=function(){return RETRY[Math.floor(Math.random()*RETRY.length)]};
window.numClip=function(n){return 'n'+n};
/* iOS Safari: unlock audio on first tap */
function unlock(){if(unlocked)return;unlocked=true;try{var a=new Audio(BASE+'super.mp3');a.muted=true;var p=a.play();if(p&&p.then)p.then(function(){a.pause()}).catch(function(){})}catch(e){}
 try{var C=window.AudioContext||window.webkitAudioContext;if(C){var c=new C();c.resume&&c.resume()}}catch(e){}}
['touchstart','pointerdown','click'].forEach(function(ev){document.addEventListener(ev,unlock,{capture:true,once:true,passive:true})});
})();
