/* =====================================================
CONFIGURAÇÃO DO SISTEMA
===================================================== */

const CONFIG = {

 API_URL:"https://script.google.com/macros/s/AKfycbyNDOjR9YM5JBAU42gUcwGfyZPwSaVdP6T9o73vEf-IuwT3f7qqeOP8CCUZGxv_dANy/exec",

 WHATSAPP:"5599999999999",

 CACHE_KEY:"odomaia_produtos",

 DEBUG:true

}


/* =====================================================
LOGGER
===================================================== */

const Logger={
 log(...m){CONFIG.DEBUG&&console.log("[APP]",...m)},
 error(...m){console.error("[APP ERROR]",...m)}
}


/* =====================================================
ESTADO GLOBAL
===================================================== */

const STATE={

 produtos:[],
 carrinho:[],
 buscaIndex:[]

}


/* =====================================================
UTILITÁRIOS
===================================================== */

const Utils={

 moeda(v){
  return "R$ "+Number(v).toFixed(2)
 },

 el(q){
  return document.querySelector(q)
 },

 els(q){
  return document.querySelectorAll(q)
 },

 debounce(fn,delay=250){
  let t
  return(...a)=>{
   clearTimeout(t)
   t=setTimeout(()=>fn(...a),delay)
  }
 }

}


/* =====================================================
CACHE
===================================================== */

const Cache={

 salvar(key,data){

  try{
   localStorage.setItem(key,JSON.stringify(data))
  }catch(e){}

 },

 carregar(key){

  try{
   return JSON.parse(localStorage.getItem(key))
  }catch(e){
   return null
  }

 }

}


/* =====================================================
API
===================================================== */

const API={

 async produtos(){

  try{

   const cached=Cache.carregar(CONFIG.CACHE_KEY)

   if(cached){

    STATE.produtos=cached
    Logger.log("Produtos carregados do cache")

    return cached
   }

   const r=await fetch(CONFIG.API_URL)

   if(!r.ok) throw "API erro"

   const data=await r.json()

   STATE.produtos=data

   Cache.salvar(CONFIG.CACHE_KEY,data)

   return data

  }catch(e){

   Logger.error("API",e)

   return[]

  }

 }

}


/* =====================================================
INDEXAÇÃO DE BUSCA (ULTRA RÁPIDA)
===================================================== */

const Busca={

 indexar(){

  STATE.buscaIndex=STATE.produtos.map(p=>({

   id:p.id,
   nome:p.nome.toLowerCase()

  }))

 },

 pesquisar(q){

  q=q.toLowerCase()

  return STATE.produtos.filter(p=>
   p.nome.toLowerCase().includes(q)
  )

 }

}


/* =====================================================
CARRINHO
===================================================== */

const Carrinho={

 carregar(){

  const c=Cache.carregar("carrinho")

  if(c)STATE.carrinho=c

 },

 salvar(){

  Cache.salvar("carrinho",STATE.carrinho)

 },

 adicionar(id){

  const p=STATE.produtos.find(p=>p.id==id)

  if(!p)return

  STATE.carrinho.push(p)

  Carrinho.salvar()

  UI.atualizarCarrinho()

 },

 remover(i){

  STATE.carrinho.splice(i,1)

  Carrinho.salvar()

  UI.atualizarCarrinho()

 }

}


/* =====================================================
CHECKOUT WHATSAPP (NÃO ALTERADO)
===================================================== */

const Checkout={

 gerarMensagem(){

  let msg="Pedido:%0A"

  STATE.carrinho.forEach(p=>{
   msg+=`${p.nome} - ${p.preco}%0A`
  })

  return msg

 },

 finalizar(){

  const url=`https://wa.me/${CONFIG.WHATSAPP}?text=${Checkout.gerarMensagem()}`

  window.open(url)

 }

}


/* =====================================================
RENDERIZAÇÃO OTIMIZADA
===================================================== */

const UI={

 atualizarCarrinho(){

  const el=Utils.el("#cartCount")

  if(el)el.textContent=STATE.carrinho.length

 },

 vitrine(){

  const container=Utils.el("#vitrine")

  if(!container)return

  const frag=document.createDocumentFragment()

  STATE.produtos.forEach(p=>{

   const card=document.createElement("div")

   card.className="produto"

   card.innerHTML=`

   <img loading="lazy" src="${p.imagem}">

   <h3>${p.nome}</h3>

   <p>${Utils.moeda(p.preco)}</p>

   <button onclick="Carrinho.adicionar('${p.id}')">

   Comprar

   </button>

   `

   frag.appendChild(card)

  })

  container.innerHTML=""

  container.appendChild(frag)

 }

}


/* =====================================================
PARTÍCULAS
===================================================== */

const Particulas={

 iniciar(){

  const canvas=Utils.el("#particles")

  if(!canvas)return

 }

}


/* =====================================================
VITRINE 3D
===================================================== */

const Vitrine3D={

 iniciar(){

  const v=Utils.el("#vitrine3d")

  if(!v)return

 }

}


/* =====================================================
LAZY LOADING
===================================================== */

const Lazy={

 iniciar(){

  const imgs=Utils.els("img[data-src]")

  const obs=new IntersectionObserver(entries=>{

   entries.forEach(e=>{

    if(e.isIntersecting){

     const img=e.target

     img.src=img.dataset.src

     obs.unobserve(img)

    }

   })

  })

  imgs.forEach(i=>obs.observe(i))

 }

}


/* =====================================================
INICIALIZAÇÃO DO APP
===================================================== */

async function iniciarApp(){

 Logger.log("Iniciando loja")

 Carrinho.carregar()

 await API.produtos()

 Busca.indexar()

 UI.vitrine()

 UI.atualizarCarrinho()

 Lazy.iniciar()

 Particulas.iniciar()

 Vitrine3D.iniciar()

}

document.addEventListener("DOMContentLoaded",iniciarApp)
