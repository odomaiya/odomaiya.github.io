const API_URL="https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos=[];
let carrinho={};
let categoriaAtual="Todos";
let listaAtual=[];

function money(v){
return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

/* ===== CARREGAMENTO ULTRA RÁPIDO ===== */

async function carregar(){

// 🔥 1) Carrega cache instantâneo
const cache = localStorage.getItem("produtos_odomaia");
if(cache){
produtos = JSON.parse(cache);
organizarProdutos();
criarCategorias();
render(produtos);
}

// 🔥 2) Atualiza em segundo plano
try{
const r=await fetch(API_URL+"?acao=produtos",{cache:"no-store"});
const dados=await r.json();

produtos=dados;
localStorage.setItem("produtos_odomaia",JSON.stringify(dados));

organizarProdutos();
criarCategorias();
render(produtos);

}catch(e){
console.log("Erro ao atualizar produtos");
}
}

function organizarProdutos(){
produtos.sort((a,b)=>
(b.promocao>0)-(a.promocao>0)||
a.nome.localeCompare(b.nome)
);
}

/* ===== RENDER ===== */

function render(lista){
listaAtual=lista;

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

render(listaAtual.length?listaAtual:produtos);
}

/* ===== CARRINHO ===== */

function atualizarCarrinho(){
let total=0;
let html="";

Object.keys(carrinho).forEach(nome=>{
if(carrinho[nome] > 0){

const produto = produtos.find(p=>p.nome===nome);
if(!produto) return;

const preco = produto.promocao > 0 ? Number(produto.promocao) : Number(produto.preco);
const subtotal = preco * carrinho[nome];

total += subtotal;

html += `
<div style="margin-bottom:10px;border-bottom:1px solid #eee;padding-bottom:8px">
<strong>${nome}</strong><br>
${carrinho[nome]}x ${money(preco)}<br>
Subtotal: ${money(subtotal)}
</div>
`;
}
});

document.getElementById("itensCarrinho").innerHTML =
html || "<p style='opacity:0.6'>Seu carrinho está vazio</p>";

document.getElementById("valorTotal").innerText = money(total);

document.getElementById("contadorCarrinho").innerText =
Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function abrirCarrinho(){
document.getElementById("carrinho").classList.toggle("ativo");
}

/* ===== CATEGORIAS ===== */

function criarCategorias(){
const categorias = ["Todos", ...new Set(produtos.map(p=>p.categoria))];

const area = document.getElementById("categorias");
area.innerHTML="";

categorias.forEach(cat=>{
const btn = document.createElement("button");
btn.innerText = cat;

btn.onclick = ()=>{
categoriaAtual = cat;

if(cat === "Todos"){
render(produtos);
}else{
render(produtos.filter(p=>p.categoria === cat));
}
};

area.appendChild(btn);
});
}

/* ===== PWA INSTALL AVISO ===== */

let deferredPrompt;

window.addEventListener("beforeinstallprompt",(e)=>{
e.preventDefault();
deferredPrompt=e;
mostrarAvisoInstalacao();
});

function mostrarAvisoInstalacao(){
if(localStorage.getItem("instalacao_visto")) return;

const aviso=document.createElement("div");
aviso.style.cssText=`
position:fixed;
bottom:20px;
left:20px;
right:20px;
background:#0077cc;
color:white;
padding:15px;
border-radius:14px;
box-shadow:0 10px 30px rgba(0,0,0,0.2);
z-index:9999;
text-align:center;
`;

const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);

aviso.innerHTML=isIOS?
`📲 Para instalar no iPhone:<br>
Toque em <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b>`
:
`📲 Instale o app para abrir mais rápido<br>
<button id="instalarBtn" style="margin-top:8px;padding:8px 14px;border:none;border-radius:8px;background:white;color:#0077cc;font-weight:bold">Instalar</button>`;

document.body.appendChild(aviso);

if(!isIOS){
document.getElementById("instalarBtn").onclick=()=>{
deferredPrompt.prompt();
localStorage.setItem("instalacao_visto","1");
aviso.remove();
};
}

setTimeout(()=>{
aviso.remove();
localStorage.setItem("instalacao_visto","1");
},10000);
}

carregar();
