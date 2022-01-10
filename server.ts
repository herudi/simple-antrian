import { NHttp } from "./deps.ts";
import getAudios from "./get_audio.ts";
import { loadAssets, loadTemplate } from "./load_files.ts";

const app = new NHttp();

app.get("/", async (rev) => {
  return await loadTemplate(rev, "/index.html");
});
app.get("/display/:key", async (rev) => {
  return await loadTemplate(rev, "/display.html");
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

app.post("/send/:key", ({ body, response, params }) => {
  const channel = new BroadcastChannel(params.key);
  const { no, counter } = body;
  const counters = counter ? [ "counter", ...getAudios(counter) ] : [];
  channel.postMessage({
    no,
    counter,
    audios: [ "in", "antrian", ...getAudios(no), ...counters]
  });
  return response.status(201).send({ message: "success", status: 201 })
});

app.get("*", loadAssets);

app.listen(8080);