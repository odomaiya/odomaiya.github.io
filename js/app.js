// ===============================
// CORE APP
// ===============================

const Carrinho = {

  itens: {},

  aumentar(nome) {
    this.itens[nome] = (this.itens[nome] || 0) + 1;
    this.update();
  },

  diminuir(nome) {
    if (!this.itens[nome]) return;
    this.itens[nome]--;
    if (this.itens[nome] <= 0) delete this.itens[nome];
    this.update();
  },

  getQtd(nome) {
    return this.itens[nome] || 0;
  },

  total() {
    let total = 0;
    Estoque.produtos.forEach(p => {
      if (this.itens[p.nome]) {
        total += p.preco * this.itens[p.nome];
      }
    });
    return total;
  },

  limpar() {
    this.itens = {};
    this.update();
  },

  update() {
    document.getElementById("contadorCarrinho").innerText =
      Object.values(this.itens).reduce((a,b)=>a+b,0);

    UI.renderProdutos(Estoque.produtos);
  }

};

// INICIALIZAÇÃO

document.addEventListener("DOMContentLoaded", async () => {

  await Estoque.carregar();
  Estoque.iniciarPolling();

  document.getElementById("btnCheckout")
    .addEventListener("click", () => Checkout.abrir());

});
