const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};
let categoriaAtual = "Todos";

async function carregarProdutos() {
  const res = await fetch(API_URL + "?acao=produtos");
  produtos = await res.json();

  produtos.sort((a,b)=> (b.promocao>0)-(a.promocao>0));

  criarFiltros();
  renderizar(produtos);
}

function criarFiltros(){
  const area = document.getElementById("filtros");
  const categorias = ["Todos", ...new Set(produtos.map(p=>p.categoria))];
  area.innerHTML="";

  categorias.forEach(cat=>{
    const btn=document.createElement("button");
    btn.className="filtro-btn";
    btn.innerText=cat;
    btn.onclick=()=>filtrar(cat);
    area.appendChild(btn);
  });
}

function filtrar(cat){
  categoriaAtual=cat;
  if(cat==="Todos") renderizar(produtos);
  else renderizar(produtos.filter(p=>p.categoria===cat));
}

function renderizar(lista){
  const grid=document.getElementById("produtos");
  grid.innerHTML="";

  lista.forEach(p=>{
    const precoFinal=p.promocao>0?p.promocao:p.preco;
    const temPromo=p.promocao>0;

    const card=document.createElement("div");
    card.className="produto-card";

    card.innerHTML=`
      ${temPromo?'<div class="badge">PROMOÇÃO</div>':''}
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      ${temPromo?
        `<div><span class="antigo">R$ ${p.preco}</span> <span class="promo">R$ ${p.promocao}</span></div>`:
        `<div>R$ ${p.preco}</div>`
      }
      <small>Estoque: ${p.estoque}</small>
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

function alterar(nome,valor){
  const produto=produtos.find(p=>p.nome===nome);
  if(!carrinho[nome]) carrinho[nome]=0;
  if(valor>0 && carrinho[nome]>=produto.estoque) return;
  carrinho[nome]+=valor;
  if(carrinho[nome]<0) carrinho[nome]=0;

  renderizar(produtos.filter(p=>categoriaAtual==="Todos"||p.categoria===categoriaAtual));
}

function atualizarCarrinho(){
  const area=document.getElementById("itensCarrinho");
  area.innerHTML="";
  let total=0;

  Object.keys(carrinho).forEach(nome=>{
    if(carrinho[nome]>0){
      const p=produtos.find(x=>x.nome===nome);
      const preco=p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[nome];
      area.innerHTML+=`<div>${nome} x${carrinho[nome]}</div>`;
    }
  });

  document.getElementById("valorTotal").innerText="R$ "+total.toFixed(2);
}

function abrirCarrinho(){
  document.querySelector(".carrinho-lateral").classList.add("ativo");
}

function fecharCarrinho(){
  document.querySelector(".carrinho-lateral").classList.remove("ativo");
}

carregarProdutos();
