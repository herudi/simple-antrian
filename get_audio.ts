const pad = (len: number) => Array(Math.max(len, 0)).join("0");

export default function getAudios(str: string) {
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