const Analytics = (function () {

  function track(evento, dados = {}) {
    API.analytics(evento, dados);
  }

  return { track };

})();

window.Analytics = Analytics;
