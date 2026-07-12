# dindin-landing

Landing page de download do [Dindin](https://github.com/CafeLabsDev/dindin), app de
controle financeiro por caixinhas da Café Labs. Site estático (Next.js), hospedado
separado do app real — identidade visual herdada do app (não a do portfólio nem a da
Café Labs institucional).

## Stack

Next.js (App Router) + Tailwind CSS v4, mesmo padrão do site institucional
(`cafelabs-portifolio`).

## Identidade visual

Paleta e logo copiados 1:1 do app Flutter (`dindin/lib/theme/colors.dart` e
`dindin/assets/logo.svg`):

- Cor primária: azul `#2A78D6` (seed color do tema do app).
- Tokens de superfície (fundo, bordas, texto) iguais aos do app, claro e escuro.

## Rodando localmente

```bash
npm install
npm run dev
```

## Deploy

Vercel, apontado pro domínio `dindin.cafelabs.net` (deploy ainda não configurado —
pendente de criar o repositório remoto e conectar à Vercel).

## Status

- [x] Hero, features e seção de downloads.
- [x] Botão "Web" ativo, linkando pro app (`dindin-cafelabs.web.app`).
- [ ] Download Windows — placeholder "em breve", depende de decidir o empacotamento
      (zip vs. Inno Setup).
- [ ] Download Android — placeholder "em breve", depende de decidir onde hospedar o
      `.apk` de release.
