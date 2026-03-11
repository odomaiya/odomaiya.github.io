document.addEventListener("DOMContentLoaded",()=>{

carregarProdutos()
adminSecreto()

})

async function carregarProdutos(){

const produtos = await listarProdutos()

const container = document.getElementById("produtos")

if(!container) return

container.innerHTML=""

produtos.forEach(p=>{

const card = document.createElement("div")

card.className="produto"

card.innerHTML = `

<img src="${p.imagem}" loading="lazy">

<h3>${p.nome}</h3>

<p class="preco">R$ ${p.preco}</p>

<button class="btn"
onclick='enviarWhatsApp(${JSON.stringify(p)})'>
Comprar
</button>

`

container.appendChild(card)

})

}

/**********************
ADMIN SECRETO
***********************/

function adminSecreto(){

const logo = document.getElementById("logo")

if(!logo) return

let clicks=0
let timer

logo.addEventListener("click",()=>{

clicks++

clearTimeout(timer)

timer=setTimeout(()=>{

clicks=0

},4000)

if(clicks>=15){

window.location.href="/odomaiya/admin.html"

}

})

}
