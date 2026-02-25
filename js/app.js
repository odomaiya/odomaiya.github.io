const API_URL="https://script.google.com/macros/s/AKfycbzHIIjVa9hQR_mUbpUwm_zgcooEAIpnZjlfCzZwJPmd11NUBB_MY3kpojme7BY_KYID/exec";

let produtos=[];
let carrinho={};
let categoriaAtual="Todos";

/* FORMATAR MOEDA */
function money(v){
return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

/* =========================
   CARREGAR PRODUTOS
========================= */
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

/* =========================
   FILTRO
========================= */
function aplicarFiltro(){
if(categoriaAtual==="Todos"){
render(produtos);
}else{
render(produtos.filter(p=>p.categoria===categoriaAtual));
}
}

/* =========================
   RENDER GRID
========================= */
function render(lista){
const grid=document.getElementById("produtos");
grid.innerHTML="";

lista.forEach(p=>{

const preco=p.promocao>0?p.promocao:p.preco;
const semEstoque = p.estoque <= 0;
const estoqueBaixo = p.estoque > 0 && p.estoque <= 3;

const card=document.createElement("div");
card.className="produto"
+(p.promocao>0?" promo":"")
+(semEstoque?" sem-estoque":"")
+(estoqueBaixo?" quase-esgotado":"");

card.innerHTML=`
<img src="${p.imagem || 'https://via.placeholder.com/300x200?text=Produto'}">
<h4>${p.nome}</h4>
<p>${money(preco)}</p>

${semEstoque ? 
`<p style="color:red;font-weight:600">❌ Sem estoque</p>` 
:
`
<p style="font-size:13px;opacity:0.75">
Estoque: ${p.estoque}
</p>

<div class="contador">
<button onclick="alterar('${p.nome}',-1)">−</button>
<span>${carrinho[p.nome]||0}</span>
<button onclick="alterar('${p.nome}',1)">+</button>
</div>
`
}
`;

grid.appendChild(card);
});

atualizarCarrinho();
}

/* =========================
   ALTERAR QUANTIDADE
========================= */
function alterar(nome,v){

const produto = produtos.find(p=>p.nome===nome);
if(!produto) return;

if(!carrinho[nome]) carrinho[nome]=0;

if(v>0 && carrinho[nome] >= produto.estoque){
alert("Quantidade máxima disponível em estoque.");
return;
}

carrinho[nome]+=v;

if(carrinho[nome]<0) carrinho[nome]=0;

aplicarFiltro();
}

/* =========================
   ATUALIZAR CARRINHO
========================= */
function atualizarCarrinho(){
let total=0;
let html="";

html+=`
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
<strong style="font-size:18px;">Seu Carrinho</strong>
<button onclick="fecharCarrinho()" style="background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
</div>
`;

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

if(Object.values(carrinho).reduce((a,b)=>a+b,0)===0){
html+="<p style='opacity:0.6'>Seu carrinho está vazio</p>";
}

document.getElementById("itensCarrinho").innerHTML=html;
document.getElementById("valorTotal").innerText=money(total);
document.getElementById("contadorCarrinho").innerText=
Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function abrirCarrinho(){
document.getElementById("carrinho").classList.toggle("ativo");
}

function fecharCarrinho(){
document.getElementById("carrinho").classList.remove("ativo");
}

/* =========================
   CHECKOUT
========================= */
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

<div id="sugestaoArea"></div>

<button onclick="voltarCarrinho()" 
style="width:100%;padding:10px;margin-top:10px;background:#eee;border:none;border-radius:10px;cursor:pointer">
⬅ Voltar ao Carrinho
</button>

<button onclick="finalizar()" 
style="width:100%;padding:12px;background:#0077cc;color:white;border:none;border-radius:12px;margin-top:10px">
Enviar Pedido
</button>
`;

setTimeout(()=>{

const tipoSelect=document.getElementById("tipo");
const enderecoArea=document.getElementById("enderecoArea");
const cepInput=document.getElementById("cep");

tipoSelect.addEventListener("change",function(){
enderecoArea.style.display=this.value==="entrega"?"block":"none";
});

if(cepInput){
cepInput.addEventListener("blur",buscarCEP);
}

},100);

sugerirPromocaoInteligente();
}

/* =========================
   SUGESTÃO INTELIGENTE
========================= */
function sugerirPromocaoInteligente(){

const itensNoCarrinho = Object.keys(carrinho).filter(n=>carrinho[n]>0);
if(itensNoCarrinho.length===0) return;

/* pega categorias do que já foi escolhido */
const categoriasSelecionadas = itensNoCarrinho.map(nome=>{
const prod = produtos.find(p=>p.nome===nome);
return prod?.categoria;
});

/* candidatos relacionados */
let sugestoes = produtos.filter(p=>

!itensNoCarrinho.includes(p.nome) &&   // não sugerir o mesmo
p.estoque > 0 &&                      // precisa ter estoque
(
categoriasSelecionadas.includes(p.categoria) ||  // mesma categoria
p.promocao > 0 ||                      // ou promoção
p.estoque >= 8                         // ou estoque alto (girar estoque)
)
);

/* prioriza promoção + melhor preço */
sugestoes.sort((a,b)=>{
return (b.promocao>0)-(a.promocao>0) ||
((a.promocao||a.preco)-(b.promocao||b.preco));
});

if(sugestoes.length===0) return;

const escolhido = sugestoes[0];

setTimeout(()=>{
alert(
"💡 Você também pode gostar:\n\n"+
escolhido.nome+
"\n"+money(escolhido.promocao>0?escolhido.promocao:escolhido.preco)+
(escolhido.promocao>0?" 🔥 Promoção!":"")
);
},700);
}

/* =========================
   CEP
========================= */
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
}catch(e){}
}

/* =========================
   FINALIZAR
========================= */
async function finalizar(){

let total=0;

const nome=document.getElementById("cliente").value.trim();
if(!nome){ alert("Informe seu nome."); return; }

Object.keys(carrinho).forEach(n=>{
if(carrinho[n]>0){
const p=produtos.find(x=>x.nome===n);
const preco=p.promocao>0?p.promocao:p.preco;
total+=preco*carrinho[n];
}
});

const dados={
cliente:nome,
telefone:"",
tipo:document.getElementById("tipo").value,
endereco:document.getElementById("rua")?.value || "",
pagamento:document.getElementById("pagamento").value,
itens:carrinho,
total:total
};

try{
await fetch(API_URL,{
method:"POST",
body:JSON.stringify(dados)
});

alert("Pedido enviado com sucesso!");
location.reload();

}catch(e){
alert("Erro ao enviar pedido.");
}
}

function voltarCarrinho(){
document.getElementById("modalCheckout").style.display="none";
}

function criarCategorias(){ /* mantido igual */ }

document.addEventListener("DOMContentLoaded", carregar);
