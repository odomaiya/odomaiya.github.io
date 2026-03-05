let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

function salvarCarrinho(){

localStorage.setItem("carrinho",JSON.stringify(carrinho));

}

function adicionarCarrinho(nome){

const produto = produtos.find(p=>p.nome===nome);

if(!carrinho[nome]) carrinho[nome]=0;

if(carrinho[nome] >= produto.estoque){
alert("Quantidade máxima disponível");
return;
}

carrinho[nome]++;

salvarCarrinho();

renderProdutos(produtos);
atualizarCarrinho();

}

function removerCarrinho(nome){

if(!carrinho[nome]) return;

carrinho[nome]--;

if(carrinho[nome]<=0) delete carrinho[nome];

salvarCarrinho();

renderProdutos(produtos);
atualizarCarrinho();

}

function removerItem(nome){

delete carrinho[nome];

salvarCarrinho();

renderProdutos(produtos);
atualizarCarrinho();

}

function totalCarrinho(){

let total=0;

Object.keys(carrinho).forEach(nome=>{

const p = produtos.find(x=>x.nome===nome);

if(!p) return;

const preco = p.promocao>0?p.promocao:p.preco;

total += preco * carrinho[nome];

});

return total;

}
