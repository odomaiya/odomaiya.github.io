const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec"

let produtos = []
let carrinho = []
let categoriaAtiva = "Todos"

document.addEventListener("DOMContentLoaded",()=>{
buscarProdutos()
document.getElementById("busca").addEventListener("input",renderProdutos)
document.getElementById("filtroCategoria").addEventListener("change",e=>{
categoriaAtiva = e.target.value
renderProdutos()
})
document.getElementById("tipo").addEventListener("change",e=>{
document.getElementById("enderecoArea").style.display =
e.target.value === "entrega" ? "block" : "none"
})
})

async function buscarProdutos(){
const res = await fetch(API_URL)
produtos = await res.json()
criarCategorias()
renderProdutos()
}

function criarCategorias(){
const categorias = ["Todos",...new Set(produtos.map(p=>p.categoria))]
const container = document.getElementById("categorias")
const select = document.getElementById("filtroCategoria")

container.innerHTML=""
select.innerHTML=""

categorias.forEach(cat=>{
const btn=document.createElement("button")
btn.textContent=cat
btn.onclick=()=>{
categoriaAtiva=cat
document.querySelectorAll(".categorias button").forEach(b=>b.classList.remove("ativo"))
btn.classList.add("ativo")
select.value=cat
renderProdutos()
}
if(cat==="Todos") btn.classList.add("ativo")
container.appendChild(btn)

const option=document.createElement("option")
option.value=cat
option.textContent=cat
select.appendChild(option)
})
}

function renderProdutos(){
const termo=document.getElementById("busca").value.toLowerCase()
const grid=document.getElementById("produtos")
grid.innerHTML=""

produtos
.filter(p=>
(categoriaAtiva==="Todos"||p.categoria===categoriaAtiva) &&
p.nome.toLowerCase().includes(termo)
)
.forEach(p=>{
const div=document.createElement("div")
div.className="produto"

if(p.promocao) div.classList.add("glow-promo")
if(p.estoque<=3) div.classList.add("glow-estoque")

div.innerHTML=`
<img src="${p.imagem}">
<h4>${p.nome}</h4>
<div class="preco ${p.promocao?'promo':''}">
R$ ${p.preco}
</div>
<small>Estoque: ${p.estoque}</small>
<button class="btn-add" onclick='adicionar(${JSON.stringify(p)})'>
Adicionar
</button>
`
grid.appendChild(div)
})
}

function adicionar(p){
carrinho.push(p)
atualizarCarrinho()
}

function atualizarCarrinho(){
document.getElementById("contadorCarrinho").textContent=carrinho.length
const area=document.getElementById("itensCarrinho")
area.innerHTML=""
let total=0

carrinho.forEach((p,i)=>{
total+=Number(p.preco)
area.innerHTML+=`
<div class="item">
${p.nome}
<span>R$ ${p.preco}</span>
</div>
`
})

document.getElementById("valorTotal").textContent=
"R$ "+total.toFixed(2)
}

function abrirCarrinho(){
document.getElementById("carrinho").classList.add("aberto")
}

function fecharCarrinho(){
document.getElementById("carrinho").classList.remove("aberto")
}

function abrirCheckout(){
document.getElementById("modalCheckout").style.display="flex"
}

function proximaEtapa(n){
document.querySelectorAll(".etapa").forEach(e=>e.classList.remove("ativa"))
document.getElementById("etapa"+n).classList.add("ativa")
document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"))
document.getElementById("step"+n).classList.add("active")
}

function voltarEtapa(n){
proximaEtapa(n)
}

async function finalizar(){
const dados={
cliente:document.getElementById("cliente").value,
telefone:document.getElementById("telefone").value,
tipo:document.getElementById("tipo").value,
pagamento:document.getElementById("pagamento").value,
itens:carrinho
}

await fetch(API_URL,{
method:"POST",
body:JSON.stringify(dados)
})

alert("Pedido enviado com sucesso!")
location.reload()
}
