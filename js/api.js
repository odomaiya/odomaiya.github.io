// ===============================
// API ODÒMÁIYÀ V3
// ===============================

const API_URL = "https://script.google.com/macros/s/AKfycbwL2MmMpDHm-XhkWgFMpkp8am5z8mJukavqilN37ar3T-JGmMq7HlH1T-mE1AI9JqqO/exec";

async function apiFetch(action, payload = {}) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action, ...payload }),
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Erro de conexão");

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API ERROR:", error);
    UI.showToast("Erro de conexão com servidor");
    return null;
  }
}

const API = {

  async getProdutos() {
    return await apiFetch("getProdutos");
  },

  async registrarVenda(venda) {
    return await apiFetch("registrarVenda", venda);
  },

  async registrarAnalytics(evento, dados) {
    return await apiFetch("analytics", {
      evento,
      dados
    });
  }

};
