const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos=[];
let carrinho={};

function formatar(v){
  return v.toLocaleString("pt-BR",{minimumFractionDigits:2});
}

async function carregarProdutos(){

  const cache = localStorage.getItem("produtosCache");
  if(cache){
    produtos = JSON.parse(cache);
    renderizar(produtos);
  }

  const res = await fetch(API_URL+"?acao=produtos&t="+Date.now());
  const data = await res.json();

  produtos = data.map(p=>{
    const preco = Number(String(p.preco).replace(",", "."))||0;
    const promo = Number(String(p.promocao).replace(",", "."))||0;

    return{
      nome:p.nome,
      preco,
      promocao: promo>0 && promo<preco ? promo : 0,
      imagem:p.imagem,
      estoque:Number(p.estoque)||0
    }
  });

  produtos.sort((a,b)=>{
    if(a.promocao>0 && b.promocao===0) return -1;
    if(a.promocao===0 && b.promocao>0) return 1;
    return a.nome.localeCompare(b.nome);
  });

  localStorage.setItem("produtosCache",JSON.stringify(produtos));
  renderizar(produtos);
}

function renderizar(lista){
  const grid=document.getElementById("produtos");
  grid.innerHTML="";

  lista.forEach(p=>{
    const precoFinal=p.promocao>0?p.promocao:p.preco;
    const card=document.createElement("div");
    card.className="produto-card";
    if(p.promocao>0) card.classList.add("promo-card");

    card.innerHTML=`
      <img src="${p.imagem}" loading="lazy">
      <h3>${p.nome}</h3>
      ${p.promocao>0?
      `<div><span class="antigo">R$ ${formatar(p.preco)}</span>
      <div class="promo">R$ ${formatar(p.promocao)}</div></div>`:
      `<div>R$ ${formatar(p.preco)}</div>`
      }
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

function alterar(nome,val){
  if(!carrinho[nome]) carrinho[nome]=0;
  carrinho[nome]+=val;
  if(carrinho[nome]<0) carrinho[nome]=0;
  renderizar(produtos);
}

function atualizarCarrinho(){
  let total=0;
  const area=document.getElementById("itensCarrinho");
  area.innerHTML="";

  Object.keys(carrinho).forEach(n=>{
    if(carrinho[n]>0){
      const p=produtos.find(x=>x.nome===n);
      const preco=p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[n];
      area.innerHTML+=`<div>${n} x${carrinho[n]}</div>`;
    }
  });

  document.getElementById("valorTotal").innerText="R$ "+formatar(total);
}

function abrirCarrinho(){
  document.getElementById("carrinho").classList.toggle("ativo");
}

window.alterar=alterar;
window.abrirCarrinho=abrirCarrinho;

carregarProdutos();
