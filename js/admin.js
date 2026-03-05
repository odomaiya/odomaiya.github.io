let adminClicks=0;

function ativarAdmin(){

 const rodape=document.querySelector("footer");

 rodape.addEventListener("click",()=>{

  adminClicks++;

  if(adminClicks>=10){

   window.location="admin.html";

  }

 });

}



function loginAdmin(){

 const user=document.querySelector("#adminUser").value;

 const pass=document.querySelector("#adminPass").value;

 if(user==="ADM" && pass==="99861309"){

  localStorage.setItem("admin","true");

  carregarPainel();

 }else{

  alert("login inválido");

 }

}



async function carregarPainel(){

 if(localStorage.getItem("admin")!=="true") return;

 const produtos=await buscarProdutos();

 const tabela=document.querySelector("#adminTabela");

 tabela.innerHTML="";

 produtos.forEach(p=>{

  tabela.innerHTML+=`

  <tr>

   <td>${p.nome}</td>
   <td>${p.preco}</td>
   <td>${p.estoque}</td>
   <td>${p.categoria}</td>
   <td>${p.promocao}</td>

  </tr>

  `;

 });

}
