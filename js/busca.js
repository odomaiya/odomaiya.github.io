let indiceBusca=[];

function criarIndice(produtos){

 indiceBusca=produtos.map(p=>({

  nome:p.nome.toLowerCase(),

  categoria:p.categoria,

  ref:p

 }));

}



function buscarProdutos(texto){

 texto=texto.toLowerCase();

 return indiceBusca
 .filter(p=>p.nome.includes(texto))
 .map(p=>p.ref);

}



function ativarBusca(){

 const campo=document.querySelector("#buscaInput");

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
