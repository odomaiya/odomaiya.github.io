"use strict";

async function carregarDashboard(){

 const produtos=await carregarProdutos()

 const totalProdutos=produtos.length

 let estoqueTotal=0

 produtos.forEach(p=>{
 estoqueTotal+=Number(p.estoque)
 })

 document.getElementById("dash-produtos").innerText=totalProdutos
 document.getElementById("dash-estoque").innerText=estoqueTotal

}
