document.addEventListener("DOMContentLoaded", async () => {
  const produtosContainer = document.getElementById("produtos");
  const loader = document.getElementById("loaderGlobal");

  loader.style.display = "flex";

  try {
    let produtos = [];

    // Tenta buscar da API
    if (typeof API !== "undefined" && API.getProdutos) {
      produtos = await API.getProdutos();
    }

    // Fallback caso API falhe ou retorne vazio
    if (!produtos || produtos.length === 0) {
      produtos = [
        {
          id: 1,
          nome: "Guia de Oxum",
          preco: 89.9,
          imagem: "https://via.placeholder.com/300x300?text=Guia+Oxum"
        },
        {
          id: 2,
          nome: "Imagem de Ogum",
          preco: 159.9,
          imagem: "https://via.placeholder.com/300x300?text=Ogum"
        },
        {
          id: 3,
          nome: "Incenso Natural",
          preco: 19.9,
          imagem: "https://via.placeholder.com/300x300?text=Incenso"
        }
      ];
    }

    renderizarProdutos(produtos);

  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    produtosContainer.innerHTML = `
      <div style="text-align:center; padding:40px;">
        <h2>Não foi possível carregar os produtos</h2>
        <p>Verifique a conexão ou a API.</p>
      </div>
    `;
  }

  loader.style.display = "none";
});

function renderizarProdutos(lista) {
  const container = document.getElementById("produtos");

  if (!lista.length) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px;">
        <h2>Nenhum produto encontrado</h2>
      </div>
    `;
    return;
  }

  container.innerHTML = lista.map(produto => `
    <div class="produto">
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
      <button onclick="adicionarCarrinho(${produto.id})">
        Adicionar
      </button>
    </div>
  `).join("");
}

/* ============================
   CARRINHO SIMPLES
============================ */

let carrinho = [];

function adicionarCarrinho(id) {
  carrinho.push(id);
  atualizarCarrinho();
  mostrarToast("Produto adicionado!");
}

function atualizarCarrinho() {
  document.getElementById("contadorCarrinho").innerText = carrinho.length;
}

function mostrarToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
