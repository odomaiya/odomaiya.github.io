window.Checkout={

finalizar(){

const nome=document.getElementById("cliente").value
const telefone=document.getElementById("telefone").value
const tipo=document.getElementById("tipo").value
const pagamento=document.getElementById("pagamento").value

let msg="🛍️ *Novo Pedido Odòmáiyà* \n\n"
msg+="👤 Cliente: "+nome+"\n"
msg+="📞 Telefone: "+telefone+"\n"
msg+="📦 Tipo: "+tipo+"\n"
msg+="💳 Pagamento: "+pagamento+"\n\n"

if(tipo==="entrega"){
msg+=`📍 Endereço: ${rua.value}, ${numero.value}, ${cidade.value}\n`
}else{
msg+="📍 Retirada na loja\n"
}

msg+="\n🛍️ Itens:\n"

let total=0

Object.keys(UI.carrinho).forEach(n=>{
if(UI.carrinho[n]>0){
const p=ESTOQUE.lista.find(x=>x.nome===n)
const preco=p.promocao>0?p.promocao:p.preco
total+=preco*UI.carrinho[n]
msg+=`• ${n} x${UI.carrinho[n]} — R$ ${preco.toFixed(2)}\n`
}
})

salvarPedido({

data:new Date().toLocaleString(),

total:total.toFixed(2),

endereco:`${rua.value} ${numero.value} ${bairro.value} ${cidade.value}`

})
  
msg+=`\n💰 Total: R$ ${total.toFixed(2)}\n`

window.open("https://wa.me/555496048808?text="+encodeURIComponent(msg))

}

}
