"use strict";

let historico=JSON.parse(localStorage.getItem("historico"))||[]

function registrarInteresse(nome){

 if(!nome) return

 historico.push(nome)

 if(historico.length>50){
 historico.shift()
 }

 localStorage.setItem("historico",JSON.stringify(historico))

}

function gerarRecomendacoes(produtos){

 if(!Array.isArray(produtos)) return []

 return produtos.slice(0,4)

}
