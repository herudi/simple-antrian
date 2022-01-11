import { Handler, mime } from "./deps.ts";

const rand = crypto.randomUUID();

const getFiles: Handler = async (rev, next) => {
  try {
    const { url, response, request, path_file } = rev;
    const pathfile = path_file || ("./public" + url);
    const stats = await Deno.stat(pathfile);
    const ext = pathfile.substring(pathfile.lastIndexOf(".") + 1);
    response.header("content-type", mime.getType(ext));
    if (stats.mtime) response.header("Last-Modified", stats.mtime.toUTCString());
    response.header("ETag", `W/"${stats.size}-${stats.mtime?.getTime() || rand}"`);
    if (request.headers.get("if-none-match") === response.header("ETag")) {
      return response.status(304).send()
    }
    response.header("x-powered-by", "NHttp Deno");
    return await Deno.readFile(pathfile);
  } catch (error) {
    return next();
  }
}

export default getFiles;