document.addEventListener("DOMContentLoaded",()=>{

const list=document.getElementById("adminList")

if(!list)return

let promo=0
let stock=0

STATE.produtos.forEach(p=>{

if(p.promocao=="true") promo++

if(p.estoque<10) stock++

const div=document.createElement("div")

div.innerHTML=`
<strong>${p.nome}</strong>
Preço: ${p.preco}
Estoque: ${p.estoque}
`

list.appendChild(div)

})

document.getElementById("prodCount").textContent=STATE.produtos.length
document.getElementById("promoCount").textContent=promo
document.getElementById("stockCount").textContent=stock

})
