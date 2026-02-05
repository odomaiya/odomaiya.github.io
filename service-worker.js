self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("odomaia").then(c =>
      c.addAll(["./","index.html","css/style.css","js/app.js"])
    )
  );
});
