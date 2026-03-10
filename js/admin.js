/* ======================================================
ADMIN SISTEMA
====================================================== */

const Admin = {

 carregarDashboard(){

  console.log("Dashboard carregado")

 },

 listarPedidos(){

 },

 atualizarEstoque(){

 }

}


document.addEventListener("DOMContentLoaded",()=>{

 if(!document.body.classList.contains("admin")) return

 Admin.carregarDashboard()

})
