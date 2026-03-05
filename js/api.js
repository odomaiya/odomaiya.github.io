/* =========================================
API - Odòmáiyà Artigos Religiosos
Integração Google Sheets / Apps Script
========================================= */

const API_URL = "https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec";


/* =========================================
CARREGAR PRODUTOS
========================================= */

async function carregarProdutos(){

 try{

  const res = await fetch(API_URL);

  const dados = await res.json();

  /* garantir array */
  let produtos = [];

  if(Array.isArray(dados)){

   produtos = dados;

  }else if(dados.data){

   produtos = dados.data;

  }else if(dados.produtos){

   produtos = dados.produtos;

  }else{

   console.warn("Formato inesperado da API");
   return [];

  }

  /* normalizar dados */
  produtos = produtos.map((p,i)=>({

   id: p.id || i+1,

   nome: p.nome || "Produto",

   preco: Number(p.preco) || 0,

   promocao: Number(p.promocao) || 0,

   categoria: p.categoria || "geral",

   imagem: p.imagem || "img/sem-imagem.png",

   estoque: Number(p.estoque) || 0

  }));

  console.log("Produtos carregados:",produtos.length);

  return produtos;

 }catch(erro){

  console.error("Erro ao carregar produtos",erro);

  return [];

 }

}


/* =========================================
VERIFICAR ESTOQUE
========================================= */

function verificarEstoque(id){

 if(!window.listaProdutos) return 0;

 const prod = window.listaProdutos.find(p=>p.id==id);

 if(!prod) return 0;

 return prod.estoque;

}


/* =========================================
PRODUTO DISPONÍVEL
========================================= */

function produtoDisponivel(prod){

 if(!prod) return false;

 if(Number(prod.estoque) <= 0) return false;

 return true;

}


/* =========================================
FILTRAR POR CATEGORIA
========================================= */

function filtrarCategoria(cat){

 if(!window.listaProdutos) return [];

 return window.listaProdutos.filter(p=>p.categoria===cat);

}


/* =========================================
BUSCAR PRODUTOS
========================================= */

function buscarProdutos(texto){

 if(!window.listaProdutos) return [];

 texto = texto.toLowerCase();

 return window.listaProdutos.filter(p=>

  p.nome.toLowerCase().includes(texto) ||

  p.categoria.toLowerCase().includes(texto)

 );

}
