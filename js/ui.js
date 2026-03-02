
// ===============================
// UI LUXO ESPIRITUAL
// ===============================

const UI = {

  showLoader(state) {
    document.getElementById("globalLoader").classList.toggle("hidden", !state);
  },

  showToast(msg) {
    alert(msg);
  },

  renderProdutos(produtos) {
    const grid = document.getElementById("produtos");
    grid.innerHTML = "";

    produtos.forEach(prod => {

      const card = document.createElement("div");
      card.className = "card";

      if (prod.promocao === "SIM") card.classList.add("promo");
      if (Number(prod.estoque) <= 3) card.classList.add("low-stock");

      card.innerHTML = `
        ${Number(prod.estoque) <= 3 ? `<div class="badge">Últimas unidades</div>` : ""}
        <img src="${prod.imagem}" alt="${prod.nome}">
        <h3>${prod.nome}</h3>
        <div class="preco">R$ ${parseFloat(prod.preco).toFixed(2)}</div>
        <div class="counter">
          <button onclick="Carrinho.diminuir('${prod.nome}')">-</button>
          <span>${Carrinho.getQtd(prod.nome)}</span>
          <button onclick="Carrinho.aumentar('${prod.nome}')">+</button>
        </div>
      `;

      grid.appendChild(card);
    });

  }

};
