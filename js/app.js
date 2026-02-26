const API_URL="SUA_API_AQUI";
let produtos=[];
let carrinho={};
let etapaAtual=1;

function money(v){
return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

async function carregar(){
const r=await fetch(API_URL+"?acao=produtos");
produtos=await r.json();
render(produtos);
}

function render(lista){
const grid=document.getElementById("produtos");
grid.innerHTML="";
lista.forEach(p=>{
const preco=p.promocao>0?p.promocao:p.preco;
const card=document.createElement("div");
card.className="produto";
card.innerHTML=`
<h3>${p.nome}</h3>
<p>${money(preco)}</p>
<p>Estoque: ${p.estoque}</p>
<div class="contador">
<button onclick="alterar('${p.nome}',-1)">−</button>
<span>${carrinho[p.nome]||0}</span>
<button onclick="alterar('${p.nome}',1)">+</button>
</div>
`;
grid.appendChild(card);
});
atualizarCarrinho();
}

function alterar(nome,v){
if(!carrinho[nome]) carrinho[nome]=0;
carrinho[nome]+=v;
if(carrinho[nome]<0) carrinho[nome]=0;
render(produtos);
}

function atualizarCarrinho(){
let total=0;
let html="";
Object.keys(carrinho).forEach(nome=>{
if(carrinho[nome]>0){
const p=produtos.find(x=>x.nome===nome);
const preco=p.promocao>0?p.promocao:p.preco;
const sub=preco*carrinho[nome];
total+=sub;
html+=`<p>${nome} (${carrinho[nome]}) - ${money(sub)}</p>`;
}
});
document.getElementById("itensCarrinho").innerHTML=html;
document.getElementById("valorTotal").innerText=money(total);
document.getElementById("contadorCarrinho").innerText=
Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function abrirCarrinho(){
document.getElementById("carrinho").classList.add("ativo");
document.getElementById("overlay").classList.add("ativo");
}

function fecharCarrinho(){
document.getElementById("carrinho").classList.remove("ativo");
document.getElementById("overlay").classList.remove("ativo");
}

function abrirCheckout(){
document.getElementById("modalCheckout").style.display="flex";
renderEtapa(1);
}

function renderEtapa(e){
etapaAtual=e;
const c=document.getElementById("checkoutConteudo");
c.innerHTML=`
<div class="checkout-steps">
<div class="step ${e>=1?'ativo':''}">1</div>
<div class="linha"></div>
<div class="step ${e>=2?'ativo':''}">2</div>
<div class="linha"></div>
<div class="step ${e>=3?'ativo':''}">3</div>
</div>
<div class="checkout-body">
${e===1?etapa1():''}
${e===2?etapa2():''}
${e===3?etapa3():''}
</div>`;
}

function etapa1(){
return `
<h3>Seus Dados</h3>
<input id="cliente" placeholder="Seu nome">
<div class="checkout-nav">
<button onclick="voltarCarrinho()">Voltar</button>
<button onclick="renderEtapa(2)">Continuar</button>
</div>`;
}

function etapa2(){
return `
<h3>Entrega</h3>
<select id="tipo">
<option>Retirada</option>
<option>Entrega</option>
</select>
<div class="checkout-nav">
<button onclick="renderEtapa(1)">Voltar</button>
<button onclick="renderEtapa(3)">Continuar</button>
</div>`;
}

function etapa3(){
return `
<h3>Pagamento</h3>
<select id="pagamento">
<option>Cartão</option>
<option>Pix</option>
<option>Dinheiro</option>
</select>
${sugestaoPremium()}
<div class="checkout-nav">
<button onclick="renderEtapa(2)">Voltar</button>
<button onclick="finalizar()">Enviar Pedido</button>
</div>`;
}
function inserirSugestaoCheckout(){
const sugestoes = produtos.filter(p=>p.promocao>0 || p.estoque<10);
if(sugestoes.length===0) return;

const s = sugestoes[0];

document.getElementById("sugestaoCheckout").innerHTML=`
<div class="sugestao-checkout">
<h4>✨ Você também pode incluir</h4>
<p><strong>${s.nome}</strong></p>
<p>${money(s.promocao>0?s.promocao:s.preco)}</p>
</div>
`;
}

function sugestaoPremium(){
const itens=Object.keys(carrinho).filter(n=>carrinho[n]>0);
if(itens.length===0) return "";
const sug=produtos.find(p=>!itens.includes(p.nome));
if(!sug) return "";
return `
<div class="sugestao-checkout">
<h4>✨ Você também pode gostar</h4>
<p>${sug.nome}</p>
<p>${money(sug.preco)}</p>
<button onclick="alterar('${sug.nome}',1)">Adicionar</button>
</div>`;
}

function finalizar(){
alert("Pedido enviado com energia e luz ✨");
location.reload();
}

function voltarCarrinho(){
document.getElementById("modalCheckout").style.display="none";
}

document.addEventListener("DOMContentLoaded",carregar);
function finalizar(){
let total=0;
let msg="✨ *Novo Pedido Odòmáiyà* ✨\n\n";

msg+="👤 Cliente: "+document.getElementById("cliente").value+"\n";
msg+="📦 Tipo: "+document.getElementById("tipo").value+"\n";
msg+="💳 Pagamento: "+document.getElementById("pagamento").value+"\n\n";

if(document.getElementById("tipo").value==="entrega"){
msg+=`\n📍 Endereço: ${document.getElementById("rua").value}, ${document.getElementById("numero").value}, ${document.getElementById("cidade").value}\n`;
}else{
msg+=`\n📍 Retirada na loja\n`;
}

msg+="\n🛍️ Itens:\n";

Object.keys(carrinho).forEach(n=>{
if(carrinho[n]>0){
const p=produtos.find(x=>x.nome===n);
const preco=p.promocao>0?p.promocao:p.preco;
total+=preco*carrinho[n];
msg+=`• ${n} x${carrinho[n]} — ${money(preco)}\n`;
}
});

msg+=`\n💰 Total: ${money(total)}\n`;

window.open("https://wa.me/555496048808?text="+encodeURIComponent(msg));
}
