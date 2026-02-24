const produtosState={
produtos:[],
carrinho:{},
categoriaAtual:"Todos"
};

async function carregar(){
const res=await fetch(CONFIG.planilhaCSV);
const texto=await res.text();
const linhas=texto.trim().split("\n").slice(1);

produtosState.produtos=linhas.map(l=>{
const c=l.split(",");
return{
nome:c[0],
preco:parseFloat(c[1])||0,
categoria:c[2],
estoque:parseInt(c[4])||0
};
});

criarFiltros();
renderizar(produtosState.produtos);
}

function criarFiltros(){
const cats=["Todos",...new Set(produtosState.produtos.map(p=>p.categoria))];
const area=document.getElementById("filtros");
area.innerHTML="";
cats.forEach(c=>{
area.innerHTML+=`<button class="filtro-btn" onclick="filtrar('${c}')">${c}</button>`;
});
}

function filtrar(cat){
produtosState.categoriaAtual=cat;
aplicarFiltros();
}

function aplicarFiltros(){
const termo=document.getElementById("busca").value.toLowerCase();
const filtrados=produtosState.produtos.filter(p=>
p.nome.toLowerCase().includes(termo)&&
(produtosState.categoriaAtual==="Todos"||p.categoria===produtosState.categoriaAtual)
);
renderizar(filtrados);
}

document.getElementById("busca").addEventListener("input",aplicarFiltros);

function renderizar(lista){
const grid=document.getElementById("produtos");
grid.innerHTML="";
lista.forEach(p=>{
grid.innerHTML+=`
<div class="produto-card">
<h3>${p.nome}</h3>
<div class="preco">R$ ${p.preco.toFixed(2)}</div>
<div class="contador">
<button onclick="alterar('${p.nome}',-1)">-</button>
<span>${produtosState.carrinho[p.nome]||0}</span>
<button onclick="alterar('${p.nome}',1)">+</button>
</div>
</div>
`;
});
}

function alterar(nome,v){
if(!produtosState.carrinho[nome])produtosState.carrinho[nome]=0;
produtosState.carrinho[nome]+=v;
if(produtosState.carrinho[nome]<0)produtosState.carrinho[nome]=0;
atualizarContador();
aplicarFiltros();
}

function atualizarContador(){
let total=0;
Object.values(produtosState.carrinho).forEach(q=>total+=q);
document.getElementById("contadorCarrinho").innerText=total;
}

function abrirCheckout(){
let mensagem="*Pedido Odò Máiyà*%0A";
Object.keys(produtosState.carrinho).forEach(n=>{
if(produtosState.carrinho[n]>0){
mensagem+=`${n} x${produtosState.carrinho[n]}%0A`;
}
});
window.open(`https://wa.me/555496048808?text=${mensagem}`,"_blank");
}

carregar();
