function gerarSugestoes(produtos){

 const area=document.querySelector("#sugestoes");

 let carrinho=JSON.parse(localStorage.getItem("carrinho"))||[];

 if(carrinho.length===0){

  area.style.display="none";
  return;

 }

 let categorias=[];

 carrinho.forEach(item=>{

  let p=produtos.find(x=>x.nome===item.nome);

  if(p) categorias.push(p.categoria);

 });

 const categoriaPrincipal=categorias[0];

 const sugestoes=produtos
 .filter(p=>p.categoria===categoriaPrincipal)
 .slice(0,4);

 area.innerHTML="";

 sugestoes.forEach(p=>{

  area.innerHTML+=cardProduto(p);

 });

}
