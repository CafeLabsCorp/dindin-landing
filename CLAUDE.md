@AGENTS.md

# dindin-landing

Landing estática (Next.js) do app Dindin, no domínio `dindin.cafelabs.net`. Ponto
de entrada: [`README.md`](README.md). Detalhes técnicos em
[`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) (rotas/componentes, estado da demo
`CaixinhasDemo.tsx`), [`docs/DESIGN.md`](docs/DESIGN.md) (tokens "Envelope
caloroso") e [`docs/DEPLOY.md`](docs/DEPLOY.md) (Vercel + DNS). Sem
`docs/BACKEND.md` — não há backend próprio.

Específico deste repo pra quem trabalha aqui com um agente: a demo de
caixinhas é 100% client-side e reseta no F5 de propósito — não adicionar
persistência (`localStorage`, API, etc.) sem que o Felipe peça explicitamente.
Fluxo de trabalho: commitar direto em `main`, sem branch de feature nem PR.

**Mudanças futuras significativas neste projeto devem passar pelo Forge**
(o time de agentes especializado do repo `forge`), em vez de serem feitas
ad-hoc numa sessão avulsa — ele roteia o trabalho pro especialista certo
(frontend, design, docs, etc.) e mantém este conjunto de docs sincronizado
com o código.
