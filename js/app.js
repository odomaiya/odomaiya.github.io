const API_URL="https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos=[];
let carrinho={};

function formatar(v){
return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

async function carregar(){
const r=await fetch(API_URL+"?acao=produtos");
produtos=await r.json();
produtos.sort((a,b)=> (b.promocao>0)-(a.promocao>0)||a.nome.localeCompare(b.nome));
criarCategorias();
render(produtos);
}

function criarCategorias(){
const cats=["Todos",...new Set(produtos.map(p=>p.categoria))];
const area=document.getElementById("categorias");
area.innerHTML="";
cats.forEach(c=>{
const b=document.createElement("button");
b.innerText=c;
b.onclick=()=>filtrar(c);
area.appendChild(b);
});
}

function filtrar(cat){
if(cat==="Todos") render(produtos);
else render(produtos.filter(p=>p.categoria===cat));
}

function render(lista){
const grid=document.getElementById("produtos");
grid.innerHTML="";
lista.forEach(p=>{
const preco=p.promocao>0?Number(p.promocao):Number(p.preco);
const div=document.createElement("div");
div.className="produto"+(p.promocao>0?" promo":"");
div.innerHTML=`
<img src="${p.imagem}">
<h4>${p.nome}</h4>
<p>${formatar(preco)}</p>
<div class="contador">
<button onclick="alterar('${p.nome}',-1)">-</button>
<span>${carrinho[p.nome]||0}</span>
<button onclick="alterar('${p.nome}',1)">+</button>
</div>`;
grid.appendChild(div);
});
atualizarCarrinho();
}

function alterar(nome,v){
if(!carrinho[nome]) carrinho[nome]=0;
carrinho[nome]+=v;
if(carrinho[nome]<0)carrinho[nome]=0;
render(produtos);
}

function atualizarCarrinho(){
let total=0;
let itensHTML="";
Object.keys(carrinho).forEach(n=>{
if(carrinho[n]>0){
const p=produtos.find(x=>x.nome===n);
const preco=p.promocao>0?Number(p.promocao):Number(p.preco);
total+=preco*carrinho[n];
itensHTML+=`<p>${n} x${carrinho[n]} - ${formatar(preco)}</p>`;
}
});
document.getElementById("itensCarrinho").innerHTML=itensHTML;
document.getElementById("valorTotal").innerText=formatar(total);
document.getElementById("contadorCarrinho").innerText=
Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function abrirCarrinho(){
document.getElementById("carrinho").classList.toggle("ativo");
}

function abrirCheckout(){
document.getElementById("modalCheckout").style.display="flex";
document.getElementById("checkoutConteudo").innerHTML=`
<h3>Finalizar Pedido</h3>
<input id="cliente" placeholder="Seu nome"><br><br>
<select id="pagamento">
<option>Cartão</option>
<option>Dinheiro</option>
<option>Pix</option>
</select><br><br>
<input id="cep" placeholder="CEP"><br><br>
<input id="rua" placeholder="Rua"><br><br>
<input id="numero" placeholder="Número"><br><br>
<input id="cidade" placeholder="Cidade"><br><br>
<button onclick="buscarCEP()">Buscar CEP</button><br><br>
<button onclick="enviarPedido()">Enviar Pedido</button>`;
}

async function buscarCEP(){
const cep=document.getElementById("cep").value;
const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
const d=await r.json();
document.getElementById("rua").value=d.logradouro||"";
document.getElementById("cidade").value=d.localidade||"";
}

function enviarPedido(){
let total=0;
let texto="✨ *Novo Pedido Odòmáiyà* ✨\n\n";
texto+="👤 Cliente: "+document.getElementById("cliente").value+"\n";
texto+="💳 Pagamento: "+document.getElementById("pagamento").value+"\n\n";
texto+="📦 Itens:\n";

Object.keys(carrinho).forEach(n=>{
if(carrinho[n]>0){
const p=produtos.find(x=>x.nome===n);
const preco=p.promocao>0?Number(p.promocao):Number(p.preco);
total+=preco*carrinho[n];
texto+=`• ${n} x${carrinho[n]} - ${formatar(preco)}\n`;
}
});

texto+=`\n💰 Total: ${formatar(total)}\n`;
texto+=`\n📍 Endereço: ${rua.value}, ${numero.value}, ${cidade.value}`;

window.open("https://wa.me/555496048808?text="+encodeURIComponent(texto));
}

carregar();
