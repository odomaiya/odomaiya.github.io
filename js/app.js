const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};

function formatar(v){
  return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

async function carregarProdutos(){
  const res = await fetch(API_URL+"?acao=produtos&t="+Date.now(),{cache:"no-store"});
  const dados = await res.json();

  produtos = dados
    .filter(p=>p.estoque>0)
    .sort((a,b)=>{
      if(a.promocao>0 && b.promocao==0) return -1;
      if(a.promocao==0 && b.promocao>0) return 1;
      return a.nome.localeCompare(b.nome);
    });

  renderizar(produtos);
}

function renderizar(lista){
  const grid = document.getElementById("produtos");
  grid.innerHTML="";

  lista.forEach(p=>{
    const precoFinal = p.promocao>0?p.promocao:p.preco;

    const card = document.createElement("div");
    card.className="produto-card";
    if(p.promocao>0) card.classList.add("promo");

    card.innerHTML=`
      <img src="${p.imagem || 'https://via.placeholder.com/300'}">
      <h3>${p.nome}</h3>
      ${p.promocao>0?`<div class="preco-antigo">${formatar(p.preco)}</div>`:""}
      <div class="preco">${formatar(precoFinal)}</div>
      <button onclick="adicionar('${p.nome}')">Adicionar</button>
    `;

    grid.appendChild(card);
  });
}

function adicionar(nome){
  carrinho[nome]=(carrinho[nome]||0)+1;
}

function abrirCarrinho(){
  atualizarCarrinho();
  document.getElementById("modalCarrinho").style.display="flex";
}

function fecharCarrinho(){
  document.getElementById("modalCarrinho").style.display="none";
}

function atualizarCarrinho(){
  const div=document.getElementById("itensCarrinho");
  div.innerHTML="";
  let total=0;

  Object.keys(carrinho).forEach(nome=>{
    const p=produtos.find(x=>x.nome===nome);
    const preco=p.promocao>0?p.promocao:p.preco;
    total+=preco*carrinho[nome];

    div.innerHTML+=`<p>${nome} x${carrinho[nome]} - ${formatar(preco*carrinho[nome])}</p>`;
  });

  document.getElementById("valorTotal").innerText=formatar(total);
}

function abrirCheckout(){
  document.getElementById("modalCheckout").style.display="flex";
  document.getElementById("conteudoCheckout").innerHTML=`
    <h3>Finalizar Pedido</h3>
    <input id="cliente" placeholder="Nome Completo">
    <input id="endereco" placeholder="Endereço Completo">
    <button onclick="finalizarPedido()" class="btn-finalizar">Confirmar Pedido</button>
  `;
}

async function finalizarPedido(){
  let total=0;
  Object.keys(carrinho).forEach(nome=>{
    const p=produtos.find(x=>x.nome===nome);
    const preco=p.promocao>0?p.promocao:p.preco;
    total+=preco*carrinho[nome];
  });

  const dados={
    cliente:document.getElementById("cliente").value,
    endereco:document.getElementById("endereco").value,
    itens:carrinho,
    total:total
  };

  await fetch(API_URL,{
    method:"POST",
    body:JSON.stringify(dados)
  });

  alert("Pedido enviado com sucesso!");
  carrinho={};
  fecharCarrinho();
  document.getElementById("modalCheckout").style.display="none";
}

function buscarProduto(){
  const termo=document.getElementById("busca").value.toLowerCase();
  const filtrado=produtos.filter(p=>p.nome.toLowerCase().includes(termo));
  renderizar(filtrado);
}

carregarProdutos();
