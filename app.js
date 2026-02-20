// PRODUTOS EXEMPLO
const produtos = [
  {nome:"Vela Branca 7 Dias", preco:15, img:"https://images.unsplash.com/photo-1602874801006-79fce4c8d2c8"},
  {nome:"Guia de Proteção", preco:35, img:"https://images.unsplash.com/photo-1617957740475-d3a53c91f2d3"},
  {nome:"Imagem Exu", preco:120, img:"https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04"}
];

function carregarProdutos(){
  const container=document.getElementById("listaProdutos");
  container.innerHTML="";
  produtos.forEach(p=>{
    container.innerHTML+=`
      <div class="card">
        <img src="${p.img}">
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco.toFixed(2)}</p>
      </div>
    `;
  });
}

carregarProdutos();

// PARTÍCULAS MENORES
const canvas=document.getElementById("particulas");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particulas=[];
for(let i=0;i<30;i++){
  particulas.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*1.5,
    d:Math.random()*0.3
  });
}

function animar(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="rgba(255,255,255,.3)";
  particulas.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    p.y+=p.d;
    if(p.y>canvas.height){
      p.y=0;
      p.x=Math.random()*canvas.width;
    }
  });
}
setInterval(animar,40);

// CHECKOUT
function abrirCheckout(){
  document.getElementById("checkoutModal").style.display="flex";
}

document.getElementById("tipoEntrega").addEventListener("change",function(){
  const campo=document.getElementById("enderecoCliente");
  campo.style.display=this.value==="entrega"?"block":"none";
});

function confirmarPedido(){
  const nome=document.getElementById("nomeCliente").value;
  const tipo=document.getElementById("tipoEntrega").value;
  const endereco=document.getElementById("enderecoCliente").value;
  const pagamento=document.getElementById("pagamento").value;

  if(!nome){
    alert("Informe seu nome.");
    return;
  }

  let mensagem=`🧿 Pedido Odòmáiyà\nNome: ${nome}\nEntrega: ${tipo}\n`;

  if(tipo==="entrega"){
    mensagem+=`Endereço: ${endereco}\n`;
  }

  mensagem+=`Pagamento: ${pagamento}`;

  window.open(`https://wa.me/555496048808?text=${encodeURIComponent(mensagem)}`,"_blank");
}
