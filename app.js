const CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?gid=1004684059&single=true&output=csv";

let produtos=[];
let carrinho={};
let categoriaAtual="Todos";

async function carregar(){
const res=await fetch(CSV_URL);
const texto=await res.text();
const linhas=texto.trim().split("\n").slice(1);

produtos=linhas.map(l=>{
const c=l.split(",");
return{
nome:c[0],
preco:parseFloat(c[1])||0,
categoria:c[2],
imagem:c[3],
estoque:parseInt(c[4])||0
};
});

criarFiltros();
renderizar(produtos);
}

function criarFiltros(){
const cats=["Todos",...new Set(produtos.map(p=>p.categoria))];
const area=document.getElementById("filtros");
area.innerHTML="";
cats.forEach(c=>{
area.innerHTML+=`<button class="filtro-btn" onclick="filtrar('${c}')">${c}</button>`;
});
}

function filtrar(cat){
categoriaAtual=cat;
if(cat==="Todos") renderizar(produtos);
else renderizar(produtos.filter(p=>p.categoria===cat));
}

document.getElementById("busca").addEventListener("input",e=>{
const termo=e.target.value.toLowerCase();
const filtrados=produtos.filter(p=>
p.nome.toLowerCase().includes(termo) &&
(categoriaAtual==="Todos"||p.categoria===categoriaAtual)
);
renderizar(filtrados);
});

function renderizar(lista){
const grid=document.getElementById("produtos");
grid.innerHTML="";
lista.forEach((p,i)=>{
grid.innerHTML+=`
<div class="produto-card">
<h3>${p.nome}</h3>
<div class="preco">R$ ${p.preco.toFixed(2)}</div>
<small>Estoque: ${p.estoque}</small>
<div class="contador">
<button onclick="alterar('${p.nome}',-1)">-</button>
<span>${carrinho[p.nome]||0}</span>
<button onclick="alterar('${p.nome}',1)">+</button>
</div>
</div>`;
});
}

function alterar(nome,v){
if(!carrinho[nome]) carrinho[nome]=0;
carrinho[nome]+=v;
if(carrinho[nome]<0) carrinho[nome]=0;
atualizarTotal();
renderizar(produtos.filter(p=>categoriaAtual==="Todos"||p.categoria===categoriaAtual));
}

function atualizarTotal(){
let total=0;
Object.values(carrinho).forEach(q=> total+=q);
document.getElementById("totalItens").innerText=total;
}

function abrirCheckout(){
let total=0;
Object.keys(carrinho).forEach(n=>{
const p=produtos.find(x=>x.nome===n);
if(p) total+=p.preco*carrinho[n];
});
if(total===0){alert("Carrinho vazio.");return;}
document.getElementById("checkoutModal").style.display="flex";
etapaDados();
}

function fecharCheckout(){
document.getElementById("checkoutModal").style.display="none";
}

function etapaDados(){
document.getElementById("checkoutSteps").innerHTML=`
<h3>Seus Dados</h3>
<input id="nomeCliente" class="checkout-input" placeholder="Seu nome">
<button class="checkout-btn" onclick="etapaPagamento()">Continuar</button>`;
}

function etapaPagamento(){
const nome=document.getElementById("nomeCliente").value;
if(!nome){alert("Digite seu nome");return;}

document.getElementById("checkoutSteps").innerHTML=`
<h3>Pagamento</h3>
<select id="pagamento" class="checkout-input">
<option>Crédito</option>
<option>Débito</option>
<option>Dinheiro</option>
<option>Pix</option>
</select>
<button class="checkout-btn" onclick="confirmarPedido()">Confirmar Pedido</button>`;
}

function confirmarPedido(){
document.getElementById("checkoutModal").style.display="none";
document.getElementById("successScreen").style.display="flex";

setTimeout(()=>{
let mensagem="*Pedido Odòmáiyà*%0A";
Object.keys(carrinho).forEach(n=>{
if(carrinho[n]>0) mensagem+=`${n} x${carrinho[n]}%0A`;
});
window.open(`https://wa.me/555496048808?text=${mensagem}`,"_blank");
document.getElementById("successScreen").style.display="none";
},1500);
}

carregar();
