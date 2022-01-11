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
    if (request.headers.get("range")) {
      response.status(206);
      const start = 0;
      const end = stats.size - 1;
      if (start >= stats.size || end >= stats.size) {
        response.header("Content-Range", `bytes */${stats.size}`);
        return response.send();
      }
      response.header("Content-Range", `bytes ${start}-${end}/${stats.size}`);
      response.header("Content-Length", (end - start + 1).toString());
      response.header("Accept-Ranges", "bytes");
    }
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