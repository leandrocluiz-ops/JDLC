# Site JDLC Sinalização Viária

## Estrutura
```
jdlc-site/
├── index.html          → Página principal
├── admin.html          → Painel administrativo (editar carrossel/galeria)
├── css/
│   ├── style.css        → Estilo do site
│   └── admin.css        → Estilo do painel administrativo
├── js/
│   ├── config.js         → ⭐ EDITE AQUI: contato, carrossel, serviços, galeria
│   ├── main.js           → Lógica do site (não precisa mexer)
│   └── admin.js          → Lógica do painel administrativo (não precisa mexer)
└── assets/
    └── logo.jpg          → Sua logo
```

## O que editar primeiro
Abra **js/config.js** e troque:
1. `whatsapp` — número real, só números, com "55" + DDD + número.
2. `whatsappExibicao`, `email`, `endereco`, `instagram`.
3. As imagens de exemplo do **carrossel** e da **galeria** pelas fotos reais
   dos seus trabalhos (coloque os arquivos dentro de `assets/` e aponte o
   caminho, ex: `assets/minha-foto.jpg`).

## Como publicar (mesmo fluxo do MasQbom)
1. Suba a pasta inteira `jdlc-site` para o repositório no GitHub.
2. Publique/atualize no servidor da Hostinger.

## Painel administrativo (admin.html)
- Acesse `seusite.com.br/admin.html`.
- Senha padrão: `jdlc2026` (troque isso na primeira linha de `js/admin.js`,
  procure por `ADMIN_PASSWORD`).
- Lá você adiciona fotos/vídeos por upload (a imagem fica embutida no
  código) ou colando um link. Isso te dá uma **pré-visualização** no seu
  próprio navegador.
- Para a mudança aparecer para todo mundo, clique em **"Gerar código para
  publicar"**, copie o resultado e cole dentro de `js/config.js`, depois
  suba de novo para o GitHub/Hostinger.

> Por ser um site sem servidor (estático), não existe forma de o painel
> salvar direto "para todo mundo" sem esse passo de colar o código e
> publicar de novo — é o mesmo princípio do sistema de precificação do
> MasQbom.

## Sobre a imagem enviada com personagens do Mario
Não usei a segunda imagem que você mandou (o operário com Goombas, Koopas
e a arcada do Mario) porque ela contém personagens registrados da
Nintendo — usar isso em um site comercial é violação de direitos autorais
e pode gerar problemas para o seu negócio. No lugar, deixei fotos de
exemplo no carrossel/galeria para você substituir pelas fotos reais dos
seus serviços.
