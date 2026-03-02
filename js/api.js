const API = (function () {

  const API_URL = "https://script.google.com/macros/s/AKfycbwL2MmMpDHm-XhkWgFMpkp8am5z8mJukavqilN37ar3T-JGmMq7HlH1T-mE1AI9JqqO/exec";

  async function apiFetch(payload) {
    try {

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Erro na API");
      }

      return await response.json();

    } catch (error) {
      console.error("API ERROR:", error);
      UI.toast("Erro de conexão com o servidor.");
      throw error;
    }
  }

  return {
    getProdutos: () => apiFetch({ acao: "produtos" }),
    enviarPedido: (data) => apiFetch({ acao: "pedido", ...data }),
    atualizarEstoque: (itens) => apiFetch({ acao: "atualizarEstoque", itens }),
    analytics: (evento, dados) =>
      apiFetch({
        acao: "analytics",
        evento,
        dados,
        data: new Date().toISOString()
      })
  };

})();

window.API = API;
