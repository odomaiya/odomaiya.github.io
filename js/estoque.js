window.ESTOQUE = {

  lista: [],

  async carregar() {
    try {
      this.lista = await API.getProdutos();
      UI.renderProdutos(this.lista);
    } catch (e) {
      UI.erro("Erro ao carregar produtos.");
    }
  },

  iniciarPolling() {
    setInterval(async () => {
      try {
        const atualizada = await API.getProdutos();
        this.lista = atualizada;
        UI.renderProdutos(this.lista);
      } catch (e) {
        console.warn("Polling falhou.");
      }
    }, 15000);
  }

};
