/* =========================================
SISTEMA DE BUSCA INTELIGENTE
Odòmáiyà Artigos Religiosos
========================================= */

let indiceBusca = [];


/* =========================================
CRIAR ÍNDICE DE BUSCA
========================================= */

function criarIndice(produtos){

 if(!Array.isArray(produtos)) return

 indiceBusca = produtos
  .filter(p => p && p.nome)
  .map(p => ({

   nome: String(p.nome).toLowerCase(),

   categoria: String(p.categoria || "").toLowerCase(),

   ref: p

  }))

}


/* =========================================
BUSCAR PRODUTOS
========================================= */

function buscarProdutos(texto){

 if(!texto) return window.listaProdutos || []

 texto = texto.toLowerCase()

 return indiceBusca
  .filter(p =>

   p.nome.includes(texto) ||

   p.categoria.includes(texto)

  )
  .map(p => p.ref)

}


/* =========================================
GERAR SUGESTÕES TIPO AMAZON
========================================= */

function gerarSugestoes(produtos){

 const sugestaoBox = document.getElementById("sugestoes")

 if(!sugestaoBox) return

 sugestaoBox.innerHTML = ""

 produtos.slice(0,5).forEach(p=>{

  sugestaoBox.innerHTML += `

  <div class="sugestao-item" onclick="abrirProduto('${p.id}')">

   <img src="${p.imagem}" loading="lazy">

   <div class="sugestao-info">

    <div class="sugestao-nome">${p.nome}</div>

    <div class="sugestao-preco">
    R$ ${parseFloat(p.preco).toFixed(2)}
    </div>

   </div>

  </div>

  `

 })

}


/* =========================================
ATIVAR BUSCA
========================================= */

function ativarBusca(){

 const campo = document.querySelector("#buscaInput")

 const sugestoes = document.querySelector("#sugestoes")

 if(!campo) return


 campo.addEventListener("input", ()=>{

  const valor = campo.value.trim()

  if(valor.length < 2){

   renderCatalogo(window.listaProdutos)

   if(sugestoes) sugestoes.innerHTML = ""

   return

  }

  const resultados = buscarProdutos(valor)

  renderCatalogo(resultados)

  gerarSugestoes(resultados)

 })


 /* ENTER NA BUSCA */

 campo.addEventListener("keypress", e=>{

  if(e.key === "Enter"){

   const valor = campo.value.trim()

   const resultados = buscarProdutos(valor)

   renderCatalogo(resultados)

  }

 })


}
