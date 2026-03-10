/* CONFIG */

const CONFIG = {

API:"https://script.google.com/macros/s/AKfycby6ebTA-y3EvSlwgpeHqiYEL6ilzbVK0nhQUycNXc5QbRoXXhQmPbvg3tEh_5JQIdI0/exec",

WHATSAPP:"5554996048808"

}

/* STATE */

const STATE = {

produtos:[],
cart:{}

}

/* UTILS */

function money(v){

return "R$ " + Number(v).toFixed(2)

}

/* API */

async function carregarProdutos(){

const r = await fetch(CONFIG.API)

const data = await r.json()

STATE.produtos = data

renderProdutos()

}

/* PRODUTOS */

function renderProdutos(){

const grid = document.getElementById("produtos")

if(!grid) return

grid.innerHTML=""

STATE.produtos.forEach((p,i)=>{

let cls="card"

if(p.promocao==="true") cls+=" promo"

if(p.estoque<10) cls+=" lowstock"

const el=document.createElement("div")

el.className=cls

el.innerHTML=`

<img src="${p.imagem}" loading="lazy">

<h3>${p.nome}</h3>

<p>${money(p.preco)}</p>

<button onclick="addCart(${i})">Adicionar</button>

`

grid.appendChild(el)

})

}

/* CARRINHO */

function addCart(i){

const p = STATE.produtos[i]

if(!STATE.cart[p.nome]){

STATE.cart[p.nome]={...p,qty:1}

}else{

STATE.cart[p.nome].qty++

}

renderCart()

}

function renderCart(){

const box=document.getElementById("cartItems")

const totalEl=document.getElementById("cartTotal")

const count=document.getElementById("cartCount")

if(!box) return

box.innerHTML=""

let total=0

let qtd=0

Object.values(STATE.cart).forEach(p=>{

const subtotal=p.preco*p.qty

total+=subtotal

qtd+=p.qty

box.innerHTML+=`

<div>

${p.nome}

<button onclick="changeQty('${p.nome}',-1)">-</button>

${p.qty}

<button onclick="changeQty('${p.nome}',1)">+</button>

</div>

`

})

totalEl.textContent=money(total)

count.textContent=qtd

}

function changeQty(nome,n){

STATE.cart[nome].qty+=n

if(STATE.cart[nome].qty<=0) delete STATE.cart[nome]

renderCart()

}

/* CHECKOUT */

function abrirCheckout(){

document.getElementById("checkout").classList.remove("hidden")

}

/* WHATSAPP */

function finalizarPedido(){

let nome=document.getElementById("clienteNome").value

let tipo=document.getElementById("tipoEntrega").value

let pagamento=document.getElementById("formaPagamento").value

let rua=document.getElementById("rua").value

let numero=document.getElementById("numero").value

let cidade=document.getElementById("cidade").value

let total=0

let msg=""

msg+="🛒 NOVO PEDIDO - ODÒMÁIYÀ\n\n"

msg+="👤 Cliente: "+nome+"\n"

msg+="📅 Data: "+new Date().toLocaleString()+"\n"

msg+="📦 Tipo: "+tipo+"\n"

msg+="💳 Pagamento: "+pagamento+"\n\n"

if(tipo==="entrega"){

msg+="📍 Endereço de entrega\n"

msg+=rua+", "+numero+"\n"+cidade+"\n\n"

}else{

msg+="📍 Retirada na loja\n\n"

}

msg+="🛍️ Itens\n"

Object.values(STATE.cart).forEach(p=>{

const subtotal=p.preco*p.qty

total+=subtotal

msg+=`• ${p.nome} ${p.qty}x ${money(p.preco)}\n`

})

msg+=`\n💰 Total: ${money(total)}\n`

const url="https://wa.me/"+CONFIG.WHATSAPP+"?text="+encodeURIComponent(msg)

window.open(url)

}

/* INIT */

document.addEventListener("DOMContentLoaded",()=>{

carregarProdutos()

})
