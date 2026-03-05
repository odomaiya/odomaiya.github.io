function money(v){
return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function renderProdutos(lista){

const grid = document.getElementById("produtos");

grid.innerHTML="";

lista.forEach(p=>{

const preco = p.promocao>0?p.promocao:p.preco;

const estoqueBaixo = p.estoque>0 && p.estoque<10;

const card = document.createElement("div");

card.className="produto"+
(p.promocao>0?" promo":"")+
(estoqueBaixo?" quase":"");

card.innerHTML=`

${p.promocao>0?'<div class="faixa">OFERTA</div>':''}
${estoqueBaixo?'<div class="badge">Poucas unidades</div>':''}

<img src="${p.imagem}">

<h3>${p.nome}</h3>

<div class="preco">${money(preco)}</div>

<div class="contador">

<button onclick="removerCarrinho('${p.nome}')">−</button>

<span>${carrinho[p.nome]||0}</span>

<button onclick="adicionarCarrinho('${p.nome}')">+</button>

</div>

`;

grid.appendChild(card);

});

}

function atualizarCarrinho(){

const area = document.getElementById("itensCarrinho");

let html="";

Object.keys(carrinho).forEach(nome=>{

const p = produtos.find(x=>x.nome===nome);

if(!p) return;

const preco = p.promocao>0?p.promocao:p.preco;

html+=`

<div class="itemCarrinho">

<div>
<strong>${nome}</strong><br>
${money(preco)}
</div>

<div class="acoes">

<button onclick="removerCarrinho('${nome}')">−</button>

<span>${carrinho[nome]}</span>

<button onclick="adicionarCarrinho('${nome}')">+</button>

<button onclick="removerItem('${nome}')">×</button>

</div>

</div>

`;

});

if(!html) html="<p>Carrinho vazio</p>";

area.innerHTML=html;

document.getElementById("total").innerText=money(totalCarrinho());

document.getElementById("contador").innerText =
Object.values(carrinho).reduce((a,b)=>a+b,0);

}
