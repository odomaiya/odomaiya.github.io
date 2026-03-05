const API_URL="https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec";

async function buscarProdutos(){

 const res=await fetch(API_URL);

 const data=await res.json();

 return data.map(p=>({

  nome:p.nome,
  preco:Number(p.preco),
  promocao:(p.promocao||"").toUpperCase(),
  categoria:(p.categoria||"").toLowerCase(),
  imagem:p.imagem,
  estoque:Number(p.estoque)

 }));

}
