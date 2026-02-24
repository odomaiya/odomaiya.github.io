const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

const WHATSAPP_NUMERO = "555496048808"; 

let produtos = [];
let carrinho = [];

async function carregarProdutos(){
  const res = await fetch(API_URL + "?acao=produtos");
  produtos = await res.json();

  produtos.sort((a,b)=> (b.promocao>0?1:0)-(a.promocao>0?1:0));

  renderizarProdutos(produtos);
}

function renderizarProdutos(lista){
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  lista.forEach(prod=>{
    const preco = prod.promocao>0 ? prod.promocao : prod.preco;
    const promoBadge = prod.promocao>0 ? `<div class="badge">🔥 Promoção</div>` : "";

    grid.innerHTML += `
      <div class="card">
        ${promoBadge}
        <img src="${prod.imagem}">
        <h3>${prod.nome}</h3>
        <div>
          ${prod.promocao>0 ? `<span class="old">R$ ${prod.preco}</span>`:""}
          <div class="new">R$ ${preco}</div>
        </div>
        <div class="stock">Estoque: ${prod.estoque}</div>
        <button onclick="adicionarCarrinho('${prod.nome}',${preco})">Adicionar</button>
      </div>
    `;
  });
}

function adicionarCarrinho(nome,preco){
  const item = carrinho.find(p=>p.nome===nome);
  if(item){
    item.qtd++;
  } else {
    carrinho.push({nome,preco,qtd:1});
  }
  atualizarCarrinho();
}

function atualizarCarrinho(){
  const container = document.getElementById("cartItems");
  container.innerHTML = "";
  let total = 0;

  carrinho.forEach(item=>{
    const subtotal = item.preco * item.qtd;
    total += subtotal;

    container.innerHTML += `
      <div class="cart-item">
        <strong>${item.nome}</strong><br>
        🔢 Qtd: ${item.qtd}<br>
        💰 R$ ${subtotal.toFixed(2)}
      </div>
    `;
  });

  document.getElementById("cartTotal").innerText = "Total: R$ " + total.toFixed(2);
}

function finalizarPedido(){
  if(carrinho.length===0){
    alert("Carrinho vazio!");
    return;
  }

  let mensagem = `✨ *Pedido - ODO MAIYÀ* ✨\n\n`;
  let total = 0;

  carrinho.forEach(item=>{
    const subtotal = item.preco*item.qtd;
    total += subtotal;
    mensagem += `🛍 *${item.nome}*\n`;
    mensagem += `🔢 Quantidade: ${item.qtd}\n`;
    mensagem += `💰 Valor: R$ ${subtotal.toFixed(2)}\n\n`;
  });

  mensagem += `📦 *Total do Pedido:* R$ ${total.toFixed(2)}\n\n`;
  mensagem += `🙏 Aguardo confirmação.`;

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
  window.open(url,'_blank');
}

carregarProdutos();
