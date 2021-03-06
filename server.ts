import { Handler, NHttp } from "./deps.ts";
import getAudios from "./get_audio.ts";
import { getFiles, listFiles } from "./get_files.ts";

const dir = Deno.args.includes("--development") ? "./src" : "./dist";

const app = new NHttp();

const mutateDir: (prefix: string) => Handler = (prefix: string) => (rev, next) => {
  rev.base_file = prefix;
  return next();
}

app.get("/", async (rev, next) => {
  rev.path_file = "./src/html/index.html";
  return await getFiles(rev, next);
});

app.get("/display", async (rev, next) => {
  rev.path_file = "./src/html/display.html";
  return await getFiles(rev, next);
});

app.get("/sse/:key", ({ response, params }) => {
  const channel = new BroadcastChannel(params.key);
  const stream = new ReadableStream({
    start: (ctrl) => {
      channel.onmessage = (e) => {
        ctrl.enqueue(`data: ${JSON.stringify(e.data)}\n\n`);
      };
    },
    cancel() {
      channel.close();
    },
  });
  return response.header({
    "Connection": "Keep-Alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Keep-Alive": `timeout=${Number.MAX_SAFE_INTEGER}`,
  }).send(stream.pipeThrough(new TextEncoderStream()));
});

app.post("/send/:key", ({ body, response, params }, next) => {
  const channel = new BroadcastChannel(params.key);
  const { no, counter } = body;
  if (parseInt(no) > 1000) {
    return next(new Error('maaf, suara hanya sampe 999'));
  }
  const counters = counter ? ["counter", ...getAudios(counter)] : [];
  channel.postMessage({
    key: params.key,
    type: "display",
    data: {
      no,
      counter,
      audios: ["in", "antrian", ...getAudios(no), ...counters]
    }
  });
  return response.status(201).send({ message: "success", status: 201 })
});
app.post("/reset/:key", ({ response, params }) => {
  const channel = new BroadcastChannel(params.key);
  channel.postMessage({
    key: params.key,
    type: "reset",
    data: {}
  });
  return response.status(201).send({ message: "success", status: 201 })
});

app.get("/list-audios", _ => listFiles);

app.get("/public/*", mutateDir("./public"), getFiles);
app.get("/assets/*", mutateDir(dir), getFiles);

app.listen(8080);