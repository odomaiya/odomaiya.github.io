self.addEventListener('install', e=>{
e.waitUntil(
caches.open('odomaia-v1').then(cache=>{
return cache.addAll([
'/',
'/index.html',
'/estilo.css',
'/app.js'
]);
})
);
});
