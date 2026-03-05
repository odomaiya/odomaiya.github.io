let produtos=[];

async function carregarProdutos(){

const r = await fetch(CONFIG.API_URL+"?acao=produtos",{cache:"no-store"});

produtos = await r.json();

produtos.sort((a,b)=>a.nome.localeCompare(b.nome));

renderProdutos(produtos);

}

function buscarProdutos(texto){

texto=texto.toLowerCase();

const filtrados = produtos.filter(p=>
p.nome.toLowerCase().includes(texto)
);

renderProdutos(filtrados);

}
