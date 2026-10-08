#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync} from "node:fs";
import {dirname, extname, join, relative, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const frontend = join(root, "frontend");
const entry = join(frontend, "index.tsx");

function sourceFiles(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap(entryValue => {
    const path = join(directory, entryValue.name);
    if (entryValue.isDirectory()) return entryValue.name === "tests" ? [] : sourceFiles(path);
    return [".ts", ".tsx"].includes(extname(path)) ? [path] : [];
  });
}

function resolveImport(from, request) {
  const base = resolve(dirname(from), request);
  return [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")].find(existsSync);
}

const files = sourceFiles(frontend);
const visited = new Set();
const queue = [entry];
while (queue.length) {
  const file = queue.shift();
  if (!file || visited.has(file)) continue;
  visited.add(file);
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
    const dependency = resolveImport(file, match[1]);
    if (!dependency) throw new Error(`Missing frontend import ${match[1]} from ${relative(root, file)}`);
    queue.push(dependency);
  }
}

const problems = [];
for (const file of files) {
  const source = readFileSync(file, "utf8");
  const lines = source.split(/\r?\n/).length;
  if (lines > 500 && !source.includes("architecture-review: cohesive-large-file")) problems.push(`${relative(root, file)} has ${lines} lines and needs architecture review`);
  if (!visited.has(file)) problems.push(`${relative(root, file)} is not reachable from frontend/index.tsx`);
  if (/from\s+["'](?:react|react-native|@mui|@chakra-ui|styled-components|@emotion|@radix-ui|@?shadcn)/.test(source)) problems.push(`${relative(root, file)} imports a forbidden raw UI framework`);
  if (/import\s+["'][^"']+\.css["']/.test(source)) problems.push(`${relative(root, file)} imports product CSS outside the semantic UI contract`);
}

const entrySource = readFileSync(entry, "utf8");
const entryLines = entrySource.split(/\r?\n/).length;
if (entryLines > 150) problems.push(`frontend/index.tsx has ${entryLines} lines; entrypoint limit is 150`);
if (/\b(?:function|screen|action|useRecords|useRecord|useForm)\b/.test(entrySource)) problems.push("frontend/index.tsx contains application or binding logic");

if (problems.length) throw new Error(problems.join("\n"));
console.log(JSON.stringify({entryLines, sourceFiles: files.length, reachableFiles: visited.size, maximumReviewedLines: 500}, null, 2));
