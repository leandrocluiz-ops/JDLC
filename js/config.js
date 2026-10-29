/* =========================================================================
   CONFIG.JS — JDLC Sinalização Viária
   -------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar no dia a dia.
   Não precisa saber programar: só troque os textos entre aspas " "
   e os endereços (URLs) das imagens/vídeos.

   Depois de editar, salve o arquivo e suba de novo para o GitHub/Hostinger
   (o mesmo fluxo que você já usa no MasQbom).

   DICA: o Painel Administrativo (admin.html) monta este código pra você.
   Você só precisa copiar e colar o que ele gerar aqui dentro.
   ========================================================================= */

const SITE_CONFIG = {

  // ---- CONTATO -----------------------------------------------------------
  contato: {
    nomeEmpresa: "JDLC Sinalização Viária",
    whatsapp: "553599833456",     // troque pelo número real, só números, com DDI 55 + DDD
    whatsappExibicao: "(35) 99983-3456",
    email: "contato@jdlcsinalizacao.com.br",
    endereco: "Sul de Minas, MG",
    instagram: "https://instagram.com/jdlcsinalizacao"
  },

  // ---- CARROSSEL (logo abaixo do menu) -----------------------------------
  // Adicione quantas imagens quiser. "legenda" aparece por cima da imagem.
  carrossel: [
    {
      imagem: "assets/carrossel-1.jpg",
      legenda: "Sinalização horizontal em rodovias e vias urbanas"
    },
    {
      imagem: "assets/carrossel-2.jpg",
      legenda: "Placas verticais de regulamentação e advertência"
    },
    {
      imagem: "assets/carrossel-3.jpg",
      legenda: "Projetos completos de segurança viária"
    },
    {
      imagem: "assets/carrossel-4.jpg",
      legenda: "Teste para novas imagens"
    }
     
  ],

  // ---- SERVIÇOS -----------------------------------------------------------
  servicos: [
    {
      titulo: "Sinalização Horizontal",
      descricao: "Pintura de faixas, zebrados, setas e símbolos com tinta de alta durabilidade.",
      icone: "road"
    },
    {
      titulo: "Sinalização Vertical",
      descricao: "Fabricação e instalação de placas de regulamentação, advertência e indicação.",
      icone: "sign"
    },
    {
      titulo: "Dispositivos de Segurança",
      descricao: "Tachas, tachões, defensas metálicas, balizadores e itens de contenção viária.",
      icone: "cone"
    },
    {
      titulo: "Projetos e Laudos",
      descricao: "Elaboração de projetos de sinalização conforme normas do CONTRAN e DNIT.",
      icone: "clipboard"
    },
    {
      titulo: "Manutenção Viária",
      descricao: "Repintura, substituição de placas e manutenção preventiva de sinalização.",
      icone: "wrench"
    },
    {
      titulo: "Consultoria Técnica",
      descricao: "Vistoria em campo e recomendações técnicas para prefeituras e empresas.",
      icone: "search"
    }
  ],

  // ---- GALERIA (trabalhos realizados) -------------------------------------
  // tipo: "imagem" ou "video"
  // Para vídeo, use um link de incorporação (ex: YouTube "embed") ou um arquivo .mp4
  galeria: [
    {
      tipo: "imagem",
      arquivo: "assets/galeria-1.jpg",
      titulo: "Repintura de faixa de pedestre — Centro"
    },
    {
      tipo: "imagem",
      arquivo: "assets/galeria-2.jpg",
      titulo: "Instalação de placas de trânsito"
    },
    {
      tipo: "imagem",
      arquivo: "assets/galeria-3.jpg",
      titulo: "Sinalização de rodovia — trecho urbano"
    },
    {
      tipo: "video",
      arquivo: "assets/Video.mp4",
      titulo: "Time-lapse: pintura de zebrado"
    }
  ]
};
