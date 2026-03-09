const API_URL="https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec"

async function carregarProdutos(){

 try{

  const res = await fetch(CONFIG.API_URL)

  if(!res.ok){
   throw new Error("Erro na API")
  }

  const data = await res.json()

  if(!Array.isArray(data)) return []

  return data

 }catch(e){

  console.error("Erro ao carregar produtos:",e)
  return []

 }

}

window.carregarProdutos = carregarProdutos
