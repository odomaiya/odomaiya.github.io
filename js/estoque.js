let estoqueCache={}

function atualizarEstoque(produtos){

produtos.forEach(p=>{

estoqueCache[p.id]=p.estoque

})

}

function verificarEstoque(id){

return estoqueCache[id] || 0

}
