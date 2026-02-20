const csvURL="https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos=[];
let carrinho=[];

async function carregarProdutos(){
const res=await fetch(csvURL);
const texto=await res.text();
const linhas=texto.split("\n").slice(1);

produtos=linhas.map(l=>{
const col=l.split(",");
return{
nome:col[0],
preco:parseFloat(col[1]),
imagem:col[2],
categoria:col[3],
estoque:parseInt(col[4])
}
});

renderizar();
popularCategorias();
}

function renderizar(lista=produtos){
const container=document.getElementById("produtos");
container.innerHTML="";

lista.forEach(p=>{
container.innerHTML+=`
<div class="card">
<img src="${p.imagem}" onclick="abrirModal('${p.imagem}')">
<div class="card-content">
<h3>${p.nome}</h3>
<div class="preco">R$ ${p.preco.toFixed(2)}</div>
<div class="estoque">${p.estoque<=3?"🔥 Restam poucas unidades":"Em estoque"}</div>
<div class="qtd-controls">
<button onclick="alterarQtd('${p.nome}',-1)">-</button>
<button onclick="alterarQtd('${p.nome}',1)">+</button>
</div>
</div>
</div>
`;
});
}

function alterarQtd(nome,delta){
let item=carrinho.find(i=>i.nome===nome);
const prod=produtos.find(p=>p.nome===nome);

if(!prod) return;

if(item){
item.qtd+=delta;
if(item.qtd<=0){
carrinho=carrinho.filter(i=>i.nome!==nome);
}
}else if(delta>0){
carrinho.push({nome,preco:prod.preco,qtd:1});
}

atualizarCarrinho();
}

function atualizarCarrinho(){
document.getElementById("contador").innerText=
carrinho.reduce((a,b)=>a+b.qtd,0);

let html="";
let total=0;

carrinho.forEach(i=>{
total+=i.preco*i.qtd;
html+=`<p>${i.nome} x${i.qtd} - R$ ${(i.preco*i.qtd).toFixed(2)}</p>`;
});

document.getElementById("itensCarrinho").innerHTML=html;
document.getElementById("total").innerText=`Total: R$ ${total.toFixed(2)}`;
}

function toggleCarrinho(){
document.getElementById("carrinho").classList.toggle("ativo");
}

function toggleEndereco(){
const tipo=document.getElementById("tipoEntrega").value;
document.getElementById("campoEndereco").style.display=
tipo==="Entrega"?"block":"none";
}

function finalizarPedido(){
if(carrinho.length===0){
alert("Seu carrinho está vazio.");
return;
}

const nome=document.getElementById("clienteNome").value.trim();
const tipoEntrega=document.getElementById("tipoEntrega").value;
const endereco=document.getElementById("clienteEndereco").value.trim();
const pagamento=document.getElementById("formaPagamento").value;
const obs=document.getElementById("observacoes").value.trim();

if(!nome || !tipoEntrega || !pagamento){
alert("Preencha nome, tipo de pedido e forma de pagamento.");
return;
}

if(tipoEntrega==="Entrega" && !endereco){
alert("Informe o endereço completo.");
return;
}

let texto="✨ Pedido Odòmáiyà ✨\n\n🛍️ Itens:\n\n";
let total=0;

carrinho.forEach(i=>{
const subtotal=i.preco*i.qtd;
total+=subtotal;

texto+=`• ${i.nome}\n   Quantidade: ${i.qtd}\n   Valor unitário: R$ ${i.preco.toFixed(2)}\n   Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
});

texto+=`💰 Total dos itens: R$ ${total.toFixed(2)}\n\n`;
texto+=`👤 Cliente: ${nome}\n`;
texto+=`📦 Tipo: ${tipoEntrega}\n`;

if(tipoEntrega==="Entrega"){
texto+=`📍 Endereço: ${endereco}\n🚚 Taxa será confirmada.\n`;
}

texto+=`💳 Pagamento: ${pagamento}\n`;

if(obs){
texto+=`📝 Observações: ${obs}\n`;
}

texto+="\nAguardo confirmação. 🧿";

window.open("https://wa.me/5554996048808?text="+encodeURIComponent(texto));
}

function abrirModal(src){
document.getElementById("modal").style.display="flex";
document.getElementById("modalImg").src=src;
}

function fecharModal(){
document.getElementById("modal").style.display="none";
}

function scrollProdutos(){
document.querySelector(".produtos-section").scrollIntoView({behavior:"smooth"});
}

function popularCategorias(){
let select=document.getElementById("categoriaFiltro");
select.innerHTML="<option value=''>Categorias</option>";
let cats=[...new Set(produtos.map(p=>p.categoria))];
cats.forEach(c=>{
select.innerHTML+=`<option value="${c}">${c}</option>`;
});
}

document.getElementById("busca").addEventListener("input",e=>{
let v=e.target.value.toLowerCase();
renderizar(produtos.filter(p=>p.nome.toLowerCase().includes(v)));
});

document.getElementById("categoriaFiltro").addEventListener("change",e=>{
let v=e.target.value;
if(!v) renderizar();
else renderizar(produtos.filter(p=>p.categoria===v));
});

document.getElementById("ordenar").addEventListener("change",e=>{
if(e.target.value==="menor") renderizar([...produtos].sort((a,b)=>a.preco-b.preco));
if(e.target.value==="maior") renderizar([...produtos].sort((a,b)=>b.preco-a.preco));
});

carregarProdutos();
