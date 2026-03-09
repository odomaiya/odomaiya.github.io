const CACHE="odomaiya-v1"

const ASSETS=[
"/",
"/index.html",
"/css/style.css"
]

self.addEventListener("install",event=>{

 event.waitUntil(

  caches.open(CACHE).then(cache=>{
   return cache.addAll(ASSETS)
  })

 )

})

self.addEventListener("fetch",event=>{

 event.respondWith(

  caches.match(event.request).then(res=>{
   return res || fetch(event.request)
  })

 )

})
