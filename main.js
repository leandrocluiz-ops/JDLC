/* =========================================================================
   main.js — JDLC Sinalização Viária
   Lê os dados de SITE_CONFIG (config.js). Se o Painel Administrativo tiver
   salvo uma versão mais recente no navegador (localStorage), ela é usada
   como pré-visualização — mas o arquivo config.js continua sendo a fonte
   definitiva do site publicado.
   ========================================================================= */

(function () {
  "use strict";

  function getData() {
    const overrideCarrossel = localStorage.getItem("jdlc_carrossel");
    const overrideGaleria = localStorage.getItem("jdlc_galeria");
    return {
      contato: SITE_CONFIG.contato,
      servicos: SITE_CONFIG.servicos,
      carrossel: overrideCarrossel ? JSON.parse(overrideCarrossel) : SITE_CONFIG.carrossel,
      galeria: overrideGaleria ? JSON.parse(overrideGaleria) : SITE_CONFIG.galeria
    };
  }

  const DATA = getData();

  /* ---------------- Ano no rodapé ---------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Menu mobile ---------------- */
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { mainNav.classList.remove("open"); });
  });

  /* ---------------- Carrossel ---------------- */
  const track = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  let current = 0;
  let timer = null;

  function renderCarousel() {
    if (!DATA.carrossel || DATA.carrossel.length === 0) {
      document.getElementById("carousel").style.display = "none";
      return;
    }
    track.innerHTML = DATA.carrossel.map(function (slide) {
      return '<div class="carousel-slide">' +
               '<img src="' + slide.imagem + '" alt="' + escapeHtml(slide.legenda || "") + '">' +
               (slide.legenda ? '<div class="carousel-caption"><p>' + escapeHtml(slide.legenda) + '</p></div>' : '') +
             '</div>';
    }).join("");
    dotsWrap.innerHTML = DATA.carrossel.map(function (_, i) {
      return '<button data-i="' + i + '" aria-label="Ir para slide ' + (i + 1) + '"></button>';
    }).join("");
    dotsWrap.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () { goTo(parseInt(btn.dataset.i, 10)); });
    });
    goTo(0);
    resetTimer();
  }

  function goTo(i) {
    const total = DATA.carrossel.length;
    current = (i + total) % total;
    track.style.transform = "translateX(-" + (current * 100) + "%)";
    dotsWrap.querySelectorAll("button").forEach(function (b, idx) {
      b.classList.toggle("active", idx === current);
    });
  }
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 5500);
  }
  document.getElementById("prevSlide").addEventListener("click", function () { goTo(current - 1); resetTimer(); });
  document.getElementById("nextSlide").addEventListener("click", function () { goTo(current + 1); resetTimer(); });

  /* ---------------- Serviços ---------------- */
  const ICONS = {
    road: "🛣️", sign: "🚸", cone: "🚧", clipboard: "📋", wrench: "🔧", search: "🔍"
  };
  function renderServices() {
    const grid = document.getElementById("servicesGrid");
    grid.innerHTML = (DATA.servicos || []).map(function (s) {
      return '<div class="service-card">' +
               '<div class="service-icon">' + (ICONS[s.icone] || "🚦") + '</div>' +
               '<h3>' + escapeHtml(s.titulo) + '</h3>' +
               '<p>' + escapeHtml(s.descricao) + '</p>' +
             '</div>';
    }).join("");
  }

  /* ---------------- Galeria ---------------- */
  const galleryGrid = document.getElementById("galleryGrid");
  let activeFilter = "todos";

  function renderGallery() {
    const items = (DATA.galeria || []).filter(function (item) {
      return activeFilter === "todos" || item.tipo === activeFilter;
    });
    if (items.length === 0) {
      galleryGrid.innerHTML = '<p class="gallery-empty">Nenhum item nessa categoria ainda.</p>';
      return;
    }
    galleryGrid.innerHTML = items.map(function (item, i) {
      const thumb = item.tipo === "video"
        ? (isYouTube(item.arquivo)
            ? '<img src="' + youtubeThumb(item.arquivo) + '" alt="' + escapeHtml(item.titulo || "") + '">'
            : '<video src="' + item.arquivo + '" muted></video>')
        : '<img src="' + item.arquivo + '" alt="' + escapeHtml(item.titulo || "") + '">';
      return '<div class="gallery-item" data-index="' + i + '" data-filter-group="' + item.tipo + '">' +
               thumb +
               '<span class="tag">' + (item.tipo === "video" ? "Vídeo" : "Foto") + '</span>' +
               (item.titulo ? '<div class="caption">' + escapeHtml(item.titulo) + '</div>' : '') +
             '</div>';
    }).join("");

    galleryGrid.querySelectorAll(".gallery-item").forEach(function (el) {
      el.addEventListener("click", function () {
        const idx = parseInt(el.dataset.index, 10);
        openLightbox(items[idx]);
      });
    });
  }

  function isYouTube(url) { return /youtube\.com|youtu\.be/.test(url); }
  function youtubeThumb(url) {
    const match = url.match(/embed\/([a-zA-Z0-9_-]+)/) || url.match(/v=([a-zA-Z0-9_-]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    return match ? "https://img.youtube.com/vi/" + match[1] + "/hqdefault.jpg" : url;
  }

  document.getElementById("galleryFilters").addEventListener("click", function (e) {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.toggle("active", b === btn); });
    renderGallery();
  });

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightboxContent");

  function openLightbox(item) {
    let inner = "";
    if (item.tipo === "video") {
      inner = isYouTube(item.arquivo)
        ? '<iframe src="' + item.arquivo + '" title="' + escapeHtml(item.titulo || "Vídeo") + '" allowfullscreen></iframe>'
        : '<video src="' + item.arquivo + '" controls autoplay></video>';
    } else {
      inner = '<img src="' + item.arquivo + '" alt="' + escapeHtml(item.titulo || "") + '">';
    }
    lightboxContent.innerHTML = inner + (item.titulo ? '<p class="lightbox-caption">' + escapeHtml(item.titulo) + '</p>' : "");
    lightbox.classList.add("open");
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxContent.innerHTML = "";
  }
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

  /* ---------------- Contato / Orçamento ---------------- */
  function renderContact() {
    const c = DATA.contato;
    document.getElementById("contactList").innerHTML =
      '<li><span class="k">WhatsApp</span> ' + escapeHtml(c.whatsappExibicao) + '</li>' +
      '<li><span class="k">E-mail</span> ' + escapeHtml(c.email) + '</li>' +
      '<li><span class="k">Região</span> ' + escapeHtml(c.endereco) + '</li>';
  }

  document.getElementById("quoteForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const servico = document.getElementById("servico").value;
    const mensagem = document.getElementById("mensagem").value.trim();

    const texto = "Olá, JDLC! Meu nome é " + nome +
      (cidade ? " (" + cidade + ")" : "") +
      ". Gostaria de um orçamento para: " + servico + ".\n\n" + mensagem;

    const url = "https://wa.me/" + DATA.contato.whatsapp + "?text=" + encodeURIComponent(texto);
    window.open(url, "_blank");
  });

  /* ---------------- Util ---------------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------------- Init ---------------- */
  renderCarousel();
  renderServices();
  renderGallery();
  renderContact();
})();
