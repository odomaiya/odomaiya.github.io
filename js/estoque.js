const Estoque = (function () {

  let produtos = [];
  let polling;

  async function carregar() {
    UI.loader(true);
    produtos = await API.getProdutos();
    UI.loader(false);
    UIRender.produtos(produtos);
  }

  async function revalidar() {
    const novos = await API.getProdutos();
    produtos = novos;
    UIRender.produtos(produtos);
  }

  function iniciarPolling() {
    polling = setInterval(revalidar, 20000);
  }

  function getProdutos() {
    return produtos;
  }

  return {
    carregar,
    iniciarPolling,
    getProdutos
  };

})();

window.Estoque = Estoque;
