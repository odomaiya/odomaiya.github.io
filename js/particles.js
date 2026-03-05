function criarParticulas(){

const canvas=document.createElement("canvas")

canvas.id="particles"

document.body.appendChild(canvas)

const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=window.innerHeight

let p=[]

for(let i=0;i<60;i++){

p.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*2

})

}

function animar(){

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.fillStyle="rgba(200,220,255,.6)"

p.forEach(pt=>{

ctx.beginPath()
ctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2)
ctx.fill()

pt.y-=0.2

if(pt.y<0) pt.y=canvas.height

})

requestAnimationFrame(animar)

}

animar()

}
