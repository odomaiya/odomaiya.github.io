const CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?gid=1004684059&single=true&output=csv";

let produtos=[];
let carrinho={};

async function carregar(){
 const res=await fetch(CSV_URL);
 const texto=await res.text();
 const linhas=texto.split("\n").slice(1);

 produtos=linhas.map(l=>{
   const c=l.split(",");
   return{
     nome:c[0],
     preco:parseFloat(c[1].replace(",", "."))||0,
     categoria:c[2],
     imagem:c[3],
     estoque:parseInt(c[4])||0
   }
 });

 renderizar(produtos);
}

function renderizar(lista){
 const grid=document.getElementById("produtos");
 grid.innerHTML="";

 lista.forEach((p,i)=>{
   grid.innerHTML+=`
   <div class="produto-card">
     <h3>${p.nome}</h3>
     <div class="preco">R$ ${p.preco.toFixed(2)}</div>
     <small>Estoque: ${p.estoque}</small>
     <div class="contador">
       <button onclick="alterar(${i},-1)">-</button>
       <span id="q${i}">0</span>
       <button onclick="alterar(${i},1)">+</button>
     </div>
   </div>`;
 });
}

function alterar(i,v){
 if(!carrinho[i]) carrinho[i]=0;
 carrinho[i]+=v;
 if(carrinho[i]<0) carrinho[i]=0;
 if(carrinho[i]>produtos[i].estoque) carrinho[i]=produtos[i].estoque;
 document.getElementById("q"+i).innerText=carrinho[i];
 atualizarTotal();
}

function atualizarTotal(){
 let totalItens=0;
 Object.values(carrinho).forEach(q=> totalItens+=q);
 document.getElementById("totalItens").innerText=totalItens;
}

function abrirCheckout(){
 let total=0;
 Object.keys(carrinho).forEach(i=>{
   total+=produtos[i].preco*carrinho[i];
 });

 if(total===0){
   alert("Carrinho vazio.");
   return;
 }

 document.getElementById("checkoutModal").style.display="flex";
 etapaDados();
}

function fecharCheckout(){
 document.getElementById("checkoutModal").style.display="none";
}

function etapaDados(){
 document.getElementById("checkoutSteps").innerHTML=`
 <h3>Seus Dados</h3>
 <input class="checkout-input" id="nomeCliente" placeholder="Seu nome">
 <button class="checkout-btn" onclick="etapaEntrega()">Continuar</button>
 `;
}

function etapaEntrega(){
 const nome=document.getElementById("nomeCliente").value;
 if(!nome){alert("Digite seu nome"); return;}

 document.getElementById("checkoutSteps").innerHTML=`
 <h3>Entrega</h3>
 <select class="checkout-input" id="tipoEntrega">
   <option value="retirada">Retirar na loja</option>
   <option value="entrega">Entrega (taxa informada via WhatsApp)</option>
 </select>
 <input class="checkout-input" id="endereco" placeholder="Endereço completo (se entrega)">
 <button class="checkout-btn" onclick="etapaPagamento()">Continuar</button>
 `;
}

function etapaPagamento(){
 document.getElementById("checkoutSteps").innerHTML=`
 <h3>Pagamento</h3>
 <select class="checkout-input" id="pagamento">
   <option>Crédito</option>
   <option>Débito</option>
   <option>Dinheiro</option>
   <option>Pix</option>
 </select>
 <button class="checkout-btn" onclick="confirmarPedido()">Confirmar Pedido</button>
 `;
}

function confirmarPedido(){
 const nome=document.getElementById("nomeCliente").value;
 const tipo=document.getElementById("tipoEntrega").value;
 const endereco=document.getElementById("endereco").value;
 const pagamento=document.getElementById("pagamento").value;

 let mensagem=`*Pedido Odòmáiyà*%0ACliente: ${nome}%0A`;

 if(tipo==="entrega"){
   mensagem+=`Entrega: ${endereco}%0ATaxa informada na conversa.%0A`;
 }else{
   mensagem+="Retirada na loja%0A";
 }

 mensagem+=`Pagamento: ${pagamento}%0A%0AItens:%0A`;

 let total=0;

 Object.keys(carrinho).forEach(i=>{
   if(carrinho[i]>0){
     mensagem+=`${produtos[i].nome} x${carrinho[i]}%0A`;
     total+=produtos[i].preco*carrinho[i];
   }
 });

 mensagem+=`%0ATotal: R$ ${total.toFixed(2)}`;

 window.open(`https://wa.me/555496048808?text=${mensagem}`,"_blank");
 fecharCheckout();
}

carregar();
