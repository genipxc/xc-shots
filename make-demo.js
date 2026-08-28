#!/usr/bin/env node
/* make-demo.js — regenerates demo/index.html from the REAL app (index.html).
   Run after every frontend change: node make-demo.js
   The demo is the live app with the server stubbed out: seeded PT-studio data,
   realistic latency, in-memory localStorage (never touches a real client's
   device state), and demo-safe link/preview intercepts. */
const fs = require("fs");
const path = require("path");
const APP = path.join(__dirname, "index.html");
const OUT = path.join(__dirname, "demo", "index.html");

let html = fs.readFileSync(APP, "utf8");

// absolute asset paths (same as the /xc/ and /editor/ copies)
html = html
  .replace('href="manifest.webmanifest"', 'href="/manifest.webmanifest"')
  .replace('href="icon-192.png"', 'href="/icon-192.png"')
  .replace('href="apple-touch-icon.png"', 'href="/apple-touch-icon.png"')
  .replace("<title>XC Shots</title>", "<title>XC Shots — Demo</title>");

const DEMO = `
/* ═══════════════ DEMO MODE (injected by make-demo.js — do not edit demo/index.html by hand) ═══════════════ */
(function(){
  // sandbox localStorage so the demo NEVER touches a real client's saved code/state on this device
  const demoLS = { "xcs.code":"DEMO", "xcs.me":"Jess", "xcs.guided":"1" };
  LS.get = k => (("xcs."+k) in demoLS) ? demoLS["xcs."+k] : null;
  LS.set = (k,v) => { if(v===null) delete demoLS["xcs."+k]; else demoLS["xcs."+k] = String(v); };
  code = "DEMO"; me = "Jess"; pin = null;

  const SEED = {
    code:"DEMO", name:"Forge Performance", month:"2026-08", week:4, role:1,
    team:["Jess","Marco","Tay"],
    drive:"https://drive.google.com",
    shots:[
      {w:1,t:"wide", n:"The 6am class arriving",      h:"Doors open, people walking in, lights coming on.", d:"Class time", steps:["Stand at the back corner, phone level.","Start filming 30 seconds before the doors open.","Let people walk through frame — don't follow them."], dont:"Don't ask anyone to wave. Natural beats staged every time."},
      {w:1,t:"mid",  n:"Coach fixing a squat",        h:"Hands-on coaching moment, one member, real cue.",  d:"Any session", steps:["Film from the side so the squat depth is visible.","Get the coach's hands and the member in one frame.","Hold for a slow count of 20 — the fix is the story."], dont:"Don't interrupt the set to re-shoot. Catch the next one."},
      {w:1,t:"close",n:"Chalk hands close-up",        h:"Hands clapping chalk before a big lift.",          d:"PB attempts", steps:["Get within a metre — fill the screen with hands.","Film a 3-count before the clap so we have lead-in.","Keep the bar in the background if you can."], dont:"Don't use slow-mo — we do that in the edit."},
      {w:2,t:"mid",  n:"PB celebration",              h:"The moment after a personal best lands.",          d:"PB attempts", steps:["When someone's going for a PB, quietly start filming early.","Keep both the lifter and whoever's cheering in frame.","Let it run — the 10 seconds after the lift is the gold."], dont:"Don't cut the clip the second the bar drops."},
      {w:2,t:"close",n:"The whiteboard WOD",          h:"Today's workout on the board, marker in hand.",    d:"Before class", steps:["Film the coach writing the last two lines.","Get the marker squeak — sound matters here.","Finish on the full board, hold 5 seconds."], dont:"Don't film an empty board — we need the writing."},
      {w:2,t:"wide", n:"Banter between sets",         h:"Two or three members talking, laughing, resting.", d:"Any session", steps:["Film from across the room — long and unnoticed.","30 seconds minimum so we can cut around it.","Faces and laughter beat perfect framing."], dont:"Don't get close enough to change the vibe."},
      {w:3,t:"wide", n:"New member first session",    h:"A first-timer being shown around, first warm-up.", d:"Intro sessions", steps:["Ask them once at the start: 'ok if we film a bit?'","Catch the handshake / walk-around moment.","Then the first exercise attempt — nerves and all."], dont:"Don't film anyone who hasn't said yes."},
      {w:3,t:"mid",  n:"Sled push burnout",           h:"End-of-class finisher, effort on faces.",          d:"Class time", steps:["Kneel at the end of the sled lane, phone low.","Let them push TOWARD you — stop before they reach you.","Two or three pushes from the same spot is plenty."], dont:"Don't stand where they'll have to swerve."},
      {w:3,t:"close",n:"Protein shake ritual",        h:"Post-session shaker, gym logo visible.",           d:"After class", steps:["Counter-height, logo on the shaker facing the phone.","Film the scoop, the shake, the first sip.","Keep it under 30 seconds total."], dont:"Don't stage it with someone who doesn't drink them."},
      {w:4,t:"mid",  n:"Coach demo: deadlift setup",  h:"The coach teaching setup from the floor up.",      d:"Any session", steps:["Side-on, whole body in frame, bar visible.","Film the full demo — feet, grip, brace, pull.","Get the one-line cue they say every time."], dont:"Don't zoom mid-clip — pick a frame and hold it."},
      {w:4,t:"wide", n:"Member testimonial ask",      h:"One member, one question: 'why do you keep coming back?'", d:"After class", steps:["Quiet corner, gym visible behind them.","Ask the question OFF camera, let them answer to you.","One take is enough — real beats polished."], dont:"Don't hand them a script. Ever."},
      {w:4,t:"wide", n:"Empty gym, lights on",        h:"The room at rest — racks, chalk dust, quiet.",     d:"Open or close", steps:["Film a slow 10-second walk down the middle.","Keep the phone chest-height and steady.","One take at open, one at close — send both."], dont:"Don't tidy up first. The mess is the story."}
    ],
    by:{0:"Marco",1:"Jess",2:"Tay",3:"Marco",4:"Jess",5:"Jess",6:"Tay",7:"Marco",8:"Jess",9:"Jess"},
    received:{0:1,1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1},
    redo:{10:1},
    reasons:{10:"Bit dark — try again nearer the window. The question and the answer were perfect."},
    files:{},
    results:[
      {n:"PB celebration reel", v:18400, by:"Marco", wk:2},
      {n:"6am — doors open",    v:9600,  by:"Jess",  wk:1},
      {n:"Fix your squat in 20 seconds", v:6100, by:"Jess", wk:3}
    ],
    approved:[
      {id:"demo1", name:"2026-08-24 0930 — Sled finisher reel"},
      {id:"demo2", name:"2026-08-26 1600 — Coach cue: brace"}
    ],
    feedback:{ demo2:{v:"love", by:"Dana", at:1} },
    docs:[
      {label:"August invoice",     url:"https://buy.stripe.com/demo"},
      {label:"Service agreement",  url:"https://example.com/agreement"},
      {label:"July results report",url:"https://example.com/report"}
    ],
    weeks:[{done:3,total:3},{done:3,total:3},{done:3,total:3},{done:1,total:3}],
    history:[{month:"2026-07", done:11, total:12, views:41300, top:{n:"Member transformation — 12 weeks", v:15200}}],
    activity:[
      {at:new Date(Date.now()-6*86400000).toISOString(),  who:"Marco", what:"filmed “Sled push burnout”"},
      {at:new Date(Date.now()-5*86400000).toISOString(),  who:"XC",    what:"approved “Sled finisher reel”"},
      {at:new Date(Date.now()-4*86400000).toISOString(),  who:"Dana",  what:"loved a reel"},
      {at:new Date(Date.now()-3*86400000).toISOString(),  who:"Jess",  what:"filmed “Coach demo: deadlift setup”"},
      {at:new Date(Date.now()-2*86400000).toISOString(),  who:"XC",    what:"asked for a redo on “Member testimonial ask”"},
      {at:new Date(Date.now()-3600000*5).toISOString(),   who:"XC",    what:"updated the documents"}
    ]
  };
  let demoState = JSON.parse(JSON.stringify(SEED));
  const snap = () => Object.assign({ok:true}, JSON.parse(JSON.stringify(demoState)));
  const delay = () => new Promise(r => setTimeout(r, 200 + Math.random()*300));
  function route(p){
    const a = p.action;
    if(a === "ping") return {ok:true, v:"demo"};
    if(a === "hello") return {ok:true, code:demoState.code, name:demoState.name, team:demoState.team};
    if(a === "tick"){ demoState.by[p.idx] = p.by || "Someone"; delete demoState.redo[p.idx]; delete demoState.reasons[p.idx]; return snap(); }
    if(a === "untick"){ delete demoState.by[p.idx]; return snap(); }
    if(a === "feedback"){ demoState.feedback[p.fileId] = {v:p.verdict, note:p.note||"", by:p.by||"You", at:Date.now()}; return snap(); }
    if(a === "teamAdd"){ if(p.name && demoState.team.indexOf(p.name) === -1) demoState.team.push(p.name); return snap(); }
    if(a === "teamRemove"){ demoState.team = demoState.team.filter(n => n !== p.name); return snap(); }
    return snap();   // state + anything else → current state
  }
  apiGet  = async p => { inflight++; syncUI("busy"); await delay(); inflight--; syncUI("live"); return route(p); };
  apiPost = async b => { inflight++; syncUI("busy"); await delay(); inflight--; syncUI("live"); return route(b); };
  warm = () => {};   // no real server to wake

  // demo-safe intercepts
  upload = () => toast("In the real app this opens your studio's <b>Drive drop folder</b> — film, upload, done.");
  openPreview = () => toast("In the real app the reel <b>plays right here</b>.");
  document.addEventListener("click", e => {
    const a = e.target.closest("#ovDocs a");
    if(a){ e.preventDefault(); toast("In the real app this opens the actual document — invoices are <b>pay-online</b>, one tap."); }
  }, true);

  // ribbon
  const bar = document.createElement("div");
  bar.innerHTML = 'SAMPLE STUDIO — every number in here is demo data · <a href="https://xcmedia.co" style="color:var(--gold);text-decoration:none;font-weight:700">get this for your business ↗</a>';
  bar.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:60;background:rgba(10,10,10,.92);backdrop-filter:blur(6px);border-top:1px solid var(--hair);color:var(--dim);font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;text-align:center;padding:9px 14px;";
  document.body.appendChild(bar);
})();
`;

const marker = "\nboot();\n</script>";
if (!html.includes(marker)) { console.error("marker not found — index.html structure changed"); process.exit(1); }
html = html.replace(marker, "\n" + DEMO + "\nboot();\n</script>");

fs.writeFileSync(OUT, html);
console.log("demo/index.html regenerated —", (html.length/1024).toFixed(1) + "KB");
