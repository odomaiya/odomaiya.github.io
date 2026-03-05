const API_URL="https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec"

async function carregarProdutos(){

 try{

  const res=await fetch(API_URL)

  const dados=await res.json()

  if(Array.isArray(dados)) return dados

  if(dados.data) return dados.data

  if(dados.produtos) return dados.produtos

  console.error("API retornou formato inválido",dados)

  return []

 }catch(e){

  console.error("Erro API",e)

  return []

 }

}
