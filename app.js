const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

async function carregarProdutos(){
const res = await fetch(csvURL);
const texto = await res.text();
const linhas = texto.split("\n").slice(1);

produtos = linhas.map(l=>{
const col = l.split(",");
return {
nome: col[0],
preco: parseFloat(col[1]),
imagem: col[2],
categoria: col[3],
estoque: parseInt(col[4])
}
});

renderizar();
popularCategorias();
}

function renderizar(lista = produtos){
const container = document.getElementById("produtos");
container.innerHTML="";

lista.forEach(p=>{
container.innerHTML += `
<div class="card">
<img src="${p.imagem}" onclick="abrirModal('${p.imagem}')">
<div class="card-content">
<h3>${p.nome}</h3>
<div class="preco">R$ ${p.preco.toFixed(2)}</div>
<div class="estoque">Restam ${p.estoque} unidades</div>
<div class="qtd-controls">
<button onclick="adicionar('${p.nome}',${p.preco})">+</button>
<button onclick="remover('${p.nome}')">-</button>
</div>
</div>
</div>
`;
});
}

function adicionar(nome,preco){
let item = carrinho.find(i=>i.nome===nome);
if(item) item.qtd++;
else carrinho.push({nome,preco,qtd:1});
atualizarCarrinho();
}

function remover(nome){
carrinho = carrinho.filter(i=>i.nome!==nome);
atualizarCarrinho();
}

function atualizarCarrinho(){
document.getElementById("contador").innerText =
carrinho.reduce((a,b)=>a+b.qtd,0);

let html="";
let total=0;

carrinho.forEach(i=>{
total += i.preco*i.qtd;
html+=`<p>${i.nome} x${i.qtd}</p>`;
});

document.getElementById("itensCarrinho").innerHTML=html;
document.getElementById("total").innerText=`Total: R$ ${total.toFixed(2)}`;
}

function toggleCarrinho(){
document.getElementById("carrinho").classList.toggle("ativo");
}

function finalizarPedido(){
let texto="🧿 Pedido Odòmáiyà\n\n";
let total=0;

carrinho.forEach(i=>{
texto+=`• ${i.nome} x${i.qtd}\n`;
total+=i.preco*i.qtd;
});

texto+=`\n✨ Total: R$ ${total.toFixed(2)}\n\nAguardo confirmação e forma de pagamento.`;

window.open(`https://wa.me/5599999999999?text=${encodeURIComponent(texto)}`);
}

function abrirModal(src){
document.getElementById("modal").style.display="flex";
document.getElementById("modalImg").src=src;
}

function fecharModal(){
document.getElementById("modal").style.display="none";
}

function scrollProdutos(){
document.getElementById("produtos").scrollIntoView({behavior:"smooth"});
}

function popularCategorias(){
let select=document.getElementById("categoriaFiltro");
let cats=[...new Set(produtos.map(p=>p.categoria))];
cats.forEach(c=>{
select.innerHTML+=`<option value="${c}">${c}</option>`;
});
}

document.getElementById("busca").addEventListener("input",e=>{
let valor=e.target.value.toLowerCase();
renderizar(produtos.filter(p=>p.nome.toLowerCase().includes(valor)));
});

document.getElementById("categoriaFiltro").addEventListener("change",e=>{
let val=e.target.value;
if(!val) renderizar();
else renderizar(produtos.filter(p=>p.categoria===val));
});

document.getElementById("ordenar").addEventListener("change",e=>{
if(e.target.value==="menor") renderizar([...produtos].sort((a,b)=>a.preco-b.preco));
if(e.target.value==="maior") renderizar([...produtos].sort((a,b)=>b.preco-a.preco));
});

carregarProdutos();
