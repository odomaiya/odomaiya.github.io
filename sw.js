const CACHE="odomaiya-v1"

const ASSETS=[

"/",
"/index.html",
"/css/styles.css",
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

caches.match(e.request).then(r=>{

return r || fetch(e.request)

})

)

})
