let indiceBusca=[];

function criarIndice(produtos){

indiceBusca=produtos
.filter(p=>p && p.nome)
.map(p=>({

nome:p.nome.toLowerCase(),
ref:p

}));

}



function buscarProdutos(texto){

if(!texto) return window.listaProdutos;

texto=texto.toLowerCase();

return indiceBusca
.filter(p=>p.nome.includes(texto))
.map(p=>p.ref);

}



function ativarBusca(){

const campo=document.querySelector("#buscaInput");

if(!campo) return;

campo.addEventListener("input",()=>{

const valor=campo.value.trim();

if(valor.length<2){

renderCatalogo(window.listaProdutos);

return;

}

const resultados=buscarProdutos(valor);

renderCatalogo(resultados);

});

}
