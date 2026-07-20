# Arquitetura

Landing estática de página única (Next.js App Router). Sem backend próprio, sem
chamadas de API, sem banco de dados — todo o "estado" da página vive no navegador
e é perdido a cada F5 (inclusive, de propósito, na demo).

## Rotas

Uma única rota: `/` (`src/app/page.tsx`). Não há outras páginas, nem rotas
dinâmicas, nem API routes.

## Componentes

### `layout.tsx` — layout raiz

Carrega as duas fontes via `next/font/google` (self-hosted em build time, sem
requisição de rede em runtime):

- **Fraunces** (`--font-fraunces`) — pesos 400/600, headings.
- **Work Sans** (`--font-work-sans`) — pesos 400/500/600, corpo/UI.

Define `metadata` (title/description) e aplica as variáveis de fonte + classes de
base (`antialiased`, `min-h-full flex flex-col`, `bg-background text-foreground`)
no `<html>`/`<body>`.

### `page.tsx` — composição da página

Server Component (não tem `"use client"`), monta a página inteira em uma função,
sem estado próprio:

1. **Header** (`h-16` fixo em altura, não sobreposto) — logo + wordmark "Dindin" à
   esquerda, link "por Café Labs" à direita.
2. **Hero** — `min-h-[calc(100dvh-4rem)]` (100dvh descontando a altura do header),
   com 6 "abas de envelope" decorativas (`.envelope-tab`, `aria-hidden`) espalhadas
   atrás do conteúdo central: logo, H1, subtítulo, CTA "Abrir Dindin na web"
   (linka pro app real, `https://app.dindin.cafelabs.net`) e um link âncora "veja
   como funciona ↓" (`.scroll-cue`, bounce sutil gated por
   `prefers-reduced-motion`) que rola até a seção de download.
3. **Seção "Baixe o Dindin"** — logo abaixo do hero (não no fim da página, de
   propósito — ver a nota de padrão estrutural abaixo). Três cards: "Web"
   (ativo, linka pro app), "Windows" e "Android" (ambos placeholder "em breve",
   `border-dashed`, sem link).
4. **`<CaixinhasDemo />`** — âncora `#caixinhas`, ver seção dedicada abaixo.
5. **Seção de features** — grid de 3 cards estáticos (receitas alocadas na hora,
   gastos no lugar certo, backup/restauração).
6. **Footer** — linha de marca + links GitHub e e-mail de contato.

Esta página segue o **padrão estrutural de landing da Café Labs** (hero sempre
100vh/100dvh, indicador de scroll animado, acesso rápido ao "usar o produto"
logo acima ou imediatamente abaixo do hero, `scroll-behavior: smooth` gated por
`prefers-reduced-motion`) — mesmo padrão aplicado depois em `mind-landing`,
`forge-skill-library`, `cafelabs-portifolio` e `domo-landing`. Foi a primeira
landing a receber essa estrutura (2026-07-17).

### `CaixinhasDemo.tsx` — demo interativa

Client Component (`"use client"`) — o único trecho com estado da página inteira.
Simula, inteiramente em memória, as três operações reais do app: adicionar
saldo, alocar entre caixinhas e transferir entre caixinhas.

**Modelo de dados (local, seed fixo):**

```ts
type CaixinhaId = "verde" | "terra" | "ambar";
interface Caixinha { id: CaixinhaId; name: string; color: string; balance: number }

const SEED_CONTA = 500;
const SEED_CAIXINHAS = [
  { id: "verde", name: "Verde Cofre", balance: 0 },
  { id: "terra", name: "Terracota",   balance: 0 },
  { id: "ambar", name: "Âmbar",       balance: 0 },
];
```

**Estado React (tudo local ao componente, nada persistido):**

- `conta: number` — saldo não alocado.
- `caixinhas: Caixinha[]` — as 3 caixinhas seed.
- `mode: "add" | "alocar" | "transferir"` — qual dos 3 formulários está visível
  (troca via botões tipo tab, `aria-pressed`).
- Um par `(valor, error)` de estado por formulário (`addValor`/`addError`,
  `alocarDestino`/`alocarValor`/`alocarError`,
  `transfOrigemRaw`/`transfDestinoRaw`/`transfValor`/`transfError`).
- `liveMessage: string` — texto anunciado via região `aria-live="polite"`
  (`role="status"`, visualmente oculta) a cada ação, pra paridade com quem usa
  leitor de tela.

**Regras de negócio replicadas da lógica real do app (mais simples, sem
persistência):**

