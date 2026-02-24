const API = {

  async getProdutos() {
    const res = await fetch(CONFIG.API_URL + "?acao=produtos");
    return await res.json();
  },

  async salvarVenda(dados) {
    await fetch(CONFIG.API_URL, {
      method: "POST",
      body: JSON.stringify(dados)
    });
  }

};
