document.addEventListener("DOMContentLoaded", () => {

  ESTOQUE.carregar();
  ESTOQUE.iniciarPolling();

  UI.iniciarEventos();
});
