const pad = (len: number) => Array(Math.max(len, 0)).join("0");

export function getAudios(str: string) {
  if (parseInt(str) <= 20) return [str];
  const arr = str.split("");
  const nol = arr.reduce((cur, _, i) => {
    cur[i] = pad(str.length - i);
    return cur;
  }, {} as Record<number, string>);
  let ret = arr.reduce((cur, val, i) => {
    cur.push(val);
    cur[i] += nol[i] || "";
    return cur;
  }, [] as string[]).filter(el => parseInt(el) > 0);
  if (parseInt(str.slice(-2)) <= 20 && !/0/.test(str.slice(-2))) {
    ret = ret.slice(0, -2);
    ret.push(str.slice(-2));
  }
  return ret;
}

export const list_audio = [
  "./../audio/0.wav", "./../audio/1.wav",
  "./../audio/10.wav", "./../audio/100.wav",
  "./../audio/11.wav", "./../audio/12.wav",
  "./../audio/13.wav", "./../audio/14.wav",
  "./../audio/15.wav", "./../audio/16.wav",
  "./../audio/17.wav", "./../audio/18.wav",
  "./../audio/19.wav", "./../audio/2.wav",
  "./../audio/20.wav", "./../audio/200.wav",
  "./../audio/3.wav", "./../audio/30.wav",
  "./../audio/300.wav", "./../audio/4.wav",
  "./../audio/40.wav", "./../audio/400.wav",
  "./../audio/5.wav", "./../audio/50.wav",
  "./../audio/500.wav", "./../audio/6.wav",
  "./../audio/60.wav", "./../audio/600.wav",
  "./../audio/7.wav", "./../audio/70.wav",
  "./../audio/700.wav", "./../audio/8.wav",
  "./../audio/80.wav", "./../audio/800.wav",
  "./../audio/9.wav", "./../audio/90.wav",
  "./../audio/900.wav", "./../audio/antrian.wav",
  "./../audio/counter.wav", "./../audio/in.wav"
];