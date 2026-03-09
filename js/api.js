"use strict";

async function carregarProdutos(){

 try{

  const res = await fetch(CONFIG.API_URL)

  if(!res.ok){
   throw new Error("Erro API")
  }

  const data = await res.json()

  if(!Array.isArray(data)){
   return []
  }

  return data

 }catch(e){

  console.error("Erro carregar produtos:",e)
  return []

 }

}

window.carregarProdutos = carregarProdutos
