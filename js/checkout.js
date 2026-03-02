// ===============================
// CHECKOUT 3 ETAPAS
// ===============================

const Checkout = {

  abrir() {
    document.getElementById("modalCheckout").classList.remove("hidden");
    this.renderEtapa1();
  },

  fechar() {
    document.getElementById("modalCheckout").classList.add("hidden");
  },

  renderEtapa1() {
    document.getElementById("checkoutSteps").innerHTML = `
      <h3>Seus Dados</h3>
      <input id="clienteNome" placeholder="Seu nome">
      <input id="cep" placeholder="CEP">
      <input id="endereco" placeholder="Endereço">
      <button class="btn-primary" onclick="Checkout.renderEtapa2()">Continuar</button>
    `;

    document.getElementById("cep").addEventListener("input", async (e) => {
      const cep = e.target.value.replace(/\D/g,"");
      if (cep.length === 8) {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        document.getElementById("endereco").value = `${data.logradouro} - ${data.bairro}`;
      }
    });
  },

  renderEtapa2() {
    document.getElementById("checkoutSteps").innerHTML = `
      <h3>Entrega</h3>
      <select id="tipoEntrega">
        <option value="Retirada">Retirada</option>
        <option value="Entrega">Entrega</option>
      </select>
      <button class="btn-primary" onclick="Checkout.renderEtapa3()">Continuar</button>
    `;
  },

  renderEtapa3() {
    document.getElementById("checkoutSteps").innerHTML = `
      <h3>Pagamento</h3>
      <select id="pagamento">
        <option>Pix</option>
        <option>Dinheiro</option>
      </select>
      <button class="btn-primary" onclick="Checkout.finalizar()">Finalizar</button>
    `;
  },

  async finalizar() {
    const venda = {
      cliente: document.getElementById("clienteNome").value,
      tipo: document.getElementById("tipoEntrega").value,
      pagamento: document.getElementById("pagamento").value,
      itens: JSON.stringify(Carrinho.itens),
      total: Carrinho.total()
    };

    await API.registrarVenda(venda);
    Analytics.track("compra_finalizada", venda);

    Carrinho.limpar();
    this.fechar();

    window.open(`https://wa.me/55SEUNUMERO?text=Pedido confirmado`, "_blank");
  }

};
