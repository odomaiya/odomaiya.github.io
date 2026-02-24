const App = {

  init() {
    Store.carregarProdutos();
  },

  async finalizar() {

    const nome = prompt("Seu nome:");
    if (!nome) return;

    const tipo = confirm("Clique OK para ENTREGA ou Cancelar para RETIRADA");

    let endereco = "";
    if (tipo) endereco = prompt("Digite seu endereço:");

    const pagamento = prompt("Forma de pagamento:");

    const dados = {
      cliente: nome,
      entrega: tipo ? "Entrega" : "Retirada",
      endereco,
      pagamento,
      itens: Store.carrinho,
      total: Store.total()
    };

    await API.salvarVenda(dados);

    let mensagem = `✨ Pedido - ${CONFIG.LOJA}%0A`;
    mensagem += `Cliente: ${nome}%0A`;
    mensagem += `Tipo: ${dados.entrega}%0A`;
    if (endereco) mensagem += `Endereço: ${endereco}%0A`;
    mensagem += `Pagamento: ${pagamento}%0A`;
    mensagem += `------------------------%0A`;

    for (let item in Store.carrinho) {
      mensagem += `${item} x${Store.carrinho[item]}%0A`;
    }

    mensagem += `------------------------%0A`;
    mensagem += `Total: R$ ${Store.total().toFixed(2)}`;

    window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${mensagem}`);

    location.reload();
  }

};

document.addEventListener("DOMContentLoaded", App.init);
