let carrinho = []

async function carregarProdutos(){

const produtos = await apiRequest("listarProdutos")

const grid = document.getElementById("produtos")

grid.innerHTML=""

produtos.forEach((p,i)=>{

const card = document.createElement("div")

card.className="produto"

card.innerHTML=`

<img src="${p[4]}" class="produto-img">

<h3>${p[0]}</h3>

<p class="preco">R$ ${Number(p[1]).toFixed(2)}</p>

<button onclick="addCarrinho(${i},
'${p[0]}',
${p[1]} )">

Adicionar
</button>

`

grid.appendChild(card)

})

}

function addCarrinho(id,nome,preco){

carrinho.push({
id,
nome,
preco,
qtd:1
})

alert("Produto adicionado")

}

function montarMensagem(){

let total=0

let itens=""

carrinho.forEach(p=>{

const subtotal=p.preco*p.qtd
total+=subtotal

itens+=`
🛍 ${p.nome}
Qtd: ${p.qtd}
💰 R$ ${subtotal.toFixed(2)}

`

})

const nome = document.getElementById("cliente_nome").value
const tipo = document.getElementById("tipo").value
const pagamento = document.getElementById("pagamento").value
const endereco = document.getElementById("endereco").value

let entrega=""

if(tipo==="entrega"){
entrega=`📍 Endereço:
${endereco}`
}

const msg=`

✨ *NOVO PEDIDO* ✨

👤 Cliente:
${nome}

${entrega}

🛒 *Itens do pedido*

${itens}

💳 Pagamento:
${pagamento}

💰 *Total: R$ ${total.toFixed(2)}*

🙏 Obrigado pela preferência
`

return encodeURIComponent(msg)

}

function enviarPedido(){

const msg = montarMensagem()

const numero = "554996048808"

window.open(`https://wa.me/${numero}?text=${msg}`)

}

carregarProdutos()

document.addEventListener("keydown",function(e){

if(e.ctrlKey && e.shiftKey && e.key==="1"){

window.location.href="odomaia/admin.html"

}

})

let clickLogo=0
let timer

const logo=document.getElementById("logo")

logo.addEventListener("touchstart",()=>{

timer=setTimeout(()=>{
clickLogo=0
},3000)

})

logo.addEventListener("click",()=>{

clickLogo++

if(clickLogo>=7){

window.location.href="odomaia/admin.html"

}

})
