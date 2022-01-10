import { Handler, RequestEvent } from "./deps.ts";

const base_template = "./template";
const cType = {
  "css": "text/css; charset=utf-8",
  "wav": "audio/wav",
  "js": "application/javascript"
} as Record<string, string>;

export const loadTemplate = async ({ response, request }: RequestEvent, path: string) => {
  const pathfile = base_template + path;
  try {
    const stats = await Deno.stat(pathfile);
    response.type("text/html; charset=utf-8");
    if (stats.mtime) {
      response.header("Last-Modified", stats.mtime.toUTCString());
    }
    response.header("ETag", `W/"${stats.size}-${stats.mtime?.getTime()}"`);
    if (request.headers.get("if-none-match") === response.header("ETag")) {
      return response.status(304).send();
    }
    let body = await Deno.readTextFile(pathfile);
    return response.send(body);
  } catch (err) {
    return response.status(err.status || 500).send(err.message || 'Something went wrong');
  }
};

export const loadAssets: Handler = async ({ response, request, url, path }, next) => {
  try {
    const pathfile = "." + path;
    const stats = await Deno.stat("." + url);
    response.type(cType[pathfile.substring(pathfile.lastIndexOf(".") + 1)]);
    if (stats.mtime) {
      response.header("Last-Modified", stats.mtime.toUTCString());
    }
    response.header("ETag", `W/"${stats.size}-${stats.mtime?.getTime()}"`);
    if (request.headers.get("if-none-match") === response.header("ETag")) {
      return response.status(304).send();
    }
    const body = await Deno.readFile(pathfile);
    return response.send(body);
  } catch (err) {
    return next();
  }
};
