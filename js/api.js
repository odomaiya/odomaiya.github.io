const API_URL = "https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec";

window.API = {

  async getProdutos() {
    const res = await fetch(`${API_URL}?action=getProdutos`);
    if (!res.ok) throw new Error("Erro ao buscar produtos");
    return await res.json();
  },

  async registrarVenda(payload) {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Erro ao registrar venda");
    return await res.json();
  }

};
