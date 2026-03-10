document.addEventListener("DOMContentLoaded",()=>{

const box=document.getElementById("adminProdutos")

if(!box) return

STATE.produtos.forEach(p=>{

const el=document.createElement("div")

el.textContent=p.nome+" | estoque: "+p.estoque

box.appendChild(el)

})

})
