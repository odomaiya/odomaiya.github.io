const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};

function formatar(valor){
  return Number(valor).toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL"
  });
}

/* ========================= */
/* CARREGAR PRODUTOS RÁPIDO */
/* ========================= */

async function carregarProdutos(){

  try{
    const resposta = await fetch(API_URL + "?acao=produtos&t=" + Date.now(), {
      cache: "no-store"
    });

    const dados = await resposta.json();

    /* promoção primeiro + ordem alfabética */
    produtos = dados.sort((a,b)=>{
      if(a.promocao > 0 && b.promocao == 0) return -1;
      if(a.promocao == 0 && b.promocao > 0) return 1;
      return a.nome.localeCompare(b.nome);
    });

    renderizar(produtos);

  }catch(erro){
    console.error("Erro ao carregar produtos:", erro);
  }
}

/* ========================= */
/* RENDERIZAR */
/* ========================= */

function renderizar(lista){
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach(p=>{

    if(p.estoque <= 0) return;

    const precoFinal = p.promocao > 0 ? p.promocao : p.preco;

    const card = document.createElement("div");
    card.className = "produto-card";

    if(p.promocao > 0){
      card.classList.add("promo-destaque");
    }

    card.innerHTML = `
      <img src="${p.imagem || 'https://via.placeholder.com/300'}" loading="lazy">
      <h3>${p.nome}</h3>

      ${p.promocao > 0 
        ? `<div class="preco-antigo">${formatar(p.preco)}</div>`
        : ""
      }

      <div class="preco">${formatar(precoFinal)}</div>

      <button onclick="adicionar('${p.nome}')">
        Adicionar
      </button>
    `;

    container.appendChild(card);
  });

  gsap.from(".produto-card",{
    opacity:0,
    y:20,
    duration:0.4,
    stagger:0.05
  });
}

/* ========================= */
/* CARRINHO */
/* ========================= */

function adicionar(nome){
  carrinho[nome] = (carrinho[nome] || 0) + 1;
}

function abrirCarrinho(){
  atualizarCarrinho();
  document.getElementById("modalCarrinho").style.display="flex";
}

function fecharCarrinho(){
  document.getElementById("modalCarrinho").style.display="none";
}

function atualizarCarrinho(){

  const div = document.getElementById("itensCarrinho");
  div.innerHTML = "";

  let total = 0;

  Object.keys(carrinho).forEach(nome=>{
    const produto = produtos.find(p=>p.nome === nome);
    if(!produto) return;

    const preco = produto.promocao > 0 ? produto.promocao : produto.preco;
    const qtd = carrinho[nome];

    total += preco * qtd;

    div.innerHTML += `
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span>${nome} x${qtd}</span>
        <span>${formatar(preco*qtd)}</span>
      </div>
    `;
  });

  document.getElementById("valorTotal").innerText = formatar(total);
}

/* ========================= */
/* CHECKOUT */
/* ========================= */

function abrirCheckout(){

  document.getElementById("modalCheckout").style.display="flex";

  document.getElementById("conteudoCheckout").innerHTML = `
    <h3>Finalizar Pedido</h3>

    <input id="cliente" placeholder="Nome Completo" required>
    <input id="telefone" placeholder="WhatsApp" required>
    <input id="endereco" placeholder="Endereço Completo" required>

    <button onclick="finalizarPedido()">
      Confirmar Pedido
    </button>
  `;
}

async function finalizarPedido(){

  if(Object.keys(carrinho).length === 0){
    alert("Carrinho vazio.");
    return;
  }

  let total = 0;

  Object.keys(carrinho).forEach(nome=>{
    const produto = produtos.find(p=>p.nome === nome);
    const preco = produto.promocao > 0 ? produto.promocao : produto.preco;
    total += preco * carrinho[nome];
  });

  const dados = {
    cliente: document.getElementById("cliente").value,
    telefone: document.getElementById("telefone").value,
    tipo: "Entrega",
    endereco: document.getElementById("endereco").value,
    pagamento: "WhatsApp",
    itens: carrinho,
    total: total
  };

  try{
    await fetch(API_URL,{
      method:"POST",
      body: JSON.stringify(dados)
    });

    alert("Pedido enviado com sucesso!");

    carrinho = {};
    fecharCarrinho();
    location.reload();

  }catch(erro){
    alert("Erro ao enviar pedido.");
    console.error(erro);
  }
}

carregarProdutos();
