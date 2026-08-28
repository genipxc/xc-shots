#!/usr/bin/env node
/* push-shots.js — load a shot-list template into a real client in one command.
   Usage: node push-shots.js <STUDIO-CODE> <XC-PIN> [template.json]
   Default template: pt-shot-list.json. The backend creates/renames the client's
   drop folders to match, so run it AFTER the client exists (Add client in /xc/). */
const fs = require("fs");
const path = require("path");
const API = "https://script.google.com/macros/s/AKfycbxpz2wQHgci9lUEG9KPAk-fUxk2VmyY1cRUhfHfwnSHc6z6QJifVcpEWt0W275wyGz8/exec";

const [code, pin, file] = process.argv.slice(2);
if (!code || !pin) { console.error("Usage: node push-shots.js <STUDIO-CODE> <XC-PIN> [template.json]"); process.exit(1); }
const shots = JSON.parse(fs.readFileSync(path.join(__dirname, file || "pt-shot-list.json"), "utf8"));
console.log(`Pushing ${shots.length} shots to ${code.toUpperCase()}…`);

fetch(API, { method: "POST", redirect: "follow", headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify({ action: "shots", pin, code: code.toUpperCase(), shots }) })
  .then(r => r.json())
  .then(d => {
    if (!d.ok) { console.error("FAILED:", d.error); process.exit(1); }
    console.log(`✅ ${d.name}: ${d.shots.length} shots live. Weeks: ${[1,2,3,4].map(w => d.shots.filter(s => s.w === w).length).join("/")}`);
  })
  .catch(e => { console.error("Network error:", e.message); process.exit(1); });
