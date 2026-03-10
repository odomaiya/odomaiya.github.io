/* ======================================================
CONFIGURAÇÃO DO SISTEMA
====================================================== */

const CONFIG = {

 API_URL: "SUA_API_APPS_SCRIPT",
 WHATSAPP: "5599999999999",

 CACHE_VERSION: "v1",

};


/* ======================================================
LOGGER
====================================================== */

const Logger = {

 log(...msg){
  console.log("[APP]",...msg)
 },

 error(...msg){
  console.error("[APP ERROR]",...msg)
 }

}


/* ======================================================
ESTADO GLOBAL (STATE)
====================================================== */

const STATE = {

 produtos: [],
 carrinho: [],
 usuario: null,

 loading:false

}


/* ======================================================
UTILITÁRIOS
====================================================== */

const Helpers = {

 moeda(v){
  return "R$ "+Number(v).toFixed(2)
 },

 id(){
  return Math.random().toString(36).substring(2,9)
 }

}


/* ======================================================
DOM HELPERS
====================================================== */

const DOM = {

 qs(sel){
  return document.querySelector(sel)
 },

 qsa(sel){
  return document.querySelectorAll(sel)
 }

}


/* ======================================================
API / COMUNICAÇÃO COM BACKEND
====================================================== */

const API = {

 async carregarProdutos(){

  try{

   const r = await fetch(CONFIG.API_URL)
   const data = await r.json()

   STATE.produtos = data

  }catch(e){

   Logger.error("Erro API",e)

  }

 }

}


/* ======================================================
CARRINHO
====================================================== */

const Carrinho = {

 adicionar(id){

  const prod = STATE.produtos.find(p=>p.id==id)

  if(!prod) return

  STATE.carrinho.push(prod)

  Carrinho.salvar()

 },

 remover(index){

  STATE.carrinho.splice(index,1)

  Carrinho.salvar()

 },

 salvar(){

  localStorage.setItem("carrinho",JSON.stringify(STATE.carrinho))

 },

 carregar(){

  const c = localStorage.getItem("carrinho")

  if(c) STATE.carrinho = JSON.parse(c)

 }

}


/* ======================================================
CHECKOUT WHATSAPP
====================================================== */

const Checkout = {

 gerarMensagem(){

  let msg = "Pedido:%0A"

  STATE.carrinho.forEach(p=>{
   msg+=`${p.nome} - ${p.preco}%0A`
  })

  return msg

 },

 finalizar(){

  const mensagem = Checkout.gerarMensagem()

  const url = `https://wa.me/${CONFIG.WHATSAPP}?text=${mensagem}`

  window.open(url)

 }

}


/* ======================================================
BUSCA
====================================================== */

const Busca = {

 pesquisar(q){

  return STATE.produtos.filter(p=>
   p.nome.toLowerCase().includes(q.toLowerCase())
  )

 }

}


/* ======================================================
RECOMENDAÇÕES
====================================================== */

const Recomendacoes = {

 gerar(){

  return STATE.produtos.slice(0,4)

 }

}


/* ======================================================
SUGESTÕES
====================================================== */

const Sugestoes = {

 gerar(){

  return STATE.produtos.slice(4,8)

 }

}


/* ======================================================
RANKING
====================================================== */

const Ranking = {

 top(){

  return STATE.produtos.slice(0,5)

 }

}


/* ======================================================
VITRINE
====================================================== */

const Vitrine = {

 render(){

  const container = DOM.qs("#vitrine")

  if(!container) return

  container.innerHTML=""

  STATE.produtos.forEach(p=>{

   const card = document.createElement("div")

   card.className="produto"

   card.innerHTML=`
   <h3>${p.nome}</h3>
   <p>${Helpers.moeda(p.preco)}</p>
   <button onclick="Carrinho.adicionar('${p.id}')">
   Comprar
   </button>
   `

   container.appendChild(card)

  })

 }

}


/* ======================================================
VITRINE 3D
====================================================== */

const Vitrine3D = {

 iniciar(){

  const el = DOM.qs(".vitrine3d")

  if(!el) return

 }

}


/* ======================================================
PARTÍCULAS
====================================================== */

const Particulas = {

 iniciar(){

  const canvas = DOM.qs("#particles")

  if(!canvas) return

 }

}


/* ======================================================
BANNER
====================================================== */

const Banner = {

 iniciar(){

  const banner = DOM.qs("#banner")

  if(!banner) return

 }

}


/* ======================================================
AUTENTICAÇÃO
====================================================== */

const Auth = {

 login(){

 },

 logout(){

 }

}


/* ======================================================
PWA REGISTRO
====================================================== */

function registrarPWA(){

 if("serviceWorker" in navigator){

  navigator.serviceWorker.register("/sw.js")

 }

}


/* ======================================================
INICIALIZAÇÃO DO SISTEMA
====================================================== */

async function iniciarApp(){

 Logger.log("Iniciando sistema")

 Carrinho.carregar()

 await API.carregarProdutos()

 Vitrine.render()

 Vitrine3D.iniciar()

 Particulas.iniciar()

 Banner.iniciar()

 registrarPWA()

}

document.addEventListener("DOMContentLoaded", iniciarApp)
