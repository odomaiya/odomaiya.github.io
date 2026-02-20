// ANIMAÇÃO GSAP
window.addEventListener("load",()=>{
  gsap.from(".animar",{
    y:40,
    opacity:0,
    duration:1.2,
    stagger:.3,
    ease:"power3.out"
  });
});

// PARTÍCULAS
const canvas=document.getElementById("particulas");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particulas=[];
for(let i=0;i<50;i++){
  particulas.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2+1,
    d:Math.random()*1
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="rgba(255,255,255,.4)";
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
setInterval(draw,30);

// CHECKOUT
function abrirCheckout(){
  document.getElementById("checkoutModal").style.display="flex";
}

function irParaEtapa2(){
  const nome=document.getElementById("nomeCliente").value;
  if(!nome){
    alert("Informe seu nome.");
    return;
  }
  document.getElementById("etapa1").style.display="none";
  document.getElementById("etapa2").style.display="block";
}

function confirmarPedidoCheckout(){
  mostrarLoader();
  setTimeout(()=>{
    esconderLoader();
    abrirWhatsApp();
  },1500);
}

function abrirWhatsApp(){
  const nome=document.getElementById("nomeCliente").value;
  const msg=`Pedido Odòmáiyà\nCliente: ${nome}`;
  window.open(`https://wa.me/5554996048808?text=${encodeURIComponent(msg)}`,"_blank");
}

function mostrarLoader(){
  document.getElementById("loaderOverlay").style.display="flex";
}

function esconderLoader(){
  document.getElementById("loaderOverlay").style.display="none";
}
