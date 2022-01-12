import * as esbuild from 'https://deno.land/x/esbuild@v0.14.10/mod.js';

try { await Deno.remove('dist', { recursive: true }) } catch (_noop) {}
await esbuild.build({
    entryPoints:["./src/js/display.js", "./src/js/home.js"],
    minify: true,
    outdir: "./dist/js",
    format: "iife"
});
await esbuild.build({
    entryPoints:["./src/css/display.css", "./src/css/style.css"],
    minify: true,
    outdir: "./dist/css",
    loader: {
        ".css": "css"
    }
});
esbuild.stop();