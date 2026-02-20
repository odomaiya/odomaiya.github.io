const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

fetch(csvUrl)
.then(res => res.text())
.then(text => {
const linhas = text.split("\n").slice(1);
produtos = linhas.map(l => {
const c = l.split(",");
return {
nome: c[0],
preco: parseFloat(c[1]),
categoria: c[2],
estoque: parseInt(c[3]),
imagem: c[4]
};
});
renderizar(produtos);
});

function renderizar(lista){
const area = document.getElementById("produtos");
area.innerHTML = "";

lista.forEach(p=>{
area.innerHTML += `
<div class="card">
<img src="${p.imagem}" loading="lazy">
<h4>${p.nome}</h4>
<p class="estoque">Restam ${p.estoque} unidades</p>
<p class="preco">R$ ${p.preco.toFixed(2)}</p>
<div class="controle">
<button onclick="alterarQtd('${p.nome}',-1)">-</button>
<button onclick="alterarQtd('${p.nome}',1)">+</button>
</div>
</div>
`;
});

gsap.from(".card",{opacity:0,y:30,stagger:0.1});
}

function alterarQtd(nome,qtd){
const prod = produtos.find(p=>p.nome===nome);
if(!prod) return;

let item = carrinho.find(i=>i.nome===nome);

if(!item && qtd>0){
carrinho.push({nome:prod.nome,preco:prod.preco,qtd:1});
}
else if(item){
item.qtd += qtd;
if(item.qtd<=0){
carrinho = carrinho.filter(i=>i.nome!==nome);
}
}

atualizarCarrinho();
}

function atualizarCarrinho(){
const area = document.getElementById("itensCarrinho");
area.innerHTML="";
let total=0;

carrinho.forEach(i=>{
const sub = i.qtd*i.preco;
total+=sub;
area.innerHTML+=`
<p>${i.nome} (${i.qtd}) - R$ ${sub.toFixed(2)}
<button onclick="removerItem('${i.nome}')">❌</button></p>
`;
});

document.getElementById("total").innerText="Total: R$ "+total.toFixed(2);
document.getElementById("contador").innerText=carrinho.reduce((a,b)=>a+b.qtd,0);
}

function removerItem(nome){
carrinho = carrinho.filter(i=>i.nome!==nome);
atualizarCarrinho();
}

function finalizarPedido(){
let mensagem="✨ Pedido Odòmáiyà ✨%0A%0A🛍️ Itens:%0A%0A";
let total=0;

carrinho.forEach(i=>{
const sub=i.qtd*i.preco;
total+=sub;
mensagem+=`• ${i.nome}%0A   Quantidade: ${i.qtd}%0A   Subtotal: R$ ${sub.toFixed(2)}%0A%0A`;
});

mensagem+=`💰 Total: R$ ${total.toFixed(2)}%0A%0A📲 Aguardo confirmação e forma de pagamento.`;

window.open(`https://wa.me/5554996048808?text=${mensagem}`);
}
