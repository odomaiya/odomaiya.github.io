let produtos=[]
let carrinho=[]


async function carregarProdutos(){

const data=await api("listar")

produtos=data

renderProdutos(produtos)

}

function renderProdutos(lista){

const div=document.getElementById("produtos")

div.innerHTML=""

lista.forEach(p=>{

div.innerHTML+=`

<div class="produto">

<img src="${p.imagem}" loading="lazy">

<h3>${p.nome}</h3>

<p>${p.descricao}</p>

<div class="preco">

R$ ${p.preco}

</div>

<button onclick='addCarrinho(${JSON.stringify(p)})'>

Adicionar

</button>

</div>

`

})

}


function addCarrinho(p){

const item=carrinho.find(i=>i.nome==p.nome)

if(item){

item.qtd++

}else{

p.qtd=1
carrinho.push(p)

}

UI.atualizarCarrinho()

}

const UI={

toggleCart(){

document.getElementById("cartDrawer")
.classList.toggle("open")

},

atualizarCarrinho(){

const div=document.getElementById("cartItems")

div.innerHTML=""

let total=0

carrinho.forEach(p=>{

total+=p.preco*p.qtd

div.innerHTML+=`

<div>

${p.nome} x${p.qtd}

</div>

`

})

document.getElementById("cartTotal")
.innerText="R$ "+total.toFixed(2)

document.getElementById("cartCount")
.innerText=carrinho.length

}

}


const CHECKOUT={

abrir(){

document.getElementById("checkoutModal")
.style.display="flex"

},

finalizar(){

const nome=document.getElementById("cliente").value

const pagamento=document.getElementById("pagamento").value

const tipo=document.getElementById("tipoPedido").value

const rua=document.getElementById("rua").value
const numero=document.getElementById("numero").value
const cidade=document.getElementById("cidade").value

let msg="✨ *NOVO PEDIDO — Odòmáiyà* ✨\n\n"

msg+="👤 Cliente: "+nome+"\n\n"

msg+="📦 Tipo: "+tipo+"\n\n"

if(tipo=="entrega"){

msg+="📍 Endereço:\n"
msg+=rua+", "+numero+"\n"
msg+=cidade+"\n\n"

}

msg+="💳 Pagamento: "+pagamento+"\n\n"

msg+="🛍 Itens\n\n"

let total=0

carrinho.forEach(p=>{

msg+=p.nome+" x"+p.qtd+"\n"

total+=p.preco*p.qtd

})

msg+="\n💰 Total: R$ "+total.toFixed(2)

const url="https://wa.me/554996048808?text="+encodeURIComponent(msg)

window.open(url)

}

}

carregarProdutos()
