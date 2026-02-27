/* ==========================================================
   ODÒMÁIYÀ ENTERPRISE SYSTEM
   Sistema completo, robusto e profissional
========================================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

const API_URL = "SUA_URL_AQUI";

let produtos = [];
let carrinho = [];

document.addEventListener("DOMContentLoaded", ()=>{
  carregarProdutos();
  document.getElementById("busca").addEventListener("input", filtrarProdutos);
  document.getElementById("tipo").addEventListener("change", alternarEndereco);
});

async function carregarProdutos(){
  const res = await fetch(API_URL);
  produtos = await res.json();
  renderizarProdutos(produtos);
}

function renderizarProdutos(lista){
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach(prod=>{
    container.innerHTML += `
      <div class="card">
        <img src="${prod.imagem}">
        <div class="card-content">
          <div>
            <h3>${prod.nome}</h3>
            ${prod.promocao ? `<div class="promocao">Promoção</div>` : ""}
            <div class="preco">R$ ${prod.preco}</div>
            <div>Estoque: ${prod.estoque}</div>
          </div>
          <button class="btn-add" onclick="adicionarCarrinho('${prod.nome}', ${prod.preco})">Adicionar</button>
        </div>
      </div>
    `;
  });
}

function filtrarProdutos(){
  const termo = document.getElementById("busca").value.toLowerCase();
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
  renderizarProdutos(filtrados);
}

function adicionarCarrinho(nome, preco){
  carrinho.push({nome, preco});
  atualizarCarrinho();
}

function atualizarCarrinho(){
  const container = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contadorCarrinho");
  const totalEl = document.getElementById("valorTotal");

  container.innerHTML = "";
  let total = 0;

  carrinho.forEach((item,i)=>{
    total += Number(item.preco);
    container.innerHTML += `
      <div class="item">
        ${item.nome}
        <span>R$ ${item.preco}</span>
      </div>
    `;
  });

  contador.innerText = carrinho.length;
  totalEl.innerText = "R$ " + total.toFixed(2);
}

function abrirCarrinho(){
  document.getElementById("carrinho").classList.add("aberto");
}

function fecharCarrinho(){
  document.getElementById("carrinho").classList.remove("aberto");
}

function abrirCheckout(){
  document.getElementById("modalCheckout").style.display="flex";
}

function proximaEtapa(num){
  document.querySelectorAll(".etapa").forEach(e=>e.classList.remove("ativa"));
  document.getElementById("etapa"+num).classList.add("ativa");

  document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
  for(let i=1;i<=num;i++){
    document.getElementById("step"+i).classList.add("active");
  }
}

function alternarEndereco(){
  const tipo = document.getElementById("tipo").value;
  document.getElementById("enderecoArea").style.display = tipo==="entrega"?"block":"none";
}

function finalizar(){
  const nome = document.getElementById("cliente").value;
  const telefone = document.getElementById("telefone").value;
  const pagamento = document.getElementById("pagamento").value;

  if(!nome || !telefone){
    alert("Preencha os dados.");
    return;
  }

  let mensagem = `Pedido de ${nome}%0A`;
  carrinho.forEach(item=>{
    mensagem += `${item.nome} - R$ ${item.preco}%0A`;
  });

  window.open(`https://wa.me/555496048808?text=${mensagem}`);
}
