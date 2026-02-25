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
const estoqueBaixo = p.estoque > 0 && p.estoque < 10;

const card=document.createElement("div");
card.className="produto"
+(p.promocao>0?" promo":"")
+(semEstoque?" sem-estoque":"")
+(estoqueBaixo?" quase-esgotado":"");

let html = "";

html += `
<h3>${p.nome}</h3>
`;

html += `
<p>${money(preco)}</p>
`;

if(semEstoque){
html += `
<p>❌ Sem estoque</p>
`;
}else{
html += `
<p>Estoque: ${p.estoque}</p>
`;

if(estoqueBaixo){
html += `
<p>Últimas unidades</p>
`;
}

html += `
<div class="contador">
<button onclick="alterar('${p.nome}',-1)">−</button>
<span>${carrinho[p.nome]||0}</span>
<button onclick="alterar('${p.nome}',1)">+</button>
</div>
`;
}

card.innerHTML = html;
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
<h3>Seu Carrinho</h3>
<button onclick="fecharCarrinho()">✕</button>
`;

Object.keys(carrinho).forEach(nome=>{
if(carrinho[nome]>0){
const produto=produtos.find(p=>p.nome===nome);
if(!produto) return;

const preco=produto.promocao>0?Number(produto.promocao):Number(produto.preco);
const subtotal=preco*carrinho[nome];
total+=subtotal;

html+=`
<div>
<p>${nome}</p>
<p>${carrinho[nome]}x ${money(preco)}</p>
<p>Subtotal: ${money(subtotal)}</p>
</div>
`;
}
});

if(Object.values(carrinho).reduce((a,b)=>a+b,0)===0){
html+=`
<p>Seu carrinho está vazio</p>
`;
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

<label>Nome</label>
<input type="text" id="cliente">

<h3>Entrega</h3>
<select id="tipo">
<option value="retirada">Retirada na loja</option>
<option value="entrega">Entrega</option>
</select>

<div id="enderecoArea" style="display:none;">
<input type="text" id="cep" placeholder="CEP">
<input type="text" id="rua" placeholder="Rua">
<input type="text" id="cidade" placeholder="Cidade">
</div>

<h3>Pagamento</h3>
<select id="pagamento">
<option value="cartao">Cartão</option>
<option value="dinheiro">Dinheiro</option>
<option value="pix">Pix</option>
</select>

<button onclick="voltarCarrinho()">⬅ Voltar ao Carrinho</button>
<button onclick="finalizar()">Enviar Pedido</button>
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

const categoriasSelecionadas = itensNoCarrinho.map(nome=>{
const prod = produtos.find(p=>p.nome===nome);
return prod?.categoria;
});

let sugestoes = produtos.filter(p=>
!itensNoCarrinho.includes(p.nome) &&
p.estoque > 0 &&
(
categoriasSelecionadas.includes(p.categoria) ||
p.promocao > 0 ||
p.estoque >= 8
)
);

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

function criarCategorias(){}

document.addEventListener("DOMContentLoaded", carregar);
