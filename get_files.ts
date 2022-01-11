import { Handler, mime } from "./deps.ts";

const date = new Date();

export const getFiles: Handler = async (rev, next) => {
  try {
    const { url, response, request, path_file } = rev;
    const pathfile = path_file || ("./public" + url);
    const stats = await Deno.stat(pathfile);
    const ext = pathfile.substring(pathfile.lastIndexOf(".") + 1);
    response.header("content-type", mime.getType(ext));
    response.header("Last-Modified", (stats.mtime || date).toUTCString());
    response.header("ETag", `W/"${stats.size}-${(stats.mtime || date).getTime()}"`);
    if (request.headers.get("if-none-match") === response.header("ETag")) {
      return response.status(304).send();
    }
    response.header("x-powered-by", "NHttp Deno");
    return await Deno.readFile(pathfile);
  } catch (error) {
    return next();
  }
}

export const listFiles = [
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