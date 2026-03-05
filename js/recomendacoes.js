let historico=JSON.parse(localStorage.getItem("historico"))||[];

function registrarInteresse(nome){

 historico.push(nome);

 if(historico.length>50){
  historico.shift();
 }

 localStorage.setItem("historico",JSON.stringify(historico));

}

function recomendar(produtos){

 if(historico.length===0){

  return produtos
  .filter(p=>produtoDisponivel(p))
  .slice(0,4);

 }

 let categorias={};

 historico.forEach(nome=>{

  let prod=window.listaProdutos.find(p=>p.nome===nome);

  if(!prod) return;

  categorias[prod.categoria]=(categorias[prod.categoria]||0)+1;

 });

 let categoriaFavorita=Object.keys(categorias).sort((a,b)=>categorias[b]-categorias[a])[0];

 return produtos
 .filter(p=>p.categoria===categoriaFavorita)
 .filter(p=>produtoDisponivel(p))
 .slice(0,4);

}
