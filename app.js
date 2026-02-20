let carrinho = [];

function abrirCheckout(){
  document.getElementById("checkoutModal").style.display = "flex";
}

function confirmarPedidoCheckout(){

  const nome = document.getElementById("nomeCliente").value;
  if(!nome){
    alert("Informe seu nome.");
    return;
  }

  // Vibração leve no celular
  if(navigator.vibrate){
    navigator.vibrate(120);
  }

  // Som espiritual suave
  tocarSom();

  mostrarLoader();

  setTimeout(()=>{
    esconderLoader();
    abrirWhatsApp(nome);
    mostrarConfete();
  },1800);
}

function abrirWhatsApp(nome){
  const mensagem = `✨ Pedido Odòmáiyà ✨\n\nCliente: ${nome}\n\nAguardo confirmação 🙏`;
  const url = `https://wa.me/5554996048808?text=${encodeURIComponent(mensagem)}`;
  window.open(url,"_blank");
}

function mostrarLoader(){
  document.getElementById("loaderOverlay").style.display = "flex";
}

function esconderLoader(){
  document.getElementById("loaderOverlay").style.display = "none";
}

function mostrarConfete(){
  for(let i=0;i<80;i++){
    const confete = document.createElement("div");
    confete.classList.add("confete");
    confete.style.left = Math.random()*100+"vw";
    confete.style.background = randomCor();
    confete.style.animationDuration = (2+Math.random()*2)+"s";
    document.body.appendChild(confete);
    setTimeout(()=>confete.remove(),3000);
  }
}

function randomCor(){
  const cores = ["#0f3d5c","#1f6c9b","#d4af37","#ffffff"];
  return cores[Math.floor(Math.random()*cores.length)];
}

function tocarSom(){
  const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-mystical-wind-chimes-2019.mp3");
  audio.volume = 0.3;
  audio.play();
}
