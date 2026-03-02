const Checkout = (function () {

  async function finalizar(carrinho, cliente) {

    let total = 0;

    const produtos = Estoque.getProdutos();

    Object.keys(carrinho).forEach(nome => {
      const p = produtos.find(x => x.nome === nome);
      const preco = p.promocao > 0 ? p.promocao : p.preco;
      total += preco * carrinho[nome];
    });

    await API.enviarPedido({
      cliente: cliente.nome,
      tipo: cliente.tipo,
      pagamento: cliente.pagamento,
      itens: carrinho,
      total
    });

    await API.atualizarEstoque(carrinho);

    Analytics.track("pedido_finalizado", { total });

    return total;
  }

  return { finalizar };

})();

window.Checkout = Checkout;
