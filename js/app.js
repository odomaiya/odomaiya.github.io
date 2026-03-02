document.addEventListener("DOMContentLoaded",()=>{
UI.init();

if("serviceWorker" in navigator){
navigator.serviceWorker.register("sw.js");
}
});
