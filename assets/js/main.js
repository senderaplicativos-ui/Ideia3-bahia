/* Grupo Ideia3 Consultoria Bahia — interações da landing page */
(function () {
  "use strict";

  var WHATS_VENDAS = "5571984774491";

  /* ------------------------------------------------- menu mobile ------- */
  var botaoMenu = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");

  if (botaoMenu && nav) {
    botaoMenu.addEventListener("click", function () {
      var aberta = nav.classList.toggle("nav--aberta");
      botaoMenu.classList.toggle("aberto", aberta);
      botaoMenu.setAttribute("aria-expanded", String(aberta));
    });

    nav.addEventListener("click", function (evento) {
      if (evento.target.tagName === "A") {
        nav.classList.remove("nav--aberta");
        botaoMenu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------- header ao rolar -- */
  var cabecalho = document.querySelector(".cabecalho");
  var secoes = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));

  function aoRolar() {
    if (cabecalho) {
      cabecalho.classList.toggle("cabecalho--rolado", window.scrollY > 20);
    }

    var atual = "";
    for (var i = 0; i < secoes.length; i++) {
      if (secoes[i].getBoundingClientRect().top <= 140) {
        atual = secoes[i].id;
      }
    }

    links.forEach(function (link) {
      link.classList.toggle("ativo", link.getAttribute("href") === "#" + atual);
    });
  }

  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  /* ------------------------------------------------- scroll reveal ---- */
  var alvos = document.querySelectorAll(".revelar");

  if ("IntersectionObserver" in window) {
    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    alvos.forEach(function (alvo, indice) {
      alvo.style.transitionDelay = (indice % 4) * 90 + "ms";
      observador.observe(alvo);
    });
  } else {
    alvos.forEach(function (alvo) {
      alvo.classList.add("visivel");
    });
  }

  /* ------------------------------------------------- contadores ------- */
  var contadores = document.querySelectorAll("[data-contador]");

  function animarContador(elemento) {
    var destino = parseFloat(elemento.getAttribute("data-contador"));
    var sufixo = elemento.getAttribute("data-sufixo") || "";
    var inicio = performance.now();
    var duracao = 1600;

    function passo(agora) {
      var progresso = Math.min((agora - inicio) / duracao, 1);
      var suave = 1 - Math.pow(1 - progresso, 3);
      elemento.textContent = Math.round(destino * suave).toLocaleString("pt-BR") + sufixo;
      if (progresso < 1) requestAnimationFrame(passo);
    }

    requestAnimationFrame(passo);
  }

  if ("IntersectionObserver" in window) {
    var obsContador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            animarContador(entrada.target);
            obsContador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    contadores.forEach(function (contador) {
      obsContador.observe(contador);
    });
  } else {
    contadores.forEach(animarContador);
  }

  /* ------------------------------------------------- formulários ------ */
  /* Sem backend: os formulários abrem o WhatsApp de vendas com a mensagem
     já montada. Trocar por um endpoint quando houver servidor. */
  function enviarViaWhatsApp(formulario, montarTexto) {
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var dados = new FormData(formulario);

      function valor(nome) {
        return (dados.get(nome) || "").toString().trim();
      }

      var texto = montarTexto(valor);
      window.open("https://wa.me/" + WHATS_VENDAS + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    });
  }

  var formContato = document.getElementById("form-contato");
  if (formContato) {
    enviarViaWhatsApp(formContato, function (v) {
      return (
        "Olá! Quero falar com a Grupo Ideia3 Consultoria Bahia.\n\n" +
        "Nome: " + v("nome") + "\n" +
        "Empresa: " + (v("empresa") || "-") + "\n" +
        "Telefone: " + v("telefone") + "\n" +
        "E-mail: " + (v("email") || "-") + "\n" +
        "Segmento: " + v("segmento") + "\n" +
        "Linhas/Serviço: " + (v("linhas") || "-") + "\n\n" +
        "Mensagem: " + (v("mensagem") || "-")
      );
    });
  }

  var formVagas = document.getElementById("form-vagas");
  if (formVagas) {
    enviarViaWhatsApp(formVagas, function (v) {
      return (
        "Olá! Quero me candidatar a uma vaga na Grupo Ideia3 Consultoria Bahia.\n\n" +
        "Nome: " + v("nome") + "\n" +
        "Telefone: " + v("telefone") + "\n" +
        "E-mail: " + (v("email") || "-") + "\n" +
        "Área de interesse: " + v("area") + "\n" +
        "Cidade: " + (v("cidade") || "-") + "\n\n" +
        "Sobre mim: " + (v("sobre") || "-")
      );
    });
  }

  var formParceiro = document.getElementById("form-parceiro");
  if (formParceiro) {
    enviarViaWhatsApp(formParceiro, function (v) {
      return (
        "Olá! Quero ser parceiro da Grupo Ideia3 Consultoria Bahia.\n\n" +
        "Nome: " + v("nome") + "\n" +
        "Empresa: " + (v("empresa") || "-") + "\n" +
        "Telefone: " + v("telefone") + "\n" +
        "Cidade/Região: " + (v("cidade") || "-") + "\n" +
        "Perfil: " + v("perfil") + "\n\n" +
        "Observações: " + (v("obs") || "-")
      );
    });
  }

  /* ------------------------------------------------- ano no rodapé ---- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
