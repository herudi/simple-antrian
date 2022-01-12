const withNol = (no) => Array(Math.max(3 - String(no).length + 1, 0)).join(0) + no;
const origin = window.location.origin;
const no = document.getElementById("no");
const form = document.getElementById("form");
const txt_display = document.getElementById("txt_display");
const last = document.getElementById("last");
const prepare = document.getElementById("prepare");
const loading = document.getElementById("loading");
const display = document.getElementById("display");
const counter = document.getElementById("counter");
const lastObj = {};
function onPrepare() {
  prepare.style.display = 'none';
  display.style.display = 'block';
}

let status = true;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.cacheAudio = async () => {
  const cache = await caches.open('audio-antrian-cache');
  try {
    loading.style.display = 'block';
    prepare.style.display = 'none';
    let sources = await fetch(origin + "/list-audios").then(r => r.json());
    sources = sources.map(el => origin + "/public" + el);
    for (let i = 0; i < sources.length; i++) {
      const url = sources[i];
      let res = await cache.match(url);
      if (!res) {
        await cache.add(url);
      }
    }
    loading.style.display = 'none';
    prepare.style.display = 'block';
  } catch (err) {
    alert(err.message || "Error Network");
  }
}
async function play(sources) {
  status = false;
  const context = new AudioContext();
  const cache = await caches.open('audio-antrian-cache');
  for (let i = 0; i < sources.length; i++) {
    const url = sources[i];
    try {
      let res = await cache.match(url);
      if (!res) {
        await cache.add(url);
        res = await cache.match(url);
      }
      const buf = await res.arrayBuffer();
      const source = context.createBufferSource();
      const end = () => new Promise((ok) => { source.onended = ok });
      source.buffer = await context.decodeAudioData(buf);
      source.connect(context.destination);
      source.start();
      await end();
    } catch (err) {
      console.error(err);
    }
  }
  status = true;
}
form.onsubmit = function (e) {
  e.preventDefault();
  const key = txt_display.value;
  new EventSource("/sse/" + key).onmessage = async function (e) {
    const json = JSON.parse(e.data);
    if (json.type === "display") {
      if (status) {
        last.innerHTML = '';
        const data = json.data;
        const noAntrian = withNol(data.no);
        no.innerHTML = noAntrian;
        counter.innerHTML = data.counter;
        lastObj[data.counter] = noAntrian;
        for (const k in lastObj) {
          last.innerHTML += `
          <div class="frame-last">
            <h4 class="text-last">LOKET ${k} : ${lastObj[k]}</h4>
          </div>
        `;
        }
        const audios = data.audios.map(el => origin + "/public/audio/" + el + ".wav");
        await play(audios);
      }
    }
  }
  onPrepare();
}

function showTime() {
  const date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let session = "AM";
  if (h == 0) {
    h = 12;
  }
  if (h > 12) {
    h = h - 12;
    session = "PM";
  }
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  let time = h + ":" + m + ":" + s + " " + session;
  document.getElementById("MyClockDisplay").innerText = time;
  document.getElementById("MyClockDisplay").textContent = time;
  setTimeout(showTime, 1000);
}

showTime();

window.showTime = showTime;