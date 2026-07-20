# Design — identidade "Envelope caloroso"

Esta landing herda 1:1 a identidade visual definida para o app Dindin
(`/home/felip/projetos/dindin/docs/DESIGN.md`) — mesma paleta, mesma tipografia,
contraste já verificado lá (WCAG 2.1, cálculo manual de luminância/contraste). Os
valores abaixo são os mesmos hexadecimais, só **não devem ser re-derivados aqui**:
qualquer mudança de paleta nasce no app e é replicada pra esta landing, não o
contrário.

**Mapeamento de nomes:** o app chama o terceiro papel de cor de `tertiary`; esta
landing usa `accent` para o mesmo papel (mesmo valor, `#C1502E`/`#F0916A`). Fora
esse renome, os tokens são equivalentes 1:1.

## Cor

Implementados como CSS custom properties em `src/app/globals.css` (`:root` para o
tema claro, `@media (prefers-color-scheme: dark)` para o escuro), mapeados pro
Tailwind v4 via `@theme inline`.

### Claro

| Token (`globals.css`)                | Hex                        | Papel                                             |
| ------------------------------------- | -------------------------- | -------------------------------------------------- |
| `--background`                        | `#FAF4EA`                  | Fundo da página — ivory quente ("a mesa")          |
| `--surface`                           | `#FFFFFF`                  | Cards ("papel")                                    |
| `--foreground`                        | `#211A12`                  | Texto principal                                    |
| `--muted`                             | `#5C5346`                  | Texto secundário                                   |
| `--subtle`                            | `#746A5D`                  | Texto terciário/legendas                           |
| `--border`                            | `rgba(33,26,18,0.12)`      | Hairline decorativo                                |
| `--primary`                           | `#2E6F4D` ("Verde Cofre")  | Marca — CTA de header/links, foco                  |
| `--primary-foreground`                | `#FFFFFF`                  | Texto sobre `primary`                              |
| `--primary-container`                 | `#D7EBDD`                  | Fill tonal (badge "Disponível agora")              |
| `--primary-container-foreground`      | `#14392A`                  | Texto sobre `primary-container`                    |
| `--secondary`                         | `#6B7A5E`                  | Sage — barra de progresso "não alocado"            |
| `--accent`                            | `#C1502E` ("Terracota")    | CTA principal ("Abrir Dindin na web") — uso raro   |
| `--accent-foreground`                 | `#FFFFFF`                  | Texto sobre `accent`                               |
| `--status-warning`                    | `#A8660A`                  |                                                      |
| `--status-critical`                   | `#C13B3B`                  | Erros de validação da demo                         |
| `--status-good`                       | `#2F7D3B`                  | Deltas positivos na demo                           |

### Escuro

| Token                             | Hex          |
| ---------------------------------- | ------------ |
| `--background`                     | `#16130F`    |
| `--surface`                        | `#201C17`    |
| `--foreground`                     | `#F5F1EA`    |
| `--muted`                          | `#C9C2B4`    |
| `--subtle`                         | `#A79C89`    |
| `--border`                         | `rgba(245,241,234,0.12)` |
| `--primary`                        | `#7FCB9E`    |
| `--primary-foreground`             | `#0D3320`    |
| `--primary-container`              | `#1F4732`    |
| `--primary-container-foreground`   | `#BEE8CE`    |
| `--secondary`                      | `#A9B896`    |
| `--accent`                         | `#F0916A`    |
| `--accent-foreground`              | `#431507`    |
| `--status-warning`                 | `#E0A542`    |
| `--status-critical`                | `#E8746A`    |
| `--status-good`                    | `#6FCB82`    |

No dark mode, `--shadow-card` vira `none` — a elevação passa a depender só do
hairline + `surface` já ser um degrau mais claro que `background` (cards não
"flutuam" via sombra no escuro).

### Paleta categórica (cor por caixinha)

