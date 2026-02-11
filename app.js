const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

async function carregarProdutos() {
  const resposta = await fetch(url);
  const texto = await resposta.text();
  const linhas = texto.split("\n").slice(1);

  produtos = linhas.map(linha => {
    const colunas = linha.split(",");
    return {
      nome: colunas[0],
      preco: parseFloat(colunas[1])
    };
  });

  mostrarProdutos(produtos);
}

function mostrarProdutos(lista) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach(produto => {
    container.innerHTML += `
      <div class="card">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco.toFixed(2)}</p>
        <button class="btn-add" onclick="adicionar('${produto.nome}', ${produto.preco})">
          Adicionar
        </button>
      </div>
    `;
  });
}

function adicionar(nome, preco) {
  const item = carrinho.find(p => p.nome === nome);
  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ nome, preco, qtd: 1 });
  }
  atualizarCarrinho();
}

function alterarQtd(nome, valor) {
  const item = carrinho.find(p => p.nome === nome);
  if (!item) return;

  item.qtd += valor;
  if (item.qtd <= 0) {
    carrinho = carrinho.filter(p => p.nome !== nome);
  }

  atualizarCarrinho();
}

function atualizarCarrinho() {
  const container = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contador");
  const totalEl = document.getElementById("total");

  container.innerHTML = "";
  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach(item => {
    total += item.preco * item.qtd;
    quantidadeTotal += item.qtd;

    container.innerHTML += `
      <div class="item-carrinho">
        <strong>${item.nome}</strong>
        <div>R$ ${(item.preco * item.qtd).toFixed(2)}</div>
        <div class="controls">
          <button onclick="alterarQtd('${item.nome}', -1)">-</button>
          <span>${item.qtd}</span>
          <button onclick="alterarQtd('${item.nome}', 1)">+</button>
        </div>
      </div>
    `;
  });

  contador.innerText = quantidadeTotal;
  totalEl.innerText = "Total: R$ " + total.toFixed(2);
}

function toggleCarrinho() {
  document.getElementById("carrinho").classList.toggle("ativo");
}

function finalizarPedido() {
  if (carrinho.length === 0) return;

  let mensagem = "✨ Pedido Odòmáiyà ✨\n\n🛍️ Itens:\n\n";
  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;
    mensagem += `• ${item.nome}\nQuantidade: ${item.qtd}\nSubtotal: R$ ${subtotal.toFixed(2)}\n\n`;
  });

  mensagem += `💰 Total do Pedido: R$ ${total.toFixed(2)}\n\nAguardo confirmação e forma de pagamento.`;

  const numero = "55SEUNUMEROAQUI";
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, "_blank");
}

carregarProdutos();
