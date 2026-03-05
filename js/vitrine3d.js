let vitrineIndex=0;

function iniciarVitrine3D(produtos){

 const vitrine=produtos.filter(p=>p.promocao==="VITRINE");

 if(vitrine.length===0) return;

 const container=document.querySelector("#vitrine");

 container.innerHTML="";

 vitrine.forEach((p,i)=>{

  container.innerHTML+=`

  <div class="vitrine3d-card" data-index="${i}">

   <img src="${p.imagem}">

   <h3>${p.nome}</h3>

  </div>

  `;

 });

 animarVitrine3D();

}



function animarVitrine3D(){

 const cards=document.querySelectorAll(".vitrine3d-card");

 setInterval(()=>{

  vitrineIndex++;

  if(vitrineIndex>=cards.length) vitrineIndex=0;

  cards.forEach((card,i)=>{

   let pos=i-vitrineIndex;

   if(pos<0) pos+=cards.length;

   card.style.transform=`
   translateX(${pos*260}px)
   scale(${1-pos*0.1})
   rotateY(${pos*15}deg)
   `;

  });

 },4000);

}
