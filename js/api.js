const API_URL="https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec"

 export async function carregarProdutos() {

  const url = CONFIG.PRODUTOS_URL;

  const res = await fetch(url);
  const data = await res.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data;
}
