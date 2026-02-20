const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

fetch(sheetURL)
.then(res=>res.text())
.then(csv=>{
const linhas = csv.split("\n").slice(1);
produtos = linhas.map(l=>{
const col = l.split(",");
return{
nome: col[0],
preco: parseFloat(col[1]),
categoria: col[2],
imagem: col[3],
estoque: parseInt(col[4])
}
});
renderProdutos();
criarCategorias();
});

function renderProdutos(filtro=""){
const container = document.getElementById("produtos");
container.innerHTML="";
produtos
.filter(p=>p.nome.toLowerCase().includes(filtro.toLowerCase()))
.forEach(p=>{
container.innerHTML+=`
<div class="card">
<img src="${p.imagem}" alt="${p.nome}">
<h4>${p.nome}</h4>
<p>R$ ${p.preco.toFixed(2)}</p>
<div class="estoque">Restam ${p.estoque} unidades</div>
<button class="btn-add" onclick="addCarrinho('${p.nome}')">Adicionar</button>
</div>`;
});
}

function criarCategorias(){
let categorias = [...new Set(produtos.map(p=>p.categoria))].sort();
let menu = document.getElementById("menuCategorias");
categorias.forEach(cat=>{
menu.innerHTML+=`<a href="#" onclick="filtrarCategoria('${cat}')">${cat}</a>`;
});
}

function filtrarCategoria(cat){
renderProdutos("");
produtos = produtos.filter(p=>p.categoria===cat);
renderProdutos();
}

function addCarrinho(nome){
let prod = produtos.find(p=>p.nome===nome);
if(prod.estoque<=0) return alert("Produto esgotado");

let item = carrinho.find(i=>i.nome===nome);
if(item){
item.qtd++;
}else{
carrinho.push({nome:prod.nome,preco:prod.preco,qtd:1});
}
prod.estoque--;
renderProdutos();
renderCarrinho();
}

function renderCarrinho(){
let lista = document.getElementById("listaCarrinho");
lista.innerHTML="";
let total=0;
carrinho.forEach(item=>{
total+=item.preco*item.qtd;
lista.innerHTML+=`
<div class="item-carrinho">
${item.nome} x${item.qtd}
<div class="controls">
<button onclick="alterarQtd('${item.nome}',-1)">-</button>
<button onclick="alterarQtd('${item.nome}',1)">+</button>
<button onclick="remover('${item.nome}')">x</button>
</div>
</div>`;
});
document.getElementById("total").innerText=total.toFixed(2);
}

function alterarQtd(nome,delta){
let item = carrinho.find(i=>i.nome===nome);
let prod = produtos.find(p=>p.nome===nome);
if(!item) return;

if(delta===1 && prod.estoque<=0) return;
item.qtd+=delta;
prod.estoque-=delta;

if(item.qtd<=0) remover(nome);

renderProdutos();
renderCarrinho();
}

function remover(nome){
let item = carrinho.find(i=>i.nome===nome);
let prod = produtos.find(p=>p.nome===nome);
prod.estoque+=item.qtd;
carrinho=carrinho.filter(i=>i.nome!==nome);
renderProdutos();
renderCarrinho();
}

document.getElementById("busca").addEventListener("input",e=>{
renderProdutos(e.target.value);
});

function abrirCheckout(){
document.getElementById("checkoutModal").style.display="flex";
}
function fecharCheckout(){
document.getElementById("checkoutModal").style.display="none";
}

function enviarWhatsApp(){
let nome=document.getElementById("nome").value;
let tipo=document.getElementById("tipoEntrega").value;
let endereco=document.getElementById("endereco").value;
let pagamento=document.getElementById("pagamento").value;
let total=document.getElementById("total").innerText;

let lista=carrinho.map(p=>`- ${p.nome} x${p.qtd}`).join("%0A");

let msg=`✨ Pedido Odòmáiyà ✨%0A👤 Nome: ${nome}%0A📦 ${tipo}%0A📍 ${endereco}%0A💳 ${pagamento}%0A🛒 ${lista}%0A💰 Total R$ ${total}`;

window.open(`https://wa.me/55SEUNUMERO?text=${msg}`);
}
