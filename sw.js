const CACHE="odomaia-cache-v3"

const ASSETS=[
"./",
"./index.html",
"./produto.html",
"./css/style.css",
"./css/animations.css",
"./logo.png"
]

self.addEventListener("install",event=>{

event.waitUntil(
caches.open(CACHE)
.then(cache=>cache.addAll(ASSETS))
.catch(()=>{})
)

})

self.addEventListener("fetch",event=>{

event.respondWith(
caches.match(event.request)
.then(res=>res || fetch(event.request))
)

})
