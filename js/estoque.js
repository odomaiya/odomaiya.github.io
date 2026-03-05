function produtoDisponivel(produto){

 if(!produto) return false;

 if(produto.estoque===undefined) return false;

 if(Number(produto.estoque)<=0) return false;

 return true;

}
