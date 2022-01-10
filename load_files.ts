import { Handler, mime, readAll, readerFromStreamReader } from "./deps.ts";

export const loadFiles: Handler = async (rev, next) => {
  try {
    const { response, my_fetch, request } = rev;
    const res = await fetch(my_fetch);
    if (!res.ok || !res.body) return next();
    const lastMod = res.headers.get("last-modified") || (await Deno.stat(new URL(my_fetch))).mtime?.getTime().toString();
    if (res.headers.get("etag")) {
      response.header("etag", res.headers.get("etag") || "");
    } else if (lastMod) {      
      const key = btoa(lastMod);
      response.header("last-modified", lastMod);
      response.header("etag", `W/"${key}"`);
    }
    if (request.headers.get("if-none-match") === response.header("etag")) {
      return response.status(304).send();
    }
    if (request.headers.get("range")) {
      response.header("Accept-Ranges", "bytes");
    }
    const ext = my_fetch.substring(my_fetch.lastIndexOf(".") + 1);
    response.header("Content-Type", mime.getType(ext.split("?")[0]));
    const reader = readerFromStreamReader(res.body.getReader());
    const body = await readAll(reader);
    response.header("x-powered-by", "NHttp Deno");
    return response.send(body);
  } catch (error) {
    return next();
  }
}