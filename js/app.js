/* ===================================================== */
/* CONFIGURAÇÃO API */
/* ===================================================== */

const API_URL = "https://script.google.com/macros/s/AKfycby5tJVh9IT6lyHOjjM5PhRGDgT7Fs7MOJiQ2-C4ErIK6sDGYmeW6_JWjFmXTXbRl9Ng/exec";

let produtos = [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
let etapaAtual = 1;


/* ===================================================== */
/* UTIL */
/* ===================================================== */

function money(v){
  return Number(v).toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL"
  });
}

function salvarCarrinho(){
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}


/* ===================================================== */
/* LOADER */
/* ===================================================== */

function mostrarLoader(){
  document.getElementById("produtos").innerHTML = `
    <div class="loader-area">
      <div class="loader"></div>
    </div>
  `;
}


/* ===================================================== */
/* CARREGAR PRODUTOS */
/* ===================================================== */

async function carregar(){
  mostrarLoader();

  try{
    const res = await fetch(API_URL + "?acao=produtos");
    produtos = await res.json();
    render(produtos);
  }catch(e){
    document.getElementById("produtos").innerHTML =
      "<p>Erro ao carregar produtos.</p>";
  }
}


/* ===================================================== */
/* RENDER PRODUTOS */
/* ===================================================== */

function render(lista){

  const grid = document.getElementById("produtos");
  grid.innerHTML = "";

  lista.forEach(p => {

    const preco = p.promocao > 0 ? p.promocao : p.preco;
    const estoqueBaixo = p.estoque > 0 && p.estoque < 10;

    const card = document.createElement("div");
    card.className =
      "produto" +
      (p.promocao > 0 ? " promo" : "") +
      (estoqueBaixo ? " quase-esgotado" : "");

    card.innerHTML = `
      ${p.promocao > 0 ? '<div class="faixa-promo">OFERTA ESPECIAL</div>' : ''}
      ${estoqueBaixo ? '<div class="badge-estoque">Poucas unidades</div>' : ''}

      <div class="img-wrap">
        <img src="${p.imagem}" alt="${p.nome}">
      </div>

      <h3>${p.nome}</h3>
      <div class="preco">${money(preco)}</div>

      <div class="contador">
        <button onclick="alterar('${p.nome}',-1)">−</button>
        <span>${carrinho[p.nome] || 0}</span>
        <button onclick="alterar('${p.nome}',1)">+</button>
      </div>
    `;

    grid.appendChild(card);
  });

  atualizarCarrinho();
}


/* ===================================================== */
/* ALTERAR QUANTIDADE */
/* ===================================================== */

function alterar(nome, valor){

  const produto = produtos.find(p => p.nome === nome);
  if(!produto) return;

  if(!carrinho[nome]) carrinho[nome] = 0;

  if(valor > 0 && carrinho[nome] >= produto.estoque){
    alert("Quantidade máxima disponível.");
    return;
  }

  carrinho[nome] += valor;

  if(carrinho[nome] <= 0){
    delete carrinho[nome];
  }

  salvarCarrinho();
  render(produtos);

  registrarEvento("add_carrinho", { produto: nome });
}


/* ===================================================== */
/* REMOVER ITEM */
/* ===================================================== */

function removerItem(nome){
  delete carrinho[nome];
  salvarCarrinho();
  render(produtos);
}


/* ===================================================== */
/* CARRINHO */
/* ===================================================== */

function atualizarCarrinho(){

  const area = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contadorCarrinho");

  let total = 0;
  let html = "";

  Object.keys(carrinho).forEach(nome => {

    const p = produtos.find(x => x.nome === nome);
    if(!p) return;

    const preco = p.promocao > 0 ? p.promocao : p.preco;
    total += preco * carrinho[nome];

    html += `
      <div class="item-carrinho">
        <div class="item-info">
          <strong>${nome}</strong><br>
          ${money(preco)}
        </div>

        <div class="item-acoes">
          <button onclick="alterar('${nome}',-1)">−</button>
          <span>${carrinho[nome]}</span>
          <button onclick="alterar('${nome}',1)">+</button>
          <button class="btn-remover" onclick="removerItem('${nome}')">×</button>
        </div>
      </div>
    `;
  });

  if(!html){
    html = "<p>Seu carrinho está vazio</p>";
  }

  area.innerHTML = html;
  document.getElementById("valorTotal").innerText = money(total);
  contador.innerText = Object.values(carrinho).reduce((a,b)=>a+b,0);
}


/* ===================================================== */
/* FINALIZAR PEDIDO */
/* ===================================================== */

async function finalizar(){

  let total = 0;
  let msg = "✨ *Novo Pedido Odòmáiyà* ✨\n\n";

  const nome = document.getElementById("cliente").value;
  const tipo = document.getElementById("tipo").value;
  const pagamento = document.getElementById("pagamento").value;

  msg += "👤 Cliente: " + nome + "\n";
  msg += "📦 Tipo: " + tipo + "\n";
  msg += "💳 Pagamento: " + pagamento + "\n\n";

  if(tipo === "entrega"){
    const rua = document.getElementById("rua").value;
    const numero = document.getElementById("numero").value;
    const cidade = document.getElementById("cidade").value;
    msg += `📍 Endereço: ${rua}, ${numero}, ${cidade}\n`;
  }else{
    msg += "📍 Retirada na loja\n";
  }

  msg += "\n🛍️ Itens:\n";

  Object.keys(carrinho).forEach(n => {
    const p = produtos.find(x => x.nome === n);
    const preco = p.promocao > 0 ? p.promocao : p.preco;
    total += preco * carrinho[n];
    msg += `• ${n} x${carrinho[n]} — ${money(preco)}\n`;
  });

  msg += `\n💰 Total: ${money(total)}\n`;

  try{

    await fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({
        acao:"pedido",
        cliente:nome,
        tipo:tipo,
        pagamento:pagamento,
        itens:carrinho,
        total:total
      })
    });

    await atualizarEstoqueServidor(carrinho);

    registrarEvento("pedido_finalizado", { total });

    localStorage.removeItem("carrinho");

    window.open("https://wa.me/555496048808?text=" + encodeURIComponent(msg));

    location.reload();

  }catch(e){
    alert("Erro ao enviar pedido. Tente novamente.");
  }
}


/* ===================================================== */
/* ATUALIZAR ESTOQUE */
/* ===================================================== */

async function atualizarEstoqueServidor(itens){
  try{
    await fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({
        acao:"atualizarEstoque",
        itens:itens
      })
    });
  }catch(e){
    console.error("Erro ao atualizar estoque:", e);
  }
}


/* ===================================================== */
/* ANALYTICS */
/* ===================================================== */

function registrarEvento(evento, dados = {}){
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({
      acao:"analytics",
      evento:evento,
      dados:dados,
      data:new Date().toISOString()
    })
  });
}


/* ===================================================== */
/* INIT */
/* ===================================================== */

document.addEventListener("DOMContentLoaded", carregar);
