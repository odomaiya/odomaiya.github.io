const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

async function carregarProdutos() {
  try {
    const resposta = await fetch(CSV_URL);
    const texto = await resposta.text();
    const linhas = texto.split("\n").slice(1);

    produtos = linhas
      .map(linha => linha.split(","))
      .filter(col => col.length >= 5)
      .map(col => ({
        id: col[0]?.trim(),
        nome: col[1]?.trim(),
        preco: parseFloat(col[2]) || 0,
        categoria: col[3]?.trim(),
        imagem: col[4]?.trim()
      }));

    preencherCategorias();
    renderizarProdutos(produtos);

  } catch (erro) {
    document.getElementById("produtos").innerHTML =
      "<p>Erro ao carregar produtos.</p>";
  }
}

function preencherCategorias() {
  const select = document.getElementById("categoriaFiltro");
  const categorias = [...new Set(produtos.map(p => p.categoria))];

  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function renderizarProdutos(lista) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  lista.forEach(prod => {
    container.innerHTML += `
      <div class="card">
        <img src="${prod.imagem}" alt="${prod.nome}">
        <h3>${prod.nome}</h3>
        <div class="preco">${formatarMoeda(prod.preco)}</div>

        <div class="qtd">
          <button onclick="alterarQtd('${prod.id}', -1)">-</button>
          <span id="qtd-${prod.id}">1</span>
          <button onclick="alterarQtd('${prod.id}', 1)">+</button>
        </div>

        <button class="btn-add" onclick="adicionarCarrinho('${prod.id}')">
          Adicionar
        </button>
      </div>
    `;
  });
}

function alterarQtd(id, valor) {
  const span = document.getElementById(`qtd-${id}`);
  let qtd = parseInt(span.innerText);
  qtd += valor;
  if (qtd < 1) qtd = 1;
  span.innerText = qtd;
}

function adicionarCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  const qtd = parseInt(document.getElementById(`qtd-${id}`).innerText);

  const existente = carrinho.find(p => p.id === id);

  if (existente) {
    existente.quantidade += qtd;
  } else {
    carrinho.push({ ...produto, quantidade: qtd });
  }

  atualizarCarrinho();
}

function atualizarCarrinho() {
  const container = document.getElementById("itensCarrinho");
  container.innerHTML = "";

  let total = 0;
  let totalItens = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    totalItens += item.quantidade;

    container.innerHTML += `
      <p>
        <strong>${item.nome}</strong><br>
        Quantidade: ${item.quantidade}<br>
        Subtotal: ${formatarMoeda(subtotal)}
      </p>
      <hr>
    `;
  });

  document.getElementById("total").innerText =
    "Total: " + formatarMoeda(total);

  document.getElementById("contador").innerText = totalItens;
}

function abrirCarrinho() {
  document.getElementById("carrinho").classList.add("ativo");
  document.getElementById("overlay").classList.add("ativo");
}

function fecharCarrinho() {
  document.getElementById("carrinho").classList.remove("ativo");
  document.getElementById("overlay").classList.remove("ativo");
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = "✨ Pedido Odòmáiyà ✨\n\n🛍️ Itens:\n\n";
  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    mensagem += `• ${item.nome}\n`;
    mensagem += `   Quantidade: ${item.quantidade}\n`;
    mensagem += `   Valor unitário: ${formatarMoeda(item.preco)}\n`;
    mensagem += `   Subtotal: ${formatarMoeda(subtotal)}\n\n`;
  });

  mensagem += `💰 Total do Pedido: ${formatarMoeda(total)}\n\n`;
  mensagem += "Aguardo confirmação e forma de pagamento.";

  const numero = "5599999999999"; // COLOQUE SEU NÚMERO
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.open(link, "_blank");
}

document.getElementById("busca").addEventListener("input", () => {
  const termo = document.getElementById("busca").value.toLowerCase();
  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(termo)
  );
  renderizarProdutos(filtrados);
});

document.getElementById("categoriaFiltro").addEventListener("change", () => {
  const cat = document.getElementById("categoriaFiltro").value;
  const filtrados = cat
    ? produtos.filter(p => p.categoria === cat)
    : produtos;
  renderizarProdutos(filtrados);
});

document.getElementById("ordenar").addEventListener("change", () => {
  const tipo = document.getElementById("ordenar").value;
  let lista = [...produtos];

  if (tipo === "menor") lista.sort((a, b) => a.preco - b.preco);
  if (tipo === "maior") lista.sort((a, b) => b.preco - a.preco);

  renderizarProdutos(lista);
});

carregarProdutos();
