/* XC Shots service worker — instant app-shell launch from the home screen.
   Strategy: stale-while-revalidate for same-origin GETs + Google Fonts.
   Serves the cached shell immediately, fetches the fresh copy behind it —
   so a deploy lands on the SECOND open after it ships.
   The Apps Script API (script.google.com) and Drive thumbnails are never
   intercepted — they always go straight to the network. */
const V = "xcs-shell-v2";
const SHELL = ["/", "/index.html", "/logo.png", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/manifest.webmanifest"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.searchParams.has("nosw")) return;   // version probe from the app — always straight to the network
  const sameOrigin = url.origin === self.location.origin;
  const fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !fonts) return;
  e.respondWith((async () => {
    const cache = await caches.open(V);
    // navigations keyed by bare path so "/?xc" and "/#xc" hit the cached page
    const key = req.mode === "navigate" ? new Request(url.origin + url.pathname) : req;
    const cached = await cache.match(key);
    const fresh = fetch(req)
      .then(r => { if (r && (r.ok || r.type === "opaque")) cache.put(key, r.clone()); return r; })
      .catch(() => null);
    return cached || (await fresh) || new Response("Offline — open again when you're connected.", { status: 503, headers: { "Content-Type": "text/plain" } });
  })());
});
