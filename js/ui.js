const UI = {

  renderProdutos(lista) {
    const grid = document.getElementById("products");
    grid.innerHTML = "";

    lista.forEach(p => {

      const promo = p.promocao > 0;
      const preco = promo ? p.promocao : p.preco;

      grid.innerHTML += `
      <div class="card ${promo ? 'promo':''}">
        ${promo ? `<div class="badge">PROMOÇÃO</div>`:''}
        <img src="${p.imagem}" loading="lazy">
        <h3>${p.nome}</h3>

        <div class="price">
          ${promo ? `<span class="old">R$ ${p.preco}</span>`:''}
          <span class="new">R$ ${preco}</span>
        </div>

        <div class="stock">Estoque: ${p.estoque}</div>

        <div class="qty">
          <button onclick="Store.remover('${p.nome}')">-</button>
          <span>${Store.carrinho[p.nome] || 0}</span>
          <button onclick="Store.adicionar('${p.nome}')">+</button>
        </div>
      </div>
      `;
    });
  },

  update() {
    this.renderProdutos(Store.produtos);
    document.getElementById("cart-count").innerText =
      Object.values(Store.carrinho).reduce((a,b)=>a+b,0);

    this.renderCart();
  },

  toggleCart() {
    document.getElementById("cartDrawer").classList.toggle("open");
    this.renderCart();
  },

  renderCart() {
    const drawer = document.getElementById("cartDrawer");

    let html = `<h2>Seu Carrinho</h2>`;
    html += `<div>Total: R$ ${Store.total().toFixed(2)}</div>`;

    html += `<button onclick="App.finalizar()">Finalizar Pedido</button>`;

    drawer.innerHTML = html;
  }

};
