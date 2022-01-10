# Simple Antrian
Aplikasi antrian simple lengkap dengan suara. dibuat dengan menggunakan [Deno](https://deno.land).

[![Deploy](https://deno.com/deno-deploy-button.svg)](https://raw.githubusercontent.com/herudi/simple-antrian/master/server.ts)


## Requirement
- [Deno 1.17.x](https://deno.land/)

## Features

- Nomor antrian
- Suara sampe 999
- Real time. menggunakan Server Sent Event. bukan interval.

## Run

```bash
deno run --allow-net --allow-read --unstable server.ts
```

open in http://localhost:8080/

## Demo

https://antrian.deno.dev/

## Note
It's fun project. PRs welcome :).
