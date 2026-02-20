let products = [
  {id:1,nome:"Guia Azul",preco:35,categoria:"Guias"},
  {id:2,nome:"Vela Branca",preco:8,categoria:"Velas"},
  {id:3,nome:"Bebida Ritual",preco:25,categoria:"Bebidas"}
];

let cart=[];

function renderProdutos(lista){
  const div=document.getElementById("productList");
  div.innerHTML="";
  lista.forEach(p=>{
    div.innerHTML+=`
      <div class="card">
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco.toFixed(2)}</p>
        <div class="qty">
          <button onclick="alterarQtd(${p.id},-1)">-</button>
          <span id="qtd-${p.id}">1</span>
          <button onclick="alterarQtd(${p.id},1)">+</button>
        </div>
        <button class="btn-primary" onclick="addCarrinho(${p.id})">Adicionar</button>
      </div>
    `;
  });
}

function alterarQtd(id,val){
  let span=document.getElementById(`qtd-${id}`);
  let qtd=parseInt(span.innerText)+val;
  if(qtd<1)qtd=1;
  span.innerText=qtd;
}

function addCarrinho(id){
  const prod=products.find(p=>p.id===id);
  const qtd=parseInt(document.getElementById(`qtd-${id}`).innerText);
  cart.push({...prod,qtd});
  atualizarCarrinho();
}

function atualizarCarrinho(){
  const div=document.getElementById("cartItems");
  div.innerHTML="";
  let total=0;

  cart.forEach(p=>{
    total+=p.preco*p.qtd;
    div.innerHTML+=`<p>${p.nome} x${p.qtd}</p>`;
  });

  document.getElementById("cartTotal").innerText=total.toFixed(2);
  document.getElementById("cartCount").innerText=cart.length;
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("active");
}

function abrirCheckout(){
  document.getElementById("checkout").style.display="flex";

  document.getElementById("checkoutBox").innerHTML=`
    <h3>Finalizar Pedido</h3>
    <input id="nome" placeholder="Seu Nome" style="width:100%;margin:10px 0;padding:8px;">
    
    <select id="tipoEntrega" style="width:100%;margin:10px 0;padding:8px;">
      <option value="retirada">Retirada</option>
      <option value="entrega">Entrega (taxa adicional)</option>
    </select>

    <select id="pagamento" style="width:100%;margin:10px 0;padding:8px;">
      <option>Crédito</option>
      <option>Débito</option>
      <option>Pix</option>
      <option>Dinheiro</option>
    </select>

    <button class="btn-primary" onclick="enviarPedido()">Enviar Pedido</button>
  `;
}

function enviarPedido(){
  let nome=document.getElementById("nome").value;
  let entrega=document.getElementById("tipoEntrega").value;
  let pagamento=document.getElementById("pagamento").value;

  let msg=`✨ Pedido Odòmáiyà ✨\n\nCliente: ${nome}\nEntrega: ${entrega}\nPagamento: ${pagamento}\n\nItens:\n`;

  cart.forEach(p=>{
    msg+=`${p.nome} x${p.qtd}\n`;
  });

  window.open(`https://wa.me/555496048808?text=${encodeURIComponent(msg)}`,"_blank");
}
renderProdutos(products);
