const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

fetch(csvURL)
.then(res => res.text())
.then(data => {
const linhas = data.split("\n").slice(1);
produtos = linhas.map(l => {
const col = l.split(",");
return {
nome: col[0],
categoria: col[1],
preco: parseFloat(col[2]),
imagem: col[3]
}
});
renderProdutos(produtos);
});

function renderProdutos(lista){
const container = document.getElementById("produtos");
container.innerHTML="";
lista.forEach((p,i)=>{
container.innerHTML+=`
<div class="card">
<img src="${p.imagem}">
<h4>${p.nome}</h4>
<div class="preco">R$ ${p.preco.toFixed(2)}</div>
<div class="qtd">
<button onclick="alterarQtd(${i},-1)">-</button>
<span>${getQtd(p.nome)}</span>
<button onclick="alterarQtd(${i},1)">+</button>
</div>
</div>
`;
});
}

function alterarQtd(index,valor){
const produto = produtos[index];
let item = carrinho.find(i=>i.nome===produto.nome);

if(!item && valor>0){
carrinho.push({...produto,quantidade:1});
}
else if(item){
item.quantidade+=valor;
if(item.quantidade<=0){
carrinho = carrinho.filter(i=>i.nome!==produto.nome);
}
}
renderCarrinho();
renderProdutos(produtos);
}

function getQtd(nome){
let item = carrinho.find(i=>i.nome===nome);
return item?item.quantidade:0;
}

function renderCarrinho(){
let total=0;
const div=document.getElementById("itensCarrinho");
div.innerHTML="";
carrinho.forEach(p=>{
let subtotal=p.preco*p.quantidade;
total+=subtotal;
div.innerHTML+=`
<p>${p.nome} x${p.quantidade}<br>
R$ ${subtotal.toFixed(2)}</p>
`;
});
document.getElementById("total").innerText="Total: R$ "+total.toFixed(2);
}

function finalizarPedido(){
if(carrinho.length===0)return alert("Seu carrinho está vazio.");

let nome=document.getElementById("nomeCliente").value;
let entrega=document.getElementById("tipoEntrega").value;
let endereco=document.getElementById("endereco").value;
let pagamento=document.getElementById("pagamento").value;
let obs=document.getElementById("obs").value;

let mensagem="✨ Pedido Odòmáiyà ✨\n\n🛍️ Itens:\n\n";

let total=0;

carrinho.forEach(p=>{
let subtotal=p.preco*p.quantidade;
total+=subtotal;
mensagem+=`• ${p.nome}\nQuantidade: ${p.quantidade}\nSubtotal: R$ ${subtotal.toFixed(2)}\n\n`;
});

mensagem+=`💰 Total do Pedido: R$ ${total.toFixed(2)}\n\n`;
mensagem+=`👤 Cliente: ${nome}\n`;
mensagem+=`📦 Entrega: ${entrega}\n`;

if(entrega==="Entrega"){
mensagem+=`🏠 Endereço: ${endereco}\n`;
mensagem+="🚚 Lembrar: valor da taxa de entrega será informado.\n";
}

mensagem+=`💳 Pagamento: ${pagamento}\n`;

if(obs){
mensagem+=`📝 Observações: ${obs}\n`;
}

window.open(`https://wa.me/555496048808?text=${encodeURIComponent(mensagem)}`,"_blank");
}
