const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

async function carregarProdutos() {
  const res = await fetch(url);
  const text = await res.text();

  const linhas = text.split("\n").slice(1);

  produtos = linhas.map(l => {
    const c = l.split(",");

    return {
      id: c[0]?.trim(),
      nome: c[1]?.trim(),
      preco: parseFloat(c[2]?.replace(",", ".").trim()),
      categoria: c[3]?.trim(),
      estoque: parseInt(c[4]),
      imagens: c.slice(5).filter(i => i)
    };
  }).filter(p => p.nome && !isNaN(p.preco));

  mostrarProdutos(produtos);
}

function mostrarProdutos(lista) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <div class="imagem-container">
          <img src="${p.imagens[0] || 'https://via.placeholder.com/300'}" 
               onclick="abrirModal('${p.imagens[0]}')">
        </div>

        <h3>${p.nome}</h3>
        <p class="preco">R$ ${p.preco.toFixed(2)}</p>

        <div class="controle">
          <button onclick="alterarQtd('${p.id}', -1)">−</button>
          <span id="qtd-${p.id}">0</span>
          <button onclick="alterarQtd('${p.id}', 1)">+</button>
        </div>
      </div>
    `;
  });
}

function alterarQtd(id, valor) {
  const produto = produtos.find(p => p.id == id);
  let item = carrinho.find(p => p.id == id);

  if (!item && valor > 0) {
    carrinho.push({ ...produto, qtd: 1 });
  } else if (item) {
    item.qtd += valor;
    if (item.qtd <= 0) {
      carrinho = carrinho.filter(p => p.id != id);
    }
  }

  atualizarCarrinho();
  atualizarCards();
}

function atualizarCards() {
  produtos.forEach(p => {
    const item = carrinho.find(i => i.id == p.id);
    const el = document.getElementById(`qtd-${p.id}`);
    if (el) el.innerText = item ? item.qtd : 0;
  });
}

function atualizarCarrinho() {
  const container = document.getElementById("itensCarrinho");
  const totalEl = document.getElementById("total");

  container.innerHTML = "";
  let total = 0;

  carrinho.forEach(i => {
    const sub = i.preco * i.qtd;
    total += sub;

    container.innerHTML += `
      <div class="item-carrinho">
        <div>
          <strong>${i.nome}</strong>
          <p>${i.qtd}x R$ ${i.preco.toFixed(2)}</p>
        </div>
        <div class="acoes">
          <button onclick="alterarQtd('${i.id}', -1)">−</button>
          <button onclick="alterarQtd('${i.id}', 1)">+</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = "Total: R$ " + total.toFixed(2);
}

function finalizarPedido() {
  if (carrinho.length === 0) return alert("Seu carrinho está vazio");

  let mensagem = "🛍️ Pedido - Odòmáiyà\n\n";
  let total = 0;

  carrinho.forEach(i => {
    const sub = i.preco * i.qtd;
    total += sub;

    mensagem += `${i.nome}\n`;
    mensagem += `Qtd: ${i.qtd}\n`;
    mensagem += `Subtotal: R$ ${sub.toFixed(2)}\n\n`;
  });

  mensagem += `Total: R$ ${total.toFixed(2)}`;

  window.open(`https://wa.me/55SEUNUMERO?text=${encodeURIComponent(mensagem)}`);
}

function abrirModal(img) {
  document.getElementById("modalImg").src = img;
  document.getElementById("modal").classList.add("ativo");
}

function fecharModal() {
  document.getElementById("modal").classList.remove("ativo");
}

carregarProdutos();
