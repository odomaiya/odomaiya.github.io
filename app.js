// ===========================
// TABELA CSV DINÂMICA
// ===========================

const planilhaURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7j4_2qhc-W7EscYgFNEoWX-jEUsfS8xPSnOkEGj7uf1xSUFKkANQ8YQ57UUZsPytia7Vq6iShxHGy/pub?gid=1004684059&single=true&output=csv";

let products = [];
let cart = [];

// buscar CSV e transformar em array
fetch(planilhaURL)
.then(res => res.text())
.then(text => {
  const linhas = text.split("\n").slice(1);
  products = linhas.map(l => {
    const c = l.split(",");
    return {
      id: c[0]?.trim(),
      name: c[1]?.trim(),
      price: parseFloat(c[2]) || 0,
      stock: parseInt(c[3]) || 0,
      category: c[4]?.trim() || "Geral"
    };
  });
  renderProducts(products);
});

// ===========================
// GERAR PRODUTOS
// ===========================

function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  list.forEach(p => {
    container.innerHTML += `
      <div class="product-card" data-category="${p.category}">
        <h3>${p.name}</h3>
        <p>R$ ${p.price.toFixed(2)}</p>
        <p>Em estoque: ${p.stock}</p>

        <div class="qty-controls">
          <button onclick="changeQty('${p.id}', -1)">-</button>
          <span id="qty-${p.id}">1</span>
          <button onclick="changeQty('${p.id}', 1)">+</button>
        </div>

        <button class="add-btn" onclick="addToCart('${p.id}')">Adicionar</button>
      </div>
    `;
  });
}

// ===========================
// FILTRO POR CATEGORIA
// ===========================

function filtrarCategoria(cat) {
  if(cat === "Todos"){
    renderProducts(products);
    return;
  }
  const filtrados = products.filter(p=>p.category === cat);
  renderProducts(filtrados);
}

// ===========================
// QUANTIDADE
// ===========================

function changeQty(id, change){
  const span = document.getElementById(`qty-${id}`);
  let value = parseInt(span.innerText);
  value += change;
  if(value < 1) value = 1;
  span.innerText = value;
}

// ===========================
// ADICIONAR AO CARRINHO
// ===========================

function addToCart(id){
  const prod = products.find(p=>p.id === id);
  const qty = parseInt(document.getElementById(`qty-${id}`).innerText);

  if(qty > prod.stock){
    alert("Estoque insuficiente!");
    return;
  }

  cart.push({...prod, qty});
  prod.stock -= qty;

  updateCart();
  renderProducts(products);
}

// ===========================
// ATUALIZAR CARRINHO
// ===========================

function updateCart(){
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.qty;
    container.innerHTML += `<p>${item.name} x${item.qty}</p>`;
  });

  document.getElementById("cart-total").innerText = total.toFixed(2);
  document.getElementById("cart-count").innerText = cart.length;
}

// ===========================
// CHECKOUT
// ===========================

function openCheckout(){
  if(cart.length === 0){
    alert("Carrinho vazio!");
    return;
  }

  const checkoutDiv = document.getElementById("checkout-step");
  checkoutDiv.innerHTML = `

    <h3>1️⃣ Dados do Cliente</h3>
    <input type="text" id="nome" placeholder="Nome completo">
    <input type="text" id="telefone" placeholder="Telefone">
    <button onclick="checkoutStep2()">Continuar">

  `;
  document.getElementById("checkout").style.display = "flex";
}

function checkoutStep2(){
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;

  if(!nome || !telefone){
    alert("Preencha nome e telefone.");
    return;
  }

  document.getElementById("checkout-step").innerHTML = `

    <h3>2️⃣ Entrega ou Retirada</h3>
    <select id="deliveryType" onchange="toggleAddress()">
      <option value="retirada">Retirada</option>
      <option value="entrega">Entrega</option>
    </select>

    <div id="address-input" style="display:none;">
      <input type="text" id="cep" placeholder="CEP">
      <input type="text" id="street" placeholder="Rua">
      <input type="text" id="city" placeholder="Cidade">
    </div>

    <button onclick="checkoutStep3()">Continuar</button>

  `;
}

function toggleAddress(){
  const type = document.getElementById("deliveryType").value;
  document.getElementById("address-input").style.display =
    type === "entrega" ? "block" : "none";
}

function checkoutStep3(){

  document.getElementById("checkout-step").innerHTML = `
    <h3>3️⃣ Confirmação</h3>
    <div id="order-summary"></div>
    <button onclick="confirmOrder()">Finalizar no WhatsApp</button>
  `;
  generateSummary();
}

// ===========================
// RESUMO E ENVIO
// ===========================

function generateSummary(){
  let total = 0;
  let summaryHTML = "";

  cart.forEach(i => {
    total += i.price * i.qty;
    summaryHTML += `<p>${i.name} x${i.qty}</p>`;
  });

  summaryHTML += `<h4>Total: R$ ${total.toFixed(2)}</h4>`;
  document.getElementById("order-summary").innerHTML = summaryHTML;
}

function confirmOrder(){

  let message = `✨ Novo Pedido Odòmáiyà ✨%0A%0A`;

  cart.forEach(i=>{
    message += `• ${i.name} x${i.qty}%0A`;
  });

  message += `%0A📞 Enviar para atendimento`;

  window.open(`https://wa.me/555496048808?text=${encodeURIComponent(message)}`,"_blank");
}

// ===========================
// PARTICULAS
// ===========================

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let sparkles = [];

for(let i=0;i<40;i++){
  sparkles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    size:Math.random()*1.5,
    speed:Math.random()*0.3
  });
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="rgba(255,255,255,0.3)";

  sparkles.forEach(s=>{
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
    ctx.fill();
    s.y -= s.speed;
    if(s.y < 0){
      s.y = canvas.height;
      s.x = Math.random()*canvas.width;
    }
  });

  requestAnimationFrame(animate);
}

animate();
