const CACHE="odomaia-v3"

const ASSETS=[

"/",
"/index.html",
"/produto.html",

"/css/style.css",
"/css/animations.css",

"/js/app.js",

"/logo.png"

]

self.addEventListener("install",e=>{

 e.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(ASSETS))
 )

})

self.addEventListener("fetch",e=>{

 e.respondWith(
  caches.match(e.request).then(r=>r||fetch(e.request))
 )

})
