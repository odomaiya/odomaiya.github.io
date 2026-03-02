document.addEventListener("DOMContentLoaded",()=>{
UI.init();

if("serviceWorker" in navigator){
navigator.serviceWorker.register("sw.js");
}
});
document.getElementById("tipo").addEventListener("change",e=>{
document.getElementById("endereco-box").style.display=
e.target.value==="entrega"?"block":"none"
})

document.getElementById("cep").addEventListener("input",async e=>{
if(e.target.value.length===8){
const r=await fetch(`https://viacep.com.br/ws/${e.target.value}/json/`)
const d=await r.json()
rua.value=d.logradouro
cidade.value=d.localidade
}
})
