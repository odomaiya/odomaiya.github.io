const API_URL = "https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec";

const API = {
  async carregarProdutos(){
    const res = await fetch(API_URL);
    return await res.json();
  }
};