- `handleAddSubmit` — soma `val` a `conta`. Valida `val > 0`.
- `handleAlocarSubmit` — subtrai de `conta`, soma à caixinha de destino. Valida
  `val > 0` e `val <= conta` (não deixa alocar mais do que o saldo disponível).
- `handleTransferirSubmit` — subtrai da caixinha de origem, soma à de destino.
  Valida `val > 0` e `val <= origem.balance`.
- **Seleção de origem/destino em "transferir" é derivada, não armazenada
  diretamente:** `eligibleOrigins` filtra só caixinhas com `balance > 0`;
  `effectiveOrigem`/`effectiveDestino` recalculam a cada render a partir do que
  o usuário escolheu (`transfOrigemRaw`/`transfDestinoRaw`) mas caem pro
  primeiro item elegível se a escolha anterior deixou de ser válida (ex.: saldo
  da origem escolhida zerou). Isso estruturalmente impede transferir de uma
  caixinha vazia ou pra ela mesma, em vez de validar isso depois do fato.
- `handleReset` — restaura todos os estados pro seed inicial (clona
  `SEED_CAIXINHAS` pra não mutar o array original).

**Feedback visual (`useDeltaPill` / `usePulse`, hooks locais ao arquivo):**

- `usePulse()` — expõe um `pulseId` que incrementa a cada mudança; o número
  correspondente é remontado com `key={pulseId}` e uma classe `.value-pulse`
  (leve scale-up, gated por `prefers-reduced-motion`), reiniciando a animação a
  cada valor novo.
- `useDeltaPill()` — mostra por ~1.4s um "pill" com o delta formatado (`+R$
  150,00` ou `R$ -150,00`, via `fmtDelta`) ao lado do número que mudou, com
  fade in/out (`.delta-pill`, também gated por reduced-motion).
- Cada caixinha e a conta têm sua própria instância de ambos os hooks
  (`deltaById`/`pulseById`, indexados por `CaixinhaId`).

**Acessibilidade adicional:**

- Foco move automaticamente pro primeiro campo/`select` do formulário sempre
  que `mode` muda (via `formAreaRef` + `useEffect`, pulando a primeira
  renderização pra não roubar foco no load da página).
- Erros de validação em `role="alert"`.
- Aviso explícito de que a demo é só uma prévia local: "os valores não são
  salvos. Atualizar a página reinicia tudo." — e um botão "Reiniciar demo".

**Não persiste nada** — não há `localStorage`, cookie, nem chamada de rede. É
inteiramente descartável por design (mesmo raciocínio replicado depois na demo
do `domo-landing`, que cita esta implementação como anti-referência para uma
interação mais simples, ver `docs/DESIGN.md` desse outro repo).

## Estado/dados globais

Não há gerenciador de estado global (Context, Redux, Zustand etc.) — o único
estado dinâmico da página inteira é local ao `CaixinhasDemo`. Todo o resto é
conteúdo estático hardcoded em `page.tsx` (arrays `heroTabs`/`features`).

## Decisões técnicas e por quê

- **Sem `next.config.ts` customizado** (arquivo é o boilerplate padrão) — não há
  necessidade de rewrites, redirects, imagens externas ou `output: "export"`;
  o deploy usa o build padrão do Next na Vercel.
- **Tokens de design via CSS custom properties + `@theme inline` (Tailwind v4)**,
  não um arquivo `tailwind.config.*` — é o mecanismo nativo do Tailwind v4, e é o
  mesmo usado por `domo-landing`. Ver `docs/DESIGN.md` para os valores.
- **Sem framework de animação** (Framer Motion etc.) — as poucas animações
  (pulse do valor, delta pill, bounce do scroll cue) são CSS puro, sempre gated
  por `@media (prefers-reduced-motion: no-preference)`.
- **`alias `@/*` → `./src/*`** configurado em `tsconfig.json` mas não usado hoje
  no código (só há um import relativo, `./CaixinhasDemo`) — disponível pra
  quando o projeto crescer além de um único componente por pasta.

## Restrições não óbvias

- A demo é **inteiramente client-side e efêmera por design** — não tentar
  "corrigir" isso adicionando persistência sem que alguém peça; a mensagem "os
  valores não são salvos" é uma escolha de produto, não uma limitação a
  resolver.
- Os hexadecimais de cor em `globals.css` **não devem ser re-derivados** — são
  copiados 1:1 de `dindin/docs/DESIGN.md` (spec de identidade do app,
  contraste já verificado lá). Qualquer mudança de paleta deveria nascer no app
  e ser replicada aqui, não o contrário — ver a seção "Consumido por" em
  `dindin-landing.md` no Mind (`/home/felip/projetos/mind/projetos/produtos-cafelabs/dindin-landing.md`).
