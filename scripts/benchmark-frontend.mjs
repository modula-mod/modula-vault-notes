#!/usr/bin/env node
import {readFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {performance} from "node:perf_hooks";
import {renderFrontendPreview} from "../../modula-product-standard/packages/product-frontend/dist/preview.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const artifactPath = resolve(root, "frontend/frontend.manifest.json");

const parseStarted = performance.now();
const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
const bootstrapMs = performance.now() - parseStarted;

function measure(path) {
  const started = performance.now();
  for (let index = 0; index < 1000; index += 1) renderFrontendPreview(artifact, path);
  return (performance.now() - started) / 1000;
}

console.log(JSON.stringify({
  artifactBytes: readFileSync(artifactPath).byteLength,
  bootstrapParseMs: Number(bootstrapMs.toFixed(3)),
  notesListPreviewMs: Number(measure("/").toFixed(4)),
  searchPreviewMs: Number(measure("/search").toFixed(4)),
  noteOpenPreviewMs: Number(measure("/note/note-1").toFixed(4)),
  editorPreviewMs: Number(measure("/note/note-1/edit").toFixed(4)),
}, null, 2));
