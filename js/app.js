/* ===========================================
   ODÒMÁIYÀ - LUXO ESPIRITUAL ABSOLUTO
=========================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

let produtos = [];
let carrinho = {};
let etapaAtual = 1;

/* ===========================================
   UTIL
=========================================== */

function money(v){
  return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

/* ===========================================
   CARREGAR PRODUTOS
=========================================== */

async function carregar(){
  try{
    const r = await fetch(API_URL+"?acao=produtos",{cache:"no-store"});
    produtos = await r.json();

    produtos.sort((a,b)=>
      (b.promocao>0)-(a.promocao>0) ||
      a.nome.localeCompare(b.nome)
    );

    render(produtos);
   carregarCategorias();
  }catch(e){
    console.error("Erro ao carregar produtos",e);
  }
}

/* ===========================================
   RENDER PRODUTOS
=========================================== */
function carregarCategorias(){
  const select = document.getElementById("filtroCategoria");
  const categorias = [...new Set(produtos.map(p=>p.categoria))];

  categorias.forEach(cat=>{
    const opt = document.createElement("option");
    opt.value = cat;
    opt.innerText = cat;
    select.appendChild(opt);
  });
}

function filtrarCategoria(){
  const cat = document.getElementById("filtroCategoria").value;
  if(!cat){
    render(produtos);
  }else{
    render(produtos.filter(p=>p.categoria===cat));
  }
}

function render(lista){
  const grid = document.getElementById("produtos");
  grid.innerHTML = "";

  lista.forEach(p=>{

    const preco = p.promocao>0 ? p.promocao : p.preco;
    const estoqueBaixo = p.estoque>0 && p.estoque<10;

    const card = document.createElement("div");
    card.className = "produto"
      + (p.promocao>0 ? " promo" : "")
      + (estoqueBaixo ? " quase-esgotado" : "");

    card.innerHTML = `
      ${p.promocao>0?'<div class="faixa-promo">OFERTA ESPECIAL</div>':''}
      ${estoqueBaixo?'<div class="badge-estoque">Poucas unidades</div>':''}
      <img src="${p.imagem}" alt="${p.nome}">
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

/* ===========================================
   ALTERAR QUANTIDADE
=========================================== */

function alterar(nome,valor){
  const produto = produtos.find(p=>p.nome===nome);
  if(!produto) return;

  if(!carrinho[nome]) carrinho[nome]=0;

  if(valor>0 && carrinho[nome]>=produto.estoque){
    alert("Quantidade máxima disponível.");
    return;
  }

  carrinho[nome]+=valor;
  if(carrinho[nome]<0) carrinho[nome]=0;

  render(produtos);
}

/* ===========================================
   CARRINHO DRAWER
=========================================== */

function abrirCarrinho(){
  document.getElementById("carrinho").classList.add("ativo");
  document.getElementById("overlay").classList.add("ativo");
}

function fecharCarrinho(){
  document.getElementById("carrinho").classList.remove("ativo");
  document.getElementById("overlay").classList.remove("ativo");
}

document.getElementById("overlay").addEventListener("click",fecharCarrinho);

function atualizarCarrinho(){
  const area = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contadorCarrinho");

  let total = 0;
  let html = "";

  Object.keys(carrinho).forEach(nome=>{
    if(carrinho[nome]>0){
      const p = produtos.find(x=>x.nome===nome);
      const preco = p.promocao>0?p.promocao:p.preco;
      const subtotal = preco*carrinho[nome];
      total+=subtotal;

      html+=`
        <div style="margin-bottom:12px;">
          <strong>${nome}</strong><br>
          ${carrinho[nome]}x ${money(preco)}
        </div>
      `;
    }
  });

  if(!html) html="<p>Seu carrinho está vazio</p>";

  area.innerHTML = html;
  document.getElementById("valorTotal").innerText = money(total);
  contador.innerText = Object.values(carrinho).reduce((a,b)=>a+b,0);
}

/* ===========================================
   CHECKOUT ETAPAS
=========================================== */

function abrirCheckout(){
  fecharCarrinho();
  document.getElementById("modalCheckout").style.display="flex";
  atualizarSugestao();
}

function proximaEtapa(n){
  if(n===2){
    if(!document.getElementById("cliente").value.trim()){
      alert("Informe seu nome.");
      return;
    }
  }

  document.getElementById("etapa"+etapaAtual).classList.remove("ativa");
  document.getElementById("step"+etapaAtual).classList.remove("active");

  etapaAtual = n;

  document.getElementById("etapa"+etapaAtual).classList.add("ativa");
  document.getElementById("step"+etapaAtual).classList.add("active");
}

function voltarEtapa(n){
  proximaEtapa(n);
}

/* ===========================================
   CEP AUTOMÁTICO AO DIGITAR 8 NÚMEROS
=========================================== */

document.addEventListener("input",async e=>{
  if(e.target.id==="cep"){
    const cep = e.target.value.replace(/\D/g,"");
    if(cep.length===8){
      try{
        const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await r.json();
        if(!data.erro){
          document.getElementById("rua").value=data.logradouro||"";
          document.getElementById("cidade").value=data.localidade||"";
        }
      }catch{}
    }
  }

  if(e.target.id==="tipo"){
    document.getElementById("enderecoArea").style.display=
      e.target.value==="entrega"?"block":"none";
  }
});

/* ===========================================
   SUGESTÃO PREMIUM COM CONTADOR
=========================================== */

function atualizarSugestao(){

  const area = document.getElementById("sugestaoArea");
  area.innerHTML="";

  const itens = Object.keys(carrinho).filter(n=>carrinho[n]>0);
  if(itens.length===0) return;

  const sugestao = produtos.find(p=>!itens.includes(p.nome) && p.estoque>0);
  if(!sugestao) return;

  const preco = sugestao.promocao>0?sugestao.promocao:sugestao.preco;

  area.innerHTML=`
    <div class="produto" style="margin-top:20px;">
      <h3>Você também pode gostar</h3>
      <img src="${sugestao.imagem}">
      <p>${sugestao.nome}</p>
      <div class="preco">${money(preco)}</div>
      <div class="contador">
        <button onclick="alterar('${sugestao.nome}',-1)">−</button>
        <span>${carrinho[sugestao.nome]||0}</span>
        <button onclick="alterar('${sugestao.nome}',1)">+</button>
      </div>
    </div>
  `;
}

/* ===========================================
   FINALIZAR
   ENVIA API -> ABRE WHATSAPP
=========================================== */

async function finalizar(){

  let total=0;
  let msg="✨ *Novo Pedido Odòmáiyà* ✨\n\n";

  const nome = document.getElementById("cliente").value;
  const tipo = document.getElementById("tipo").value;
  const pagamento = document.getElementById("pagamento").value;

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
    if(carrinho[n]>0){
      const p = produtos.find(x=>x.nome===n);
      const preco = p.promocao>0?p.promocao:p.preco;
      total+=preco*carrinho[n];
      msg+=`• ${n} x${carrinho[n]} — ${money(preco)}\n`;
    }
  });

  msg+=`\n💰 Total: ${money(total)}\n`;

  const dados={
    cliente:nome,
    telefone:telefone,
    tipo:tipo,
    pagamento:pagamento,
    itens:carrinho,
    total:total
  };

  try{
    await fetch(API_URL,{
      method:"POST",
      body:JSON.stringify(dados)
    });

    window.open("https://wa.me/555496048808?text="+encodeURIComponent(msg));
    location.reload();

  }catch{
    alert("Erro ao enviar pedido.");
  }

}

/* ===========================================
   INIT
=========================================== */

document.addEventListener("DOMContentLoaded",carregar);
