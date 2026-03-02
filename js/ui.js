const UI = (function () {

  function money(v) {
    return Number(v).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function loader(show = true) {
    const el = document.getElementById("loaderGlobal");
    if (!el) return;
    el.style.display = show ? "flex" : "none";
  }

  function toast(msg) {
    const el = document.getElementById("toast");
    el.innerText = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 3000);
  }

  return {
    money,
    loader,
    toast
  };

})();

window.UI = UI;
