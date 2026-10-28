/* =========================================================================
   admin.js — Painel Administrativo JDLC
   -------------------------------------------------------------------------
   Troque a senha abaixo por uma só sua. Isso NÃO é uma segurança forte
   (é um site sem servidor), serve só para afastar curiosos. Para editar
   com segurança de verdade, prefira sempre editar o config.js direto.
   ========================================================================= */
const ADMIN_PASSWORD = "jdlc2026";

(function () {
  "use strict";

  const LS_CARROSSEL = "jdlc_carrossel";
  const LS_GALERIA = "jdlc_galeria";

  function loadCarrossel() {
    const stored = localStorage.getItem(LS_CARROSSEL);
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(SITE_CONFIG.carrossel));
  }
  function loadGaleria() {
    const stored = localStorage.getItem(LS_GALERIA);
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(SITE_CONFIG.galeria));
  }
  function saveCarrossel(list) { localStorage.setItem(LS_CARROSSEL, JSON.stringify(list)); }
  function saveGaleria(list) { localStorage.setItem(LS_GALERIA, JSON.stringify(list)); }

  let carrossel = loadCarrossel();
  let galeria = loadGaleria();

  /* ---------------- Portão de senha ---------------- */
  const gateWrap = document.getElementById("gateWrap");
  const adminPanel = document.getElementById("adminPanel");
  const gatePassword = document.getElementById("gatePassword");
  const gateError = document.getElementById("gateError");

  function tryEnter() {
    if (gatePassword.value === ADMIN_PASSWORD) {
      gateWrap.style.display = "none";
      adminPanel.style.display = "block";
      sessionStorage.setItem("jdlc_admin_ok", "1");
    } else {
      gateError.textContent = "Senha incorreta. Tente novamente.";
    }
  }
  document.getElementById("gateEnter").addEventListener("click", tryEnter);
  gatePassword.addEventListener("keydown", function (e) { if (e.key === "Enter") tryEnter(); });
  if (sessionStorage.getItem("jdlc_admin_ok") === "1") {
    gateWrap.style.display = "none";
    adminPanel.style.display = "block";
  }

  /* ---------------- Abas ---------------- */
  document.querySelectorAll(".admin-tabs button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".admin-tabs button").forEach(function (b) { b.classList.toggle("active", b === btn); });
      document.querySelectorAll(".admin-panel").forEach(function (p) { p.classList.remove("active"); });
      document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
    });
  });

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ---------------- Carrossel: lista ---------------- */
  function renderCarrosselList() {
    const wrap = document.getElementById("carrosselList");
    if (carrossel.length === 0) {
      wrap.innerHTML = '<p class="help-text">Nenhuma imagem no carrossel ainda.</p>';
      return;
    }
    wrap.innerHTML = carrossel.map(function (item, i) {
      return '<div class="item-row">' +
        '<img class="thumb" src="' + item.imagem + '" alt="">' +
        '<div class="info"><strong>' + escapeHtml(item.legenda || "(sem legenda)") + '</strong>' +
        '<span>' + (item.imagem.startsWith("data:") ? "Imagem enviada (embutida)" : item.imagem) + '</span></div>' +
        '<div class="actions">' +
          '<button class="icon-btn" data-act="up" data-i="' + i + '" title="Mover para cima">↑</button>' +
          '<button class="icon-btn" data-act="down" data-i="' + i + '" title="Mover para baixo">↓</button>' +
          '<button class="icon-btn danger" data-act="del" data-i="' + i + '" title="Remover">✕</button>' +
        '</div></div>';
    }).join("");
  }
  document.getElementById("carrosselList").addEventListener("click", function (e) {
    const btn = e.target.closest(".icon-btn");
    if (!btn) return;
    const i = parseInt(btn.dataset.i, 10);
    if (btn.dataset.act === "del") carrossel.splice(i, 1);
    if (btn.dataset.act === "up" && i > 0) { const t = carrossel[i - 1]; carrossel[i - 1] = carrossel[i]; carrossel[i] = t; }
    if (btn.dataset.act === "down" && i < carrossel.length - 1) { const t = carrossel[i + 1]; carrossel[i + 1] = carrossel[i]; carrossel[i] = t; }
    saveCarrossel(carrossel);
    renderCarrosselList();
  });

  document.getElementById("carrosselAdd").addEventListener("click", async function () {
    const fileInput = document.getElementById("carrosselFile");
    const urlInput = document.getElementById("carrosselUrl");
    const legenda = document.getElementById("carrosselLegenda").value.trim();
    const status = document.getElementById("carrosselStatus");

    let imagem = urlInput.value.trim();
    if (fileInput.files && fileInput.files[0]) {
      imagem = await fileToDataUrl(fileInput.files[0]);
    }
    if (!imagem) {
      status.style.color = "#c0392b";
      status.textContent = "Envie um arquivo ou cole um link de imagem.";
      return;
    }
    carrossel.push({ imagem: imagem, legenda: legenda });
    saveCarrossel(carrossel);
    renderCarrosselList();
    fileInput.value = ""; urlInput.value = ""; document.getElementById("carrosselLegenda").value = "";
    status.style.color = "#1a7a3c";
    status.textContent = "Adicionado! (pré-visualização salva neste navegador)";
    setTimeout(function () { status.textContent = ""; }, 4000);
  });

  /* ---------------- Galeria: lista ---------------- */
  function renderGaleriaList() {
    const wrap = document.getElementById("galeriaList");
    if (galeria.length === 0) {
      wrap.innerHTML = '<p class="help-text">Nenhum item na galeria ainda.</p>';
      return;
    }
    wrap.innerHTML = galeria.map(function (item, i) {
      const thumb = item.tipo === "video" && !item.arquivo.startsWith("data:")
        ? 'assets/logo.jpg' : item.arquivo;
      return '<div class="item-row">' +
        '<img class="thumb" src="' + thumb + '" alt="">' +
        '<div class="info"><strong>[' + (item.tipo === "video" ? "Vídeo" : "Foto") + '] ' + escapeHtml(item.titulo || "(sem título)") + '</strong>' +
        '<span>' + (item.arquivo.startsWith("data:") ? "Arquivo enviado (embutido)" : item.arquivo) + '</span></div>' +
        '<div class="actions">' +
          '<button class="icon-btn" data-act="up" data-i="' + i + '" title="Mover para cima">↑</button>' +
          '<button class="icon-btn" data-act="down" data-i="' + i + '" title="Mover para baixo">↓</button>' +
          '<button class="icon-btn danger" data-act="del" data-i="' + i + '" title="Remover">✕</button>' +
        '</div></div>';
    }).join("");
  }
  document.getElementById("galeriaList").addEventListener("click", function (e) {
    const btn = e.target.closest(".icon-btn");
    if (!btn) return;
    const i = parseInt(btn.dataset.i, 10);
    if (btn.dataset.act === "del") galeria.splice(i, 1);
    if (btn.dataset.act === "up" && i > 0) { const t = galeria[i - 1]; galeria[i - 1] = galeria[i]; galeria[i] = t; }
    if (btn.dataset.act === "down" && i < galeria.length - 1) { const t = galeria[i + 1]; galeria[i + 1] = galeria[i]; galeria[i] = t; }
    saveGaleria(galeria);
    renderGaleriaList();
  });

  document.getElementById("galeriaAdd").addEventListener("click", async function () {
    const tipo = document.getElementById("galeriaTipo").value;
    const titulo = document.getElementById("galeriaTitulo").value.trim();
    const fileInput = document.getElementById("galeriaFile");
    const urlInput = document.getElementById("galeriaUrl");
    const status = document.getElementById("galeriaStatus");

    let arquivo = urlInput.value.trim();
    if (fileInput.files && fileInput.files[0]) {
      arquivo = await fileToDataUrl(fileInput.files[0]);
    }
    if (!arquivo) {
      status.style.color = "#c0392b";
      status.textContent = "Envie um arquivo ou cole um link.";
      return;
    }
    galeria.push({ tipo: tipo, arquivo: arquivo, titulo: titulo });
    saveGaleria(galeria);
    renderGaleriaList();
    fileInput.value = ""; urlInput.value = ""; document.getElementById("galeriaTitulo").value = "";
    status.style.color = "#1a7a3c";
    status.textContent = "Adicionado! (pré-visualização salva neste navegador)";
    setTimeout(function () { status.textContent = ""; }, 4000);
  });

  /* ---------------- Gerar código para publicar ---------------- */
  document.getElementById("generateCode").addEventListener("click", function () {
    const carrosselCode = "carrossel: " + JSON.stringify(carrossel, null, 2).replace(/"([a-zA-Z]+)":/g, "$1:") + ",";
    const galeriaCode = "galeria: " + JSON.stringify(galeria, null, 2).replace(/"([a-zA-Z]+)":/g, "$1:");
    document.getElementById("codeOut").value =
      "/* Cole este bloco no lugar de \"carrossel: [...]\" dentro de js/config.js */\n\n" +
      carrosselCode +
      "\n\n/* Cole este bloco no lugar de \"galeria: [...]\" dentro de js/config.js */\n\n" +
      galeriaCode;
  });

  renderCarrosselList();
  renderGaleriaList();
})();
