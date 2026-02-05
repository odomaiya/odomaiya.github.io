const dados = JSON.parse(localStorage.getItem("ranking")) || {};
const ul = document.getElementById("ranking");

Object.entries(dados)
  .sort((a,b)=>b[1]-a[1])
  .forEach(i=>{
    ul.innerHTML += <li>${i[0]} — ${i[1]} vendas</li>;
  });
