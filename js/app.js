/* CONFIG */

const CONFIG = {

API:"https://script.google.com/macros/s/AKfycby6ebTA-y3EvSlwgpeHqiYEL6ilzbVK0nhQUycNXc5QbRoXXhQmPbvg3tEh_5JQIdI0/exec",

WHATSAPP:"5554996048808"

}

}

/* STATE GLOBAL */

const STATE = {

produtos:[],
filtrados:[],
cart:{}

}

/* UTILS */

const Utils = {

money(v){
return "R$ "+Number(v).toFixed(2)
}

}

/* API */

async function carregarProdutos(){

const r = await fetch(CONFIG.API)

const data = await r.json()

STATE.produtos = data

STATE.filtrados = data

renderProdutos()

}

/* RENDER */

function renderProdutos(){

const grid = document.getElementById("products")

if(!grid)return

grid.innerHTML=""

STATE.filtrados.forEach((p,i)=>{

let cls="card"

if(p.promocao=="true") cls+=" promo"

if(p.estoque<10) cls+=" lowstock"

const card=document.createElement("div")

card.className=cls

let badge=""

if(p.promocao=="true")
badge+=`<span class="badge promo">🔥 PROMO</span>`

if(p.estoque<10)
badge+=`<span class="badge stock">⚠ Estoque baixo</span>`

card.innerHTML=`

${badge}

<img src="${p.imagem}" loading="lazy">

<h3>${p.nome}</h3>

<p>${Utils.money(p.preco)}</p>

<button onclick="addCart(${i})">Adicionar</button>

`

grid.appendChild(card)

})

}

/* BUSCA */

document.addEventListener("input",e=>{

if(e.target.id==="search"){

const q=e.target.value.toLowerCase()

STATE.filtrados=STATE.produtos.filter(p=>
p.nome.toLowerCase().includes(q)
)

renderProdutos()

}

})

/* CARRINHO */

function addCart(i){

const p=STATE.produtos[i]

if(!STATE.cart[p.nome]){

STATE.cart[p.nome]={...p,qty:1}

}else{

STATE.cart[p.nome].qty++

}

renderCart()

}

function renderCart(){

const box=document.getElementById("cartItems")
const total=document.getElementById("total")

if(!box)return

box.innerHTML=""

let soma=0

Object.values(STATE.cart).forEach(p=>{

soma+=p.preco*p.qty

box.innerHTML+=`

<div>

${p.nome}

x${p.qty}

</div>

`

})

total.textContent=Utils.money(soma)

}

/* CHECKOUT */

document.addEventListener("click",e=>{

if(e.target.id==="checkout"){

let msg="🛒 Novo pedido%0A%0A"

let total=0

Object.values(STATE.cart).forEach(p=>{

msg+=`Produto: ${p.nome}%0AQuantidade: ${p.qty}%0AValor: ${p.preco}%0A%0A`

total+=p.preco*p.qty

})

msg+=`Total: ${total}`

window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${msg}`)

}

})

/* PARTICLES */

function particles(){

const canvas=document.getElementById("particles")
if(!canvas)return

const ctx=canvas.getContext("2d")

canvas.width=innerWidth
canvas.height=innerHeight

let parts=[]

for(let i=0;i<60;i++){

parts.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:2
})

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

parts.forEach(p=>{

ctx.beginPath()
ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
ctx.fillStyle="rgba(255,255,255,.3)"
ctx.fill()

})

requestAnimationFrame(draw)

}

draw()

}

/* INIT */

document.addEventListener("DOMContentLoaded",()=>{

carregarProdutos()

particles()

})
