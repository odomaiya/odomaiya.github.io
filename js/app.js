const API_URL="https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

const VERSAO_ATUAL="1.3";

if(localStorage.getItem("versaoSite")!==VERSAO_ATUAL){
  localStorage.setItem("versaoSite",VERSAO_ATUAL);
  window.location.reload(true);
}

let produtos=[];
let carrinho={};
let categoriaAtual="Todos";

function money(v){
return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

async function carregar(){
const r=await fetch(API_URL+"?acao=produtos");
produtos=await r.json();

produtos.sort((a,b)=>
(b.promocao>0)-(a.promocao>0)||
a.nome.localeCompare(b.nome)
);

criarCategorias();
aplicarFiltro();
}

function aplicarFiltro(){
if(categoriaAtual==="Todos"){
render(produtos);
}else{
render(produtos.filter(p=>p.categoria===categoriaAtual));
}
}

function render(lista){
const grid=document.getElementById("produtos");
grid.innerHTML="";

lista.forEach(p=>{
const preco=p.promocao>0?p.promocao:p.preco;

const card=document.createElement("div");
card.className="produto"+(p.promocao>0?" promo":"");

card.innerHTML=`
<img src="${p.imagem}">
<h4>${p.nome}</h4>
<p>${money(preco)}</p>
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

aplicarFiltro();
}

function atualizarCarrinho(){
let total=0;
let html="";

Object.keys(carrinho).forEach(nome=>{
if(carrinho[nome]>0){
const produto=produtos.find(p=>p.nome===nome);
if(!produto) return;

const preco=produto.promocao>0?Number(produto.promocao):Number(produto.preco);
const subtotal=preco*carrinho[nome];
total+=subtotal;

html+=`
<div style="margin-bottom:10px;border-bottom:1px solid #eee;padding-bottom:8px">
<strong>${nome}</strong><br>
${carrinho[nome]}x ${money(preco)}<br>
Subtotal: ${money(subtotal)}
</div>
`;
}
});

document.getElementById("itensCarrinho").innerHTML=
html||"<p style='opacity:0.6'>Seu carrinho está vazio</p>";

document.getElementById("valorTotal").innerText=money(total);

document.getElementById("contadorCarrinho").innerText=
Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function abrirCarrinho(){
document.getElementById("carrinho").classList.toggle("ativo");
}

function abrirCheckout(){
document.getElementById("modalCheckout").style.display="flex";

document.getElementById("checkoutConteudo").innerHTML=`
<h3>Seus Dados</h3>
<input id="cliente" placeholder="Seu nome" style="width:100%;padding:10px;margin:8px 0">

<h3>Entrega</h3>
<select id="tipo" style="width:100%;padding:10px;margin:8px 0">
<option value="retirada">Retirada na loja</option>
<option value="entrega">Entrega</option>
</select>

<div id="enderecoArea" style="display:none">
<input id="cep" placeholder="CEP" style="width:100%;padding:10px;margin:8px 0">
<input id="rua" placeholder="Rua" style="width:100%;padding:10px;margin:8px 0">
<input id="numero" placeholder="Número" style="width:100%;padding:10px;margin:8px 0">
<input id="cidade" placeholder="Cidade" style="width:100%;padding:10px;margin:8px 0">
</div>

<h3>Pagamento</h3>
<select id="pagamento" style="width:100%;padding:10px;margin:8px 0">
<option>Cartão</option>
<option>Dinheiro</option>
<option>Pix</option>
</select>

<button onclick="finalizar()" style="width:100%;padding:12px;background:#0077cc;color:white;border:none;border-radius:12px;margin-top:10px">
Enviar Pedido
</button>
`;

document.getElementById("tipo").onchange=function(){
document.getElementById("enderecoArea").style.display=
this.value==="entrega"?"block":"none";
};
}

function finalizar(){
let total=0;
let msg="✨ *Novo Pedido Odòmáiyà* ✨\n\n";

msg+="🛍️ Itens:\n";

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

function criarCategorias(){
const categorias=["Todos",...new Set(produtos.map(p=>p.categoria))];
const area=document.getElementById("categorias");
area.innerHTML="";

categorias.forEach(cat=>{
const btn=document.createElement("button");
btn.innerText=cat;

btn.onclick=()=>{
categoriaAtual=cat;
aplicarFiltro();
};

area.appendChild(btn);
});
}

/* BANNER INSTALAÇÃO */

function detectarInstalacao(){
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
const isAndroid=/android/i.test(navigator.userAgent);
const isStandalone=window.matchMedia('(display-mode: standalone)').matches;

if(isStandalone) return;
if(localStorage.getItem("installOculto")) return;

const banner=document.getElementById("installBanner");

if(isAndroid){
banner.innerHTML=`📲 Instale nosso app<br><br>Toque nos 3 pontinhos do navegador e depois em <b>"Adicionar à tela inicial"</b>.<br><br><button onclick="fecharInstall()" style="background:#0077cc;color:white;border:none;padding:8px 15px;border-radius:10px;">Entendi</button>`;
banner.style.display="block";
}

if(isIOS){
banner.innerHTML=`📲 Instale nosso app<br><br>Toque em <b>Compartilhar</b> e depois <b>"Adicionar à Tela de Início"</b>.<br><br><button onclick="fecharInstall()" style="background:#0077cc;color:white;border:none;padding:8px 15px;border-radius:10px;">Entendi</button>`;
banner.style.display="block";
}
}

function fecharInstall(){
document.getElementById("installBanner").style.display="none";
localStorage.setItem("installOculto",true);
}

window.addEventListener("load",detectarInstalacao);

carregar();
