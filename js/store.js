const Store = {

  produtos: [],
  carrinho: {},

  async carregarProdutos() {
    this.produtos = await API.getProdutos();

    // promoções primeiro
    this.produtos.sort((a,b)=>{
      return (b.promocao > 0) - (a.promocao > 0);
    });

    UI.renderProdutos(this.produtos);
    UI.criarFiltros(this.produtos);
  },

  adicionar(id) {
    const p = this.produtos.find(x => x.nome === id);
    if (!p || p.estoque <= 0) return;

    if (!this.carrinho[id]) this.carrinho[id] = 0;
    this.carrinho[id]++;
    p.estoque--;

    UI.update();
  },

  remover(id) {
    if (!this.carrinho[id]) return;
    this.carrinho[id]--;
    const p = this.produtos.find(x => x.nome === id);
    p.estoque++;

    if (this.carrinho[id] <= 0) delete this.carrinho[id];

    UI.update();
  },

  total() {
    let total = 0;
    for (let nome in this.carrinho) {
      const p = this.produtos.find(x=>x.nome===nome);
      const preco = p.promocao > 0 ? p.promocao : p.preco;
      total += preco * this.carrinho[nome];
    }
    return total;
  }

};
