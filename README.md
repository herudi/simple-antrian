# Simple Antrian
Aplikasi antrian simple dengan suara. dibuat dengan menggunakan [Deno](https://deno.land).

[![Deploy](https://deno.com/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://raw.githubusercontent.com/herudi/simple-antrian/master/server.ts)


## Kebutuhan
- [Deno 1.17.x](https://deno.land/)

## Fitur

- multi display
- Nomor antrian dan loket/konter
- Real time. menggunakan Server Sent Event. bukan interval.
- Cache audio. (suara load lebih cepat jika di download).

## Batasan

- Suara sampe 999.
- tidak pake database.
- tidak ada login user (untuk keamanan buat nama display se-unik mungkin).

## Run
### Development
```bash
deno run -A --unstable server.ts --development
```
### Production
```bash
deno run -A --unstable server.ts
```
## Build

```bash
deno run -A --unstable build.ts
```

open in http://localhost:8080/

## Demo

https://antrian.deno.dev

> Demo tidak untuk di pakai sehari2. silahkan deploy sendiri.

[![Deploy](https://deno.com/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://raw.githubusercontent.com/herudi/simple-antrian/master/server.ts)

## Note
It's fun project. PRs welcome :).
