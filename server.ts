import { NHttp, staticFiles } from "./deps.ts";
import getAudios from "./get_audio.ts";

const app = new NHttp();

app.use(staticFiles("public"));

app.get("/", async () => {
  return await Deno.readTextFile("./template/index.html");
});

app.get("/display/:key", async () => {
  return await Deno.readTextFile("./template/display.html");
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
    no,
    counter,
    audios: ["in", "antrian", ...getAudios(no), ...counters]
  });
  return response.status(201).send({ message: "success", status: 201 })
});

app.listen(8080);