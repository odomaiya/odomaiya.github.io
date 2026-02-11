const numeroWhats = "5554996048808";

const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQpaTmNJYzoenrMirgFZ0mUTchuxEborCjS-z2xOSE-AHxTKlqGFlsVxth1DxKqp34QTFQO68PLGBWB/pub?gid=1234312483&single=true&output=csv";

let produtos = [];
let carrinho = [];

async function carregarProdutos() {
  try {
    const response = await fetch(csvURL);
    const texto = await response.text();

    const linhas = texto.trim().split("\n");
    linhas.shift(); // remove cabeçalho

    produtos = linhas.map(linha => {
      const colunas = linha.split(",");

      return {
        id: colunas[0]?.trim(),
        nome: colunas[1]?.trim(),
        preco: parseFloat(colunas[2]) || 0,
        estoque: parseInt(colunas[3]) || 0,
        categoria: colunas[4]?.trim(),
        imagem: colunas[5]?.trim()
      };
    });

    renderizar(produtos);

  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    document.getElementById("produtos").innerHTML =
      "<p style='text-align:center'>Erro ao carregar produtos.</p>";
  }
}

function renderizar(lista) {
  const area = document.getElementById("produtos");
  area.innerHTML = "";

  if (!lista.length) {
    area.innerHTML = "<p style='text-align:center'>Nenhum produto encontrado.</p>";
    return;
  }

  lista.forEach(p => {
    area.innerHTML += `
      <div class="card">
        <img src="${p.imagem}" onerror="this.src='https://via.placeholder.com/300'">
        <h4>${p.nome}</h4>
        <div class="preco">R$ ${p.preco.toFixed(2)}</div>
        <div class="estoque">Estoque: ${p.estoque}</div>
        <button onclick="adicionar('${p.id}')">Adicionar</button>
      </div>
    `;
  });
}

function adicionar(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  const item = carrinho.find(i => i.id === id);

  if (produto.estoque <= 0) {
    alert("Produto sem estoque.");
    return;
  }

  if (item) {
    if (item.qtd < produto.estoque) {
      item.qtd++;
    } else {
      alert("Estoque máximo atingido.");
    }
  } else {
    carrinho.push({ ...produto, qtd: 1 });
  }

  atualizarCarrinho();
}

function atualizarCarrinho() {
  const area = document.getElementById("itensCarrinho");
  const contador = document.getElementById("contador");

  area.innerHTML = "";

  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach(i => {
    const subtotal = i.qtd * i.preco;
    total += subtotal;
    quantidadeTotal += i.qtd;

    area.innerHTML += `
      <p>
        <strong>${i.nome}</strong><br>
        Quantidade: ${i.qtd}<br>
        Subtotal: R$ ${subtotal.toFixed(2)}
      </p>
      <hr>
    `;
  });

  contador.innerText = quantidadeTotal;
  document.getElementById("total").innerText =
    "Total: R$ " + total.toFixed(2);
}

function abrirCarrinho() {
  document.getElementById("carrinho").classList.toggle("ativo");
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let total = 0;
  let mensagem = "✨ Pedido Odòmáiyà ✨\n\n🛍️ Itens:\n\n";

  carrinho.forEach(i => {
    const subtotal = i.qtd * i.preco;
    total += subtotal;

    mensagem += `• ${i.nome}\n`;
    mensagem += `   Quantidade: ${i.qtd}\n`;
    mensagem += `   Valor unitário: R$ ${i.preco.toFixed(2)}\n`;
    mensagem += `   Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
  });

  mensagem += `💰 Total do Pedido: R$ ${total.toFixed(2)}\n\n`;
  mensagem += "Aguardo confirmação e forma de pagamento.";

  const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

document.getElementById("ordenar").addEventListener("change", function(e) {
  if (e.target.value === "menor") {
    renderizar([...produtos].sort((a,b)=>a.preco-b.preco));
  }
  if (e.target.value === "maior") {
    renderizar([...produtos].sort((a,b)=>b.preco-a.preco));
  }
});

carregarProdutos();
