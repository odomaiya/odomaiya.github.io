// ===============================
// ESTOQUE + POLLING
// ===============================

const Estoque = {

  produtos: [],
  pollingInterval: null,

  async carregar() {
    UI.showLoader(true);
    const data = await API.getProdutos();
    if (!data) return;

    this.produtos = data;
    UI.renderProdutos(this.produtos);
    UI.showLoader(false);
  },

  iniciarPolling() {
    this.pollingInterval = setInterval(() => {
      this.revalidar();
    }, 20000);
  },

  async revalidar() {
    const data = await API.getProdutos();
    if (!data) return;

    this.produtos = data;
    UI.renderProdutos(this.produtos);
  }

};
