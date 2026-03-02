// ===============================
// ANALYTICS ODÒMÁIYÀ
// ===============================

const Analytics = {

  track(evento, dados = {}) {
    API.registrarAnalytics(evento, JSON.stringify(dados));
  }

};
