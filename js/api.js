const API_URL = "https://script.google.com/macros/s/AKfycbzPHF-hrcCEbr20fbk8LaBxbPMHEXra9sw0l7xU8tCOzDZu2PUW899fLqnwap1aGJx0/exec";

function loginAdmin(){
  const senha = document.getElementById("senhaAdmin").value;

  if(senha === "odomaia2026"){  // ALTERE DEPOIS
    document.getElementById("loginArea").style.display="none";
    document.getElementById("painelAdmin").style.display="block";
    carregarDashboard();
  }else{
    alert("Senha incorreta");
  }
}

async function carregarDashboard(){
  const r = await fetch(API_URL + "?acao=dashboard");
  const dados = await r.json();

  document.getElementById("metricas").innerHTML = `
    <div>Receita Total<br><strong>R$ ${dados.receita}</strong></div>
    <div>Total Pedidos<br><strong>${dados.pedidos}</strong></div>
    <div>Produto Mais Vendido<br><strong>${dados.topProduto}</strong></div>
  `;

  let html="<h3>Pedidos</h3>";

  dados.lista.forEach(p=>{
    html+=`<div style="padding:10px;border-bottom:1px solid #ddd">
      ${p.cliente} — R$ ${p.total} — ${p.data}
    </div>`;
  });

  document.getElementById("listaPedidos").innerHTML=html;
}
