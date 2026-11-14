#!/usr/bin/env node
// Encrypts private/plan.html into index.html (the public, locked page).
//
//   node tools/encrypt.mjs
//
// It asks for the code and never saves it anywhere. For scripts you can pass it
// in the PLAN_CODE environment variable instead. Needs Node 18+ and nothing else.

import { readFile, writeFile } from "node:fs/promises";
import { webcrypto as crypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import readline from "node:readline";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "private", "plan.html");
const TEMPLATE = path.join(ROOT, "tools", "lock-template.html");
const OUT = path.join(ROOT, "index.html");
const ITERATIONS = 600000;

function askHidden(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = s => { if (s.includes(question)) rl.output.write(question); else rl.output.write("*"); };
    rl.question(question, answer => { rl.output.write("\n"); rl.close(); resolve(answer.trim()); });
  });
}

let code = process.env.PLAN_CODE;
if (!code) {
  code = await askHidden("Code (digits only): ");
  const again = await askHidden("Type it again: ");
  if (code !== again) { console.error("The two codes don't match. Nothing was changed."); process.exit(1); }
}
if (!/^\d{4,12}$/.test(code)) { console.error("Use 4 to 12 digits."); process.exit(1); }

const plan = await readFile(SRC, "utf8");
const template = await readFile(TEMPLATE, "utf8");

const b64 = u8 => Buffer.from(u8).toString("base64");
let payload;
// Re-roll in the rare case the random output happens to contain the code as text.
do {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(code), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plan)));
  payload = JSON.stringify({ v: 1, len: code.length, iter: ITERATIONS, salt: b64(salt), iv: b64(iv), ct: b64(ct) });
} while (payload.includes(code));

await writeFile(OUT, template.replace("__PAYLOAD__", payload));
console.log(`Locked page written to index.html (${(payload.length / 1024).toFixed(0)} KB). The code was not saved anywhere.`);
