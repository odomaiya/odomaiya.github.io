const CONFIG={
API:"https://script.google.com/macros/s/AKfycby6ebTA-y3EvSlwgpeHqiYEL6ilzbVK0nhQUycNXc5QbRoXXhQmPbvg3tEh_5JQIdI0/exec",
WHATSAPP:"5554996048808"
}

const STATE={
produtos:[],
carrinho:{}
}

async function carregarProdutos(){

const res=await fetch(CONFIG.API+"?action=produtos")
const data=await res.json()

STATE.produtos=data

renderProdutos(data)

}

function renderProdutos(lista){

const grid=document.getElementById("produtos")
grid.innerHTML=""

lista.forEach(p=>{

let classe="card"

if(p.promocao)classe+=" promo"
if(p.estoque<10)classe+=" estoque"

grid.innerHTML+=`
<div class="${classe}">

<img src="${p.imagem}" loading="lazy">

<h3>${p.nome}</h3>

<div class="preco">R$ ${p.preco}</div>

<button class="btn"
onclick="CART.add('${p.nome}')">
Adicionar
</button>

</div>
`

})

}

const CART={

add(nome){

if(!STATE.carrinho[nome])
STATE.carrinho[nome]=0

STATE.carrinho[nome]++

UI.updateCart()

},

remove(nome){

delete STATE.carrinho[nome]

UI.updateCart()

},

change(nome,q){

STATE.carrinho[nome]+=q

if(STATE.carrinho[nome]<=0)
delete STATE.carrinho[nome]

UI.updateCart()

}

}

const UI={

toggleCart(){

document
.getElementById("cartDrawer")
.classList
.toggle("cart-open")

},

updateCart(){

const el=document.getElementById("cartItems")
el.innerHTML=""

let total=0
let count=0

Object.keys(STATE.carrinho).forEach(n=>{

const p=STATE.produtos.find(x=>x.nome==n)

const qtd=STATE.carrinho[n]

const preco=p.promocao>0?p.promocao:p.preco

total+=preco*qtd
count+=qtd

el.innerHTML+=`

<div class="cart-item">

<div>${n}</div>

<div class="qty">

<button onclick="CART.change('${n}',-1)">-</button>

${qtd}

<button onclick="CART.change('${n}',1)">+</button>

</div>

</div>

`

})

document.getElementById("cartTotal").innerText="R$ "+total
document.getElementById("cartCount").innerText=count

}

}

const CHECKOUT={

abrir(){

document.getElementById("checkoutModal").style.display="flex"

},

async finalizar(){

const nome=document.getElementById("cliente").value
const tipo=document.getElementById("tipoPedido").value
const pagamento=document.getElementById("pagamento").value

let total=0

Object.keys(STATE.carrinho).forEach(n=>{

const p=STATE.produtos.find(x=>x.nome==n)
total+=p.preco*STATE.carrinho[n]

})

await fetch(CONFIG.API,{
method:"POST",
body:JSON.stringify({

action:"registrarVenda",
cliente:nome,
tipo:tipo,
pagamento:pagamento,
itens:JSON.stringify(STATE.carrinho),
total:total

})
})

let msg="🛒 NOVO PEDIDO - ODÒMÁIYÀ\n\n"

msg+="Cliente: "+nome+"\n"
msg+="Tipo: "+tipo+"\n"
msg+="Pagamento: "+pagamento+"\n\n"

msg+="Itens:\n"

Object.keys(STATE.carrinho).forEach(n=>{
msg+=n+" x"+STATE.carrinho[n]+"\n"
})

msg+="\nTotal: R$ "+total

window.open(
"https://wa.me/"+CONFIG.WHATSAPP+"?text="+encodeURIComponent(msg)
)

}

}

carregarProdutos()
