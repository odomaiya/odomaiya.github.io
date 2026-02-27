const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
let etapaAtual = 1;

/* ============================= */
/* UTIL */
/* ============================= */

function money(v){
  return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function salvarCarrinho(){
  localStorage.setItem("carrinho",JSON.stringify(carrinho));
}

/* ============================= */
/* LOADER */
/* ============================= */

function mostrarLoader(){
  document.getElementById("produtos").innerHTML=`
    <div class="loader-area">
      <div class="loader"></div>
    </div>
  `;
}

/* ============================= */
/* CARREGAR PRODUTOS */
/* ============================= */

async function carregar(){
  mostrarLoader();

  try {

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      acao: "pedido",
      cliente: nome,
      tipo: tipo,
      pagamento: pagamento,
      itens: carrinho,
      total: total,
      data: new Date().toISOString()
    })
  });

  await atualizarEstoqueServidor(carrinho);

  registrarEvento("pedido_finalizado", { total: total });

  localStorage.removeItem("carrinho");

  window.open("https://wa.me/555496048808?text=" + encodeURIComponent(msg));

  location.reload();

} catch (e) {
  alert("Erro ao enviar pedido. Tente novamente.");
}

/* ============================= */
/* RENDER */
/* ============================= */

function render(lista){
  const grid = document.getElementById("produtos");
  grid.innerHTML="";

  lista.forEach(p=>{
    const preco = p.promocao>0?p.promocao:p.preco;
    const estoqueBaixo = p.estoque>0 && p.estoque<10;

    const card = document.createElement("div");
    card.className="produto"
      +(p.promocao>0?" promo":"")
      +(estoqueBaixo?" quase-esgotado":"");

    card.innerHTML=`
      ${p.promocao>0?'<div class="faixa-promo">OFERTA ESPECIAL</div>':''}
      ${estoqueBaixo?'<div class="badge-estoque">Poucas unidades</div>':''}
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      <div class="preco">${money(preco)}</div>
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

/* ============================= */
/* ALTERAR QUANTIDADE */
/* ============================= */

function alterar(nome,valor){
  const produto = produtos.find(p=>p.nome===nome);
  if(!produto) return;

  if(!carrinho[nome]) carrinho[nome]=0;

  if(valor>0 && carrinho[nome]>=produto.estoque){
    alert("Quantidade máxima disponível.");
    return;
  }

  carrinho[nome]+=valor;
  if(carrinho[nome]<=0) delete carrinho[nome];

  salvarCarrinho();
  render(produtos);

  const card = [...document.querySelectorAll(".produto")]
    .find(el=>el.innerText.includes(nome));

  if(card){
    card.classList.add("adicionado");
    setTimeout(()=>card.classList.remove("adicionado"),400);
  }
}

/* ============================= */
/* REMOVER ITEM */
/* ============================= */

function removerItem(nome){
  delete carrinho[nome];
  salvarCarrinho();
  render(produtos);
}

/* ============================= */
/* CARRINHO */
/* ============================= */

function atualizarCarrinho(){
  registrarEvento("add_carrinho", { produto: nome });
  const area = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contadorCarrinho");

  let total=0;
  let html="";

  Object.keys(carrinho).forEach(nome=>{
    const p = produtos.find(x=>x.nome===nome);
    if(!p) return;

    const preco=p.promocao>0?p.promocao:p.preco;
    total+=preco*carrinho[nome];

    html+=`
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

  if(!html) html="<p>Seu carrinho está vazio</p>";

  area.innerHTML=html;
  document.getElementById("valorTotal").innerText=money(total);
  contador.innerText=Object.values(carrinho).reduce((a,b)=>a+b,0);
}

/* ============================= */
/* FINALIZAR */
/* ============================= */

async function finalizar(){
  let total=0;
  let msg="✨ *Novo Pedido Odòmáiyà* ✨\n\n";

  const nome=document.getElementById("cliente").value;
  const tipo=document.getElementById("tipo").value;
  const pagamento=document.getElementById("pagamento").value;

  msg+="👤 Cliente: "+nome+"\n";
  msg+="📦 Tipo: "+tipo+"\n";
  msg+="💳 Pagamento: "+pagamento+"\n\n";

  if(tipo==="entrega"){
    msg+=`📍 Endereço: ${rua.value}, ${numero.value}, ${cidade.value}\n`;
  }else{
    msg+="📍 Retirada na loja\n";
  }

  msg+="\n🛍️ Itens:\n";

  Object.keys(carrinho).forEach(n=>{
    const p=produtos.find(x=>x.nome===n);
    const preco=p.promocao>0?p.promocao:p.preco;
    total+=preco*carrinho[n];
    msg+=`• ${n} x${carrinho[n]} — ${money(preco)}\n`;
  });

  msg+=`\n💰 Total: ${money(total)}\n`;

  try{
    await fetch(API_URL,{
      method:"POST",
      body:JSON.stringify({cliente:nome,itens:carrinho,total})
    });

    localStorage.removeItem("carrinho");
    window.open("https://wa.me/555496048808?text="+encodeURIComponent(msg));
    location.reload();

  }catch(e){
    alert("Erro ao enviar pedido. Tente novamente.");
  }
}

/* INIT */
document.addEventListener("DOMContentLoaded",carregar);

/* ============================= */
/* ATUALIZAR ESTOQUE */
/* ============================= */

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
    console.error("Erro ao atualizar estoque:",e);
  }
}

/* ============================= */
/* ANALYTICS SISTEMA */
/* ============================= */

function registrarEvento(evento, dados = {}) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      acao: "analytics",
      evento: evento,
      dados: dados,
      data: new Date().toISOString()
    })
  });
}

/* ============================= */
/* ATUALIZAÇÃO DE ESTOQUE */
/* ============================= */

async function atualizarEstoqueServidor(itens) {
  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        acao: "atualizarEstoque",
        itens: itens
      })
    });
  } catch (e) {
    console.error("Erro ao atualizar estoque:", e);
  }
}
