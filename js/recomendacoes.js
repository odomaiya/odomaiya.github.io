/* =========================================
SISTEMA DE RECOMENDAÇÕES INTELIGENTES
Odòmáiyà Artigos Religiosos
========================================= */

let historico = JSON.parse(localStorage.getItem("historico")) || []


/* =========================================
REGISTRAR INTERESSE
========================================= */

function registrarInteresse(nome){

 if(!nome) return

 historico.push(nome)

 if(historico.length > 50){
  historico.shift()
 }

 localStorage.setItem("historico", JSON.stringify(historico))

}


/* =========================================
VERIFICAR SE PRODUTO ESTÁ DISPONÍVEL
========================================= */

function produtoDisponivel(p){

 if(!p) return false

 const estoque = Number(p.estoque) || 0

 return estoque > 0

}


/* =========================================
GERAR RECOMENDAÇÕES
========================================= */

function gerarRecomendacoes(produtos){

 if(!produtos || produtos.length === 0) return []

 /* SEM HISTÓRICO -> MOSTRA POPULARES */

 if(historico.length === 0){

  return produtos
   .filter(produtoDisponivel)
   .slice(0,4)

 }

 /* ANALISAR CATEGORIAS VISITADAS */

 let categorias = {}

 historico.forEach(nome=>{

  const prod = window.listaProdutos.find(p => p.nome === nome)

  if(!prod) return

  const cat = prod.categoria || "outros"

  categorias[cat] = (categorias[cat] || 0) + 1

 })

 const categoriaFavorita =
 Object.keys(categorias)
 .sort((a,b)=>categorias[b]-categorias[a])[0]

 if(!categoriaFavorita){

  return produtos
  .filter(produtoDisponivel)
  .slice(0,4)

 }

 /* RECOMENDAR PRODUTOS DA CATEGORIA FAVORITA */

 let recomendados = produtos
  .filter(p => p.categoria === categoriaFavorita)
  .filter(produtoDisponivel)
  .slice(0,4)

 /* SE NÃO TIVER SUFICIENTE */

 if(recomendados.length < 4){

  const extras = produtos
   .filter(produtoDisponivel)
   .slice(0, 4 - recomendados.length)

  recomendados = recomendados.concat(extras)

 }

 return recomendados

}
