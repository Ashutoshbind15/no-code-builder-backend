#!/usr/bin/env node
import { build } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

const rootArg = process.argv[2] || "./app";
const outDir = "./output/app";

const root = resolve(process.cwd(), rootArg);
const output = resolve(process.cwd(), outDir);

await build({
    root,
    plugins: [solid({ ssr: false }), tailwindcss()],
    build: {
        outDir: output,
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(root, "index.html")
        }
    }
});

console.log(`✅  SolidJS bundle ready → ${output}`);