8 cores, usadas como ponto/borda-esquerda ao lado do nome da caixinha — nunca
como único portador de significado (o nome sempre acompanha):

| Token     | Nome           | Claro     | Escuro    |
| --------- | -------------- | --------- | --------- |
| `--cat-1` | Verde Cofre    | `#2E6F4D` | `#5FAE80` |
| `--cat-2` | Terracota      | `#C1502E` | `#E2896A` |
| `--cat-3` | Âmbar          | `#A8660A` | `#E0A542` |
| `--cat-4` | Azul Petróleo  | `#2E6B78` | `#4E96A3` |
| `--cat-5` | Ameixa         | `#7A4A6B` | `#A87CA0` |
| `--cat-6` | Vinho          | `#A23B3B` | `#D06868` |
| `--cat-7` | Oliva          | `#7C7A3A` | `#ACA85C` |
| `--cat-8` | Argila Rosada  | `#B97064` | `#D69C90` |

Na landing, `--cat-1`/`--cat-2`/`--cat-3` são usados pelas 3 caixinhas da demo
(Verde Cofre/Terracota/Âmbar); os outros 5 aparecem só nas "abas de envelope"
decorativas do hero (`--cat-4` a `--cat-7`).

## Tipografia

Carregadas via `next/font/google` em `src/app/layout.tsx` (self-hosted em build
time — sem requisição de rede em runtime, sem trade-off de latência/offline):

- **Fraunces** (`--font-fraunces`, pesos 400/600) — serif calorosa, usada só no
  H1 do hero e em dois headings de seção ("Baixe o Dindin", "Como funcionam as
  caixinhas"). Mapeada pra `--font-serif` no `@theme inline`.
- **Work Sans** (`--font-work-sans`, pesos 400/500/600) — corpo, botões, labels,
  em todo o resto da página. Mapeada pra `--font-sans`.

Fraunces é reservada pra poucos headings de propósito — é o elemento que mais
diferencia a página de um template genérico, e perde força se usada em tudo.

## Forma / espaçamento

Não há um arquivo de tokens de espaçamento dedicado (nem `tailwind.config`
customizado) — a página usa a escala padrão do Tailwind v4 (`px-6`, `py-16`,
`gap-4`, etc.) diretamente. Convenções observadas no código:

- **Cards:** `rounded-2xl` (16px) + `border border-border` + `shadow-card`
  (`0 1px 3px rgba(33,26,18,.08), 0 1px 2px rgba(33,26,18,.06)` no claro, `none`
  no escuro) — variável `--shadow-card`, classe utilitária `.shadow-card`.
- **Botões/CTAs e pills (badge "Disponível agora", delta pill da demo):**
  totalmente arredondados (`rounded-full`), altura mínima `h-11`/`h-12`.
- **Inputs/selects da demo:** `rounded-xl` (12px), `h-11`.
- **"Abas de envelope" decorativas do hero** (`.envelope-tab`, `globals.css`):
  `border-radius: 14px 14px 6px 6px` — cantos de baixo mais retos que os de
  cima, silhueta de envelope; sempre `aria-hidden` e ocultas abaixo de 720px.
- **Hover em cards** (`.card-hover`): `translateY(-2px)` + transição de sombra,
  gated por `prefers-reduced-motion: no-preference`.
- **Foco visível:** `outline: 2px solid var(--primary)`, `outline-offset: 2px`
  em qualquer elemento com `:focus-visible`.

## Movimento

Toda animação/transição do arquivo é condicionada a
`@media (prefers-reduced-motion: no-preference)` — nunca aplicada
incondicionalmente:

- `scroll-behavior: smooth` no `html` (indicador de scroll do hero).
- `.scroll-cue` — bounce sutil na seta do "veja como funciona".
- `.value-pulse` — scale-up de 420ms quando um valor da demo muda.
- `.delta-pill` — fade in/out de 250ms do "+R$ X"/"R$ -X" ao lado do valor.
