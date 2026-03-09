"use strict";

function rankingMaisVendidos(produtos){

 let vendas=JSON.parse(localStorage.getItem("ranking"))||{}

 produtos.forEach(p=>{
 if(!vendas[p.id]) vendas[p.id]=0
 })

 let ordenado=[...produtos].sort((a,b)=>{

 return (vendas[b.id]||0)-(vendas[a.id]||0)

 })

 return ordenado.slice(0,4)

}
