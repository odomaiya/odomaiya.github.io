const Admin={

 pedidos:[],

 dashboard(){

  console.log("Admin iniciado")

 },

 vendasTotais(){

  return Admin.pedidos.reduce((t,p)=>t+p.total,0)

 }

}

document.addEventListener("DOMContentLoaded",()=>{

 if(!document.body.classList.contains("admin"))return

 Admin.dashboard()

})
