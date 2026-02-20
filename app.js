const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

// ======================
// CARREGAR PRODUTOS
// ======================

async function carregarProdutos() {
  try {
    const response = await fetch(urlCSV);
    const texto = await response.text();

    const linhas = texto.trim().split("\n");
    linhas.shift(); // remove cabeçalho

    produtos = linhas.map(linha => {
      const colunas = linha.split(",");

      return {
        nome: colunas[1] || "",
        preco: parseFloat(colunas[2]) || 0,
        categoria: colunas[3] || "Geral",
        imagem: colunas[4] || ""
      };
    });

    renderizar(produtos);

  } catch (erro) {
    document.getElementById("produtos").innerHTML =
      "<p style='padding:20px'>Erro ao carregar produtos. Verifique a planilha.</p>";
    console.error(erro);
  }
}

// ======================
// RENDER
// ======================

function renderizar(lista) {
  const area = document.getElementById("produtos");
  area.innerHTML = "";

  lista.forEach(p => {
    area.innerHTML += `
      <div class="card">
        <img src="${p.imagem}" onerror="this.src='https://via.placeholder.com/300x300?text=Sem+Imagem'">
        <h4>${p.nome}</h4>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>
        <div class="controle">
          <button onclick="alterarQtd('${p.nome}', -1)">−</button>
          <span>${quantidadeNoCarrinho(p.nome)}</span>
          <button onclick="alterarQtd('${p.nome}', 1)">+</button>
        </div>
      </div>
    `;
  });
}

// ======================
// CARRINHO
// ======================

function alterarQtd(nome, valor) {
  const item = carrinho.find(i => i.nome === nome);

  if (item) {
    item.qtd += valor;
    if (item.qtd <= 0) {
      carrinho = carrinho.filter(i => i.nome !== nome);
    }
  } else if (valor > 0) {
    const produto = produtos.find(p => p.nome === nome);
    carrinho.push({ ...produto, qtd: 1 });
  }

  atualizarCarrinho();
  renderizar(produtos);
}

function quantidadeNoCarrinho(nome) {
  const item = carrinho.find(i => i.nome === nome);
  return item ? item.qtd : 0;
}

function atualizarCarrinho() {
  const area = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contador");
  let total = 0;
  let quantidade = 0;

  area.innerHTML = "";

  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;
    quantidade += item.qtd;

    area.innerHTML += `
      <div style="margin-bottom:10px">
        <strong>${item.nome}</strong><br>
        ${item.qtd}x R$ ${item.preco.toFixed(2)}<br>
        Subtotal: R$ ${subtotal.toFixed(2)}
      </div>
    `;
  });

  contador.innerText = quantidade;
  document.getElementById("total").innerText =
    "Total: R$ " + total.toFixed(2);
}

// ======================
// FILTROS
// ======================

document.getElementById("ordenar")?.addEventListener("change", e => {
  if (e.target.value === "menor") {
    renderizar([...produtos].sort((a, b) => a.preco - b.preco));
  }
  if (e.target.value === "maior") {
    renderizar([...produtos].sort((a, b) => b.preco - a.preco));
  }
});

document.getElementById("busca")?.addEventListener("input", e => {
  const termo = e.target.value.toLowerCase();
  renderizar(produtos.filter(p =>
    p.nome.toLowerCase().includes(termo)
  ));
});

// ======================
// INICIAR
// ======================

carregarProdutos();
