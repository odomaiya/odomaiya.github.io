const API_URL="https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";
let produtos=[];
let carrinho={};

function money(v){
return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

async function carregar(){
const r=await fetch(API_URL+"?acao=produtos");
produtos=await r.json();
render();
}

function render(){
const grid=document.getElementById("produtos");
grid.innerHTML="";

produtos.forEach(p=>{
const preco=p.promocao>0?p.promocao:p.preco;
const baixo=p.estoque>0 && p.estoque<10;

const card=document.createElement("div");
card.className="produto"+(p.promocao>0?" promo":"")+(baixo?" quase":"");

card.innerHTML=`
${baixo?'<div class="badge">Poucas unidades</div>':''}
<h3>${p.nome}</h3>
<p>${money(preco)}</p>
<button onclick="add('${p.nome}')">Adicionar</button>
`;

grid.appendChild(card);
});
}

function add(nome){
carrinho[nome]=(carrinho[nome]||0)+1;
atualizar();
}

function atualizar(){
let total=0;
let html="";
Object.keys(carrinho).forEach(n=>{
if(carrinho[n]>0){
const p=produtos.find(x=>x.nome===n);
const preco=p.promocao>0?p.promocao:p.preco;
total+=preco*carrinho[n];
html+=`<p>${n} x${carrinho[n]}</p>`;
}
});
document.getElementById("itensCarrinho").innerHTML=html;
document.getElementById("valorTotal").innerText=money(total);
document.getElementById("contadorCarrinho").innerText=
Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function abrirCarrinho(){
document.getElementById("carrinho").classList.add("ativo");
document.getElementById("carrinhoBackdrop").classList.add("ativo");
}

function fecharCarrinho(){
document.getElementById("carrinho").classList.remove("ativo");
document.getElementById("carrinhoBackdrop").classList.remove("ativo");
}

function abrirCheckout(){
document.getElementById("modalCheckout").style.display="flex";

document.getElementById("checkoutConteudo").innerHTML=`
<h3>Finalizar Pedido</h3>

<input type="text" id="cliente" placeholder="Nome">

<select id="tipo" onchange="toggleEntrega()">
<option value="retirada">Retirada</option>
<option value="entrega">Entrega</option>
</select>

<div id="areaEntrega" style="display:none;">
<input type="text" id="cep" placeholder="CEP">
<input type="text" id="rua" placeholder="Rua">
<input type="text" id="numero" placeholder="Número">
<input type="text" id="cidade" placeholder="Cidade">
</div>

<select id="pagamento">
<option value="Pix">Pix</option>
<option value="Cartão">Cartão</option>
<option value="Dinheiro">Dinheiro</option>
</select>

<div class="sugestao">
✨ Você pode incluir uma promoção especial antes de finalizar.
</div>

<button onclick="finalizar()">Enviar Pedido</button>
`;

document.getElementById("cep").addEventListener("input",buscarCEP);
}

function toggleEntrega(){
const tipo=document.getElementById("tipo").value;
document.getElementById("areaEntrega").style.display=
tipo==="entrega"?"block":"none";
}

async function buscarCEP(e){
let cep=e.target.value.replace(/\D/g,'');
if(cep.length===8){
const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
const d=await r.json();
document.getElementById("rua").value=d.logradouro||"";
document.getElementById("cidade").value=d.localidade||"";
}
}

/* SUA MENSAGEM EXATA */
function finalizar(){
let total=0;
let msg="✨ *Novo Pedido Odòmáiyà* ✨\n\n";
msg+="👤 Cliente: "+document.getElementById("cliente").value+"\n";
msg+="📦 Tipo: "+document.getElementById("tipo").value+"\n";
msg+="💳 Pagamento: "+document.getElementById("pagamento").value+"\n\n";

if(document.getElementById("tipo").value==="entrega"){
msg+=`\n📍 Endereço: ${document.getElementById("rua").value}, ${document.getElementById("numero").value}, ${document.getElementById("cidade").value}`;
}else{
msg+=`\n📍 Retirada na loja`;
}

msg+="\n\n🛍️ Itens:\n";

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

document.addEventListener("DOMContentLoaded",carregar);
