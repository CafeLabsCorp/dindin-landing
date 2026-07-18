# dindin-landing

Landing page de download do [Dindin](https://github.com/CafeLabsDev/dindin), app de
controle financeiro por caixinhas da Café Labs. Site estático (Next.js), hospedado
separado do app real, no domínio `dindin.cafelabs.net` — identidade visual própria
("Envelope caloroso"), herdada 1:1 do app, não a do portfólio nem a da Café Labs
institucional.

Inclui uma demo interativa client-side (`CaixinhasDemo.tsx`) que deixa mexer em
saldo/alocação/transferência entre caixinhas sem precisar abrir o app de verdade.

## Stack

| Camada          | Tecnologia                                                          |
| --------------- | -------------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router), React 19                                     |
| Estilo          | Tailwind CSS v4 (tokens via `@theme inline` em `globals.css`)         |
| Tipografia      | Fraunces (headings) + Work Sans (corpo), via `next/font/google`      |
| Linguagem       | TypeScript                                                            |
| Lint            | ESLint (`eslint-config-next`)                                         |
| Hosting/deploy  | Vercel, deploy automático a cada push em `main`                       |

Mesmo padrão de stack do site institucional (`cafelabs-portifolio`) e do
`domo-landing`.

## Rodando localmente

Pré-requisito: Node.js 20+ (testado com v20.20.1).

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`. Outros scripts: `npm run build` (build de
produção), `npm run start` (serve o build), `npm run lint`.

## Estrutura de pastas

```
src/app/
  layout.tsx        # layout raiz: fontes (Fraunces/Work Sans), metadata
  page.tsx           # única rota (/): header, hero, download, demo, features, footer
  CaixinhasDemo.tsx  # demo interativa client-side das caixinhas
  globals.css        # tokens de design ("Envelope caloroso") + Tailwind v4
public/
  dindin-logo.svg
```

Sem rotas além de `/` — é uma landing de página única.

## Documentação

- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — estrutura de rotas/componentes e a
  lógica de estado da demo de caixinhas.
- [`docs/DESIGN.md`](docs/DESIGN.md) — tokens da identidade "Envelope caloroso"
  (cor, tipografia, forma).
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — deploy na Vercel e DNS de
  `dindin.cafelabs.net`.

Não há `docs/BACKEND.md`: este repo não tem backend próprio — é site estático,
sem chamadas de API nem persistência (a demo roda inteira em memória do
navegador).

## Status

- [x] Hero, features e seção de downloads.
- [x] Botão "Web" ativo, linkando pro app real (`app.dindin.cafelabs.net`).
- [x] Demo interativa de caixinhas (`CaixinhasDemo.tsx`).
- [x] Padrão estrutural de landing da Café Labs aplicado (hero 100dvh, indicador de
      scroll, acesso rápido ao produto acima da dobra) — ver `docs/ARQUITETURA.md`.
- [x] No ar em `dindin.cafelabs.net` (Vercel) — ver `docs/DEPLOY.md`.
- [ ] Download Windows — placeholder "em breve", depende de decidir o empacotamento
      (zip vs. Inno Setup).
- [ ] Download Android — placeholder "em breve", depende de decidir onde hospedar o
      `.apk` de release.
