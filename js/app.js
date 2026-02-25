const API_URL="https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos=[];
let carrinho={};
let categoriaAtual="Todos";

/* FORMATAR MOEDA */
function money(v){
return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

/* CARREGAR PRODUTOS */
async function carregar(){
try{
const r=await fetch(API_URL+"?acao=produtos",{cache:"no-store"});
produtos=await r.json();

produtos.sort((a,b)=>
(b.promocao>0)-(a.promocao>0)||
a.nome.localeCompare(b.nome)
);

criarCategorias();
aplicarFiltro();
}catch(e){
console.error("Erro ao carregar produtos",e);
}
}

/* FILTRO */
function aplicarFiltro(){
if(categoriaAtual==="Todos"){
render(produtos);
}else{
render(produtos.filter(p=>p.categoria===categoriaAtual));
}
}

/* RENDER GRID */
function render(lista){
const grid=document.getElementById("produtos");
grid.innerHTML="";

lista.forEach(p=>{
const preco=p.promocao>0?p.promocao:p.preco;

const card=document.createElement("div");
card.className="produto"+(p.promocao>0?" promo":"");

card.innerHTML=`
<img src="${p.imagem || 'https://via.placeholder.com/300x200?text=Produto'}">
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

/* ALTERAR QUANTIDADE */
function alterar(nome,v){
if(!carrinho[nome]) carrinho[nome]=0;
carrinho[nome]+=v;
if(carrinho[nome]<0) carrinho[nome]=0;
aplicarFiltro();
}

/* ATUALIZAR CARRINHO */
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
html || "<p style='opacity:0.6'>Seu carrinho está vazio</p>";

document.getElementById("valorTotal").innerText=money(total);

document.getElementById("contadorCarrinho").innerText=
Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function abrirCarrinho(){
document.getElementById("carrinho").classList.toggle("ativo");
}

/* CHECKOUT */
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

<button onclick="voltarCarrinho()" 
style="width:100%;padding:10px;margin-top:10px;background:#eee;border:none;border-radius:10px;cursor:pointer">
⬅ Voltar ao Carrinho
</button>

<button onclick="finalizar()" 
style="width:100%;padding:12px;background:#0077cc;color:white;border:none;border-radius:12px;margin-top:10px">
Enviar Pedido
</button>
`;

const tipoSelect=document.getElementById("tipo");
const enderecoArea=document.getElementById("enderecoArea");

tipoSelect.addEventListener("change",function(){
enderecoArea.style.display=this.value==="entrega"?"block":"none";
});

setTimeout(()=>{
const cepInput=document.getElementById("cep");
if(cepInput){
cepInput.addEventListener("blur",buscarCEP);
}
},200);

sugerirPromocaoInteligente();
}

/* SUGESTÃO INTELIGENTE PROFISSIONAL */
function sugerirPromocaoInteligente(){

let total=0;
let categoriasCarrinho={};

Object.keys(carrinho).forEach(nome=>{
if(carrinho[nome]>0){
const produto=produtos.find(p=>p.nome===nome);
if(produto){
categoriasCarrinho[produto.categoria]=(categoriasCarrinho[produto.categoria]||0)+carrinho[nome];
const preco=produto.promocao>0?Number(produto.promocao):Number(produto.preco);
total+=preco*carrinho[nome];
}
}
});

if(Object.keys(categoriasCarrinho).length===0) return;

const categoriaPrincipal=Object.keys(categoriasCarrinho)
.sort((a,b)=>categoriasCarrinho[b]-categoriasCarrinho[a])[0];

let oferta=null;

/* 1️⃣ Promoção da categoria */
let promocoes=produtos
.filter(p=>p.categoria===categoriaPrincipal && p.promocao>0 && !carrinho[p.nome])
.sort((a,b)=>Number(a.promocao)-Number(b.promocao));

if(promocoes.length>0) oferta=promocoes[0];

/* 2️⃣ Aumentar ticket se menor que 80 */
if(!oferta && total<80){
const barato=produtos
.filter(p=>!carrinho[p.nome])
.sort((a,b)=>{
const precoA=a.promocao>0?Number(a.promocao):Number(a.preco);
const precoB=b.promocao>0?Number(b.promocao):Number(b.preco);
return precoA-precoB;
});
if(barato.length>0) oferta=barato[0];
}

/* 3️⃣ Complemento inteligente */
if(!oferta){
const velas=produtos
.filter(p=>p.nome.toLowerCase().includes("vela") && !carrinho[p.nome])
.sort((a,b)=>{
const precoA=a.promocao>0?Number(a.promocao):Number(a.preco);
const precoB=b.promocao>0?Number(b.promocao):Number(b.preco);
return precoA-precoB;
});
if(velas.length>0) oferta=velas[0];
}

if(!oferta) return;

const precoFinal=oferta.promocao>0?oferta.promocao:oferta.preco;

document.getElementById("checkoutConteudo").innerHTML+=`
<div style="margin-top:20px;padding:15px;background:linear-gradient(135deg,#ffffff,#f0f8ff);border:1px solid #0077cc;border-radius:15px;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
✨ <b>Você pode aproveitar também:</b><br><br>
${oferta.nome}<br>
Por apenas <b style="color:#0077cc">${money(precoFinal)}</b><br><br>
<button onclick="adicionarPromo('${oferta.nome}')" style="padding:10px 14px;background:#0077cc;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:600;">
Adicionar ao pedido ✨
</button>
</div>
`;
}

function adicionarPromo(nome){
if(!carrinho[nome]) carrinho[nome]=0;
carrinho[nome]+=1;
atualizarCarrinho();
alert("✨ Oferta adicionada ao carrinho!");
}

function voltarCarrinho(){
document.getElementById("modalCheckout").style.display="none";
}

/* CEP */
async function buscarCEP(){
const cep=document.getElementById("cep").value.replace(/\D/g,'');
if(cep.length!==8) return;

try{
const response=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
const data=await response.json();
if(!data.erro){
document.getElementById("rua").value=data.logradouro||"";
document.getElementById("cidade").value=data.localidade||"";
}
}catch(error){
console.log("Erro ao buscar CEP",error);
}
}

/* FINALIZAR */
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

/* CATEGORIAS */
function criarCategorias(){
const categorias=["Todos",...new Set(produtos.map(p=>p.categoria))];
const area=document.getElementById("categorias");
area.innerHTML="";
categorias.forEach(cat=>{
const btn=document.createElement("button");
btn.innerText=cat;
btn.onclick=()=>{categoriaAtual=cat;aplicarFiltro();};
area.appendChild(btn);
});
}

carregar();

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}

/* ===================================== */
/* INSTALAÇÃO PWA PROFISSIONAL COMPLETA */
/* ===================================== */

let deferredPrompt = null;

/* Funções auxiliares */
function isIos(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode(){
  return ('standalone' in window.navigator) && window.navigator.standalone;
}

function criarBannerInstalacao(){
  let banner = document.getElementById("installBanner");

  if(!banner){
    banner = document.createElement("div");
    banner.id = "installBanner";
    banner.style.position = "fixed";
    banner.style.bottom = "20px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.background = "white";
    banner.style.padding = "18px";
    banner.style.borderRadius = "16px";
    banner.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
    banner.style.zIndex = "9999";
    banner.style.maxWidth = "90%";
    banner.style.textAlign = "center";
    banner.style.display = "none";
    document.body.appendChild(banner);
  }

  return banner;
}

/* ANDROID - Chrome */
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if(isInStandaloneMode()) return;

  const banner = criarBannerInstalacao();

  banner.innerHTML = `
    <div style="font-weight:600;font-size:16px;margin-bottom:10px;">
      📲 Instale o App Odòmáiyà
    </div>
    <button id="btnInstalarApp" style="
      padding:10px 18px;
      background:#0077cc;
      color:white;
      border:none;
      border-radius:10px;
      font-weight:600;
      cursor:pointer;
    ">
      Instalar Agora
    </button>
    <div style="margin-top:10px;font-size:12px;opacity:0.6;cursor:pointer;" onclick="this.parentElement.style.display='none'">
      Fechar
    </div>
  `;

  banner.style.display = "block";

  document.getElementById("btnInstalarApp").addEventListener("click", async () => {
    banner.style.display = "none";
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });
});

/* IOS - Safari */
window.addEventListener("load", () => {

  if(isIos() && !isInStandaloneMode()){

    const banner = criarBannerInstalacao();

    banner.innerHTML = `
      <div style="font-weight:600;font-size:16px;margin-bottom:10px;">
        📲 Instale o App Odòmáiyà
      </div>
      <div style="font-size:14px;margin-bottom:12px;">
        1️⃣ Toque no botão <b>Compartilhar</b><br>
        2️⃣ Depois toque em <b>Adicionar à Tela de Início</b>
      </div>
      <div style="font-size:12px;opacity:0.6;cursor:pointer;" onclick="this.parentElement.style.display='none'">
        Entendi
      </div>
    `;

    banner.style.display = "block";
  }

});
