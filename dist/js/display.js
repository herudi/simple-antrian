(()=>{const M=o=>Array(Math.max(3-String(o).length+1,0)).join(0)+o,d=window.location.origin,w=document.getElementById("no"),T=document.getElementById("form"),x=document.getElementById("txt_display"),r=document.getElementById("last"),u=document.getElementById("prepare"),p=document.getElementById("loading"),B=document.getElementById("display"),f=document.getElementById("counter"),h=document.getElementById("my_bar");let c={};function b(){u.style.display="none",B.style.display="block"}let y=!0;window.AudioContext=window.AudioContext||window.webkitAudioContext;window.cacheAudio=async()=>{const o=await caches.open("audio-antrian-cache");try{p.style.display="block",u.style.display="none";let t=await fetch(d+"/list-audios").then(e=>e.json());t=t.map(e=>d+"/public"+e);for(let e=0;e<t.length;e++){const n=t[e];await o.match(n)||await o.add(n);const a=(100/t.length*(e+1)).toFixed(0);h.style.width=a+"%",h.innerHTML=a+"%"}p.style.display="none",u.style.display="block"}catch(t){alert(t.message||"Error Network")}};async function I(o){y=!1;const t=new AudioContext,e=await caches.open("audio-antrian-cache");for(let n=0;n<o.length;n++){const s=o[n];try{let a=await e.match(s);a||(await e.add(s),a=await e.match(s));const l=await a.arrayBuffer(),i=t.createBufferSource(),g=()=>new Promise(E=>{i.onended=E});i.buffer=await t.decodeAudioData(l),i.connect(t.destination),i.start(),await g()}catch(a){console.error(a)}}y=!0}T.onsubmit=function(o){o.preventDefault();const t=x.value;new EventSource("/sse/"+t).onmessage=async function(e){const n=JSON.parse(e.data);if(n.type==="display"){if(y){r.innerHTML="";const s=n.data,a=M(s.no);w.innerHTML=a,f.innerHTML=s.counter,c[s.counter]=a;for(const i in c)r.innerHTML+=`
          <div class="frame-last">
            <h4 class="text-last">LOKET ${i} : ${c[i]}</h4>
          </div>
        `;const l=s.audios.map(i=>d+"/public/audio/"+i+".wav");await I(l)}}else n.type==="reset"&&(c={},w.innerHTML="-",f.innerHTML="-",r.innerHTML=`
          <div class="frame-last">
            <h4 class="text-last">LOKET - : -</h4>
          </div>
      `)},b()};function m(){const o=new Date;let t=o.getHours(),e=o.getMinutes(),n=o.getSeconds(),s="AM";t==0&&(t=12),t>12&&(t=t-12,s="PM"),t=t<10?"0"+t:t,e=e<10?"0"+e:e,n=n<10?"0"+n:n;let a=t+":"+e+":"+n+" "+s;document.getElementById("MyClockDisplay").innerText=a,document.getElementById("MyClockDisplay").textContent=a,setTimeout(m,1e3)}m();window.showTime=m;})();
