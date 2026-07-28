/**
 * tema.js
 * Controla o tema claro/escuro do site L'Élégance Nails.
 * - Aplica o tema salvo assim que o script carrega (evita "flash" de tema errado).
 * - Sincroniza automaticamente entre todas as páginas e abas abertas via localStorage
 *   + evento "storage" (não precisa clicar no botão em cada página).
 * - Qualquer botão com o atributo [data-tema-toggle] vira um alternador de tema.
 */
(function () {
  "use strict";

  var CHAVE = "lelegance-tema";
  var raiz = document.documentElement;

  function temaPreferidoDoSistema() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function obterTemaAtual() {
    var salvo = localStorage.getItem(CHAVE);
    return salvo === "dark" || salvo === "light" ? salvo : temaPreferidoDoSistema();
  }

  function atualizarBotoes(tema) {
    var botoes = document.querySelectorAll("[data-tema-toggle]");
    botoes.forEach(function (botao) {
      botao.setAttribute("aria-pressed", tema === "dark" ? "true" : "false");
      botao.setAttribute(
        "aria-label",
        tema === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
      );
    });
  }

  function aplicarTema(tema, animar) {
    if (animar) {
      raiz.classList.add("transicao-tema");
      window.setTimeout(function () {
        raiz.classList.remove("transicao-tema");
      }, 500);
    }
    raiz.setAttribute("data-theme", tema);
    atualizarBotoes(tema);
  }

  function alternarTema() {
    var novoTema = raiz.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(CHAVE, novoTema);
    aplicarTema(novoTema, true);
  }

  // 1) Aplica o tema imediatamente (antes do DOM terminar de carregar) para não piscar.
  aplicarTema(obterTemaAtual(), false);

  // 2) Liga os botões de alternância assim que o DOM estiver pronto.
  document.addEventListener("DOMContentLoaded", function () {
    atualizarBotoes(raiz.getAttribute("data-theme"));
    document.querySelectorAll("[data-tema-toggle]").forEach(function (botao) {
      botao.addEventListener("click", alternarTema);
    });
  });

  // 3) Sincroniza automaticamente com outras páginas/abas abertas no mesmo site.
  window.addEventListener("storage", function (evento) {
    if (evento.key === CHAVE && evento.newValue) {
      aplicarTema(evento.newValue, true);
    }
  });
})();