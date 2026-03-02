const App = (function () {

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

  function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  function adicionar(nome) {
    if (!carrinho[nome]) carrinho[nome] = 0;
    carrinho[nome]++;
    salvarCarrinho();
    UI.toast("Produto adicionado");
    UIRender.carrinho(carrinho);
  }

  function remover(nome) {
    delete carrinho[nome];
    salvarCarrinho();
    UIRender.carrinho(carrinho);
  }

  async function finalizar() {

    const cliente = {
      nome: document.getElementById("cliente").value,
      tipo: document.getElementById("tipo").value,
      pagamento: document.getElementById("pagamento").value
    };

    const total = await Checkout.finalizar(carrinho, cliente);

    const msg = `✨ Novo Pedido Odòmáiyà ✨\nTotal: ${UI.money(total)}`;

    window.open("https://wa.me/555496048808?text=" + encodeURIComponent(msg));

    carrinho = {};
    salvarCarrinho();
    location.reload();
  }

  function init() {
    Estoque.carregar();
    Estoque.iniciarPolling();
  }

  return {
    init,
    adicionar,
    remover,
    finalizar
  };

})();

window.App = App;

document.addEventListener("DOMContentLoaded", App.init);
