/* =========================================
SISTEMA DE SUGESTÕES
Quem comprou também levou
Odòmáiyà Artigos Religiosos
========================================= */

function gerarSugestoes(produtos){

 const area = document.querySelector("#sugestoes")

 if(!area) return

 let carrinho = JSON.parse(localStorage.getItem("cart")) || []

 if(carrinho.length === 0){

  area.style.display = "none"
  return

 }

 /* CATEGORIAS DO CARRINHO */

 let categorias = {}

 carrinho.forEach(item=>{

  const p = produtos.find(x => x.nome === item.nome)

  if(!p) return

  const cat = p.categoria || "outros"

  categorias[cat] = (categorias[cat] || 0) + 1

 })

 /* CATEGORIA PRINCIPAL */

 const categoriaPrincipal =
 Object.keys(categorias)
 .sort((a,b)=>categorias[b]-categorias[a])[0]

 if(!categoriaPrincipal){
  area.style.display="none"
  return
 }

 /* PRODUTOS DO CARRINHO */

 const idsCarrinho = carrinho.map(i=>i.nome)

 /* GERAR SUGESTÕES */

 const sugestoes = produtos
  .filter(p => p.categoria === categoriaPrincipal)
  .filter(p => !idsCarrinho.includes(p.nome))
  .filter(p => Number(p.estoque) > 0)
  .slice(0,4)

 if(sugestoes.length === 0){
  area.style.display="none"
  return
 }

 /* RENDER */

 area.style.display = "block"

 area.innerHTML = ""

 sugestoes.forEach(p=>{
  area.innerHTML += cardProduto(p)
 })

}
