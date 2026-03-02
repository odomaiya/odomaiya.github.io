window.UI = {

  carrinho: [],

  renderProdutos(lista) {
    const grid = document.querySelector("#produtos");
    if (!grid) return;

    if (!lista.length) {
      grid.innerHTML = `<div class="empty">Nenhum produto encontrado</div>`;
      return;
    }

    grid.innerHTML = lista.map(p => `
      <div class="card">
        <img src="${p.imagem}" alt="${p.nome}">
        <h3>${p.nome}</h3>
        <p class="preco">R$ ${p.preco.toFixed(2)}</p>
        <p class="estoque">${p.estoque > 0 ? "Disponível" : "Sem estoque"}</p>
        <button onclick="UI.addCarrinho('${p.nome}')"
          ${p.estoque <= 0 ? "disabled" : ""}>
          Adicionar
        </button>
      </div>
    `).join("");
  },

  addCarrinho(nome) {
    const produto = ESTOQUE.lista.find(p => p.nome === nome);
    if (!produto || produto.estoque <= 0) return;

    const item = this.carrinho.find(i => i.nome === nome);
    if (item) {
      item.quantidade++;
    } else {
      this.carrinho.push({
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1
      });
    }

    this.renderCarrinho();
  },

  renderCarrinho() {
    const box = document.querySelector("#carrinho-itens");
    const totalBox = document.querySelector("#carrinho-total");

    if (!box) return;

    if (!this.carrinho.length) {
      box.innerHTML = `<p class="empty">Carrinho vazio</p>`;
      totalBox.innerText = "R$ 0,00";
      return;
    }

    let total = 0;

    box.innerHTML = this.carrinho.map(i => {
      total += i.preco * i.quantidade;
      return `
        <div class="item">
          <span>${i.nome}</span>
          <span>${i.quantidade}x</span>
        </div>
      `;
    }).join("");

    totalBox.innerText = `R$ ${total.toFixed(2)}`;
  },

  async finalizar() {

    if (!this.carrinho.length) {
      alert("Carrinho vazio.");
      return;
    }

    const payload = {
      action: "registrarVenda",
      cliente: document.querySelector("#cliente").value || "Cliente",
      entrega: document.querySelector("#entrega").value,
      pagamento: document.querySelector("#pagamento").value,
      itens: JSON.stringify(this.carrinho),
      total: this.carrinho.reduce((t,i)=>t+i.preco*i.quantidade,0)
    };

    try {
      await API.registrarVenda(payload);
      alert("Pedido enviado com sucesso!");
      this.carrinho = [];
      this.renderCarrinho();
      ESTOQUE.carregar();
    } catch {
      alert("Erro ao finalizar pedido.");
    }
  },

  iniciarEventos() {
    const btn = document.querySelector("#btn-finalizar");
    if (btn) {
      btn.addEventListener("click", () => this.finalizar());
    }
  },

  erro(msg){
    const grid = document.querySelector("#produtos");
    grid.innerHTML = `<div class="empty">${msg}</div>`;
  }

};
