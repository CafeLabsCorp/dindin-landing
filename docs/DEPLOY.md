# Deploy

## Onde roda

- **Hosting:** Vercel, via a integração Git (não CLI — não há `.vercel/` neste
  ambiente nem `vercel.json` no repo, então a conexão projeto-Vercel↔repo foi
  feita pelo dashboard, não por `vercel link` local).
- **Repositório remoto:** `https://github.com/CafeLabsCorp/dindin-landing.git`
  (organização `CafeLabsCorp`), branch `main` rastreando `origin/main`.
- **Domínio:** `dindin.cafelabs.net`. Confirmado por resolução DNS direta neste
  ambiente: o subdomínio é um `CNAME` pra `<hash>.vercel-dns-017.com`, que
  resolve pros IPs anycast da Vercel (`64.29.17.65` / `216.198.79.65`) — ou
  seja, o domínio realmente aponta pra Vercel, não é só uma intenção
  documentada.
- **App real** (não este repo): `app.dindin.cafelabs.net`, no Firebase Hosting
  (projeto `dindin-cafelabs`) — o botão "Web" da landing linka pra lá.

TODO: confirmar em qual provedor/DNS o domínio `cafelabs.net` está registrado e
gerenciado (registrar + zona DNS) — não verificável só a partir deste repo;
confirmar direto no painel do provedor ou com quem administra o domínio.

## Pipeline

Sem CI próprio neste repo (não há `.github/workflows/`, diferente do app
`dindin` que roda `flutter analyze`/`flutter test` em CI). O "pipeline" é
inteiramente o build automático da Vercel:

1. Push (ou merge) em `main` no GitHub.
2. A integração Git da Vercel detecta o push e dispara um build automático
   (`npm install` + `next build`, conforme `package.json`).
3. Build passa → deploy automático em produção, no domínio
   `dindin.cafelabs.net`. Não há etapa manual de aprovação.

Não há `npm run lint`/`npm run build` rodando como gate obrigatório antes do
merge (não há CI que bloqueie); rodar localmente antes de empurrar pra `main`
fica por conta de quem commita. Consistente com o fluxo de trabalho do
Felipe de commitar direto em `main` sem branch de feature/PR.

## Ambientes

Só existe produção. A Vercel também geraria "Preview Deployments" automáticos
pra qualquer branch/PR que não seja `main`, mas como o fluxo real deste projeto
é sempre commitar direto em `main` (sem branches de feature), isso não é usado
na prática hoje.

TODO: confirmar se variáveis de ambiente estão configuradas no dashboard da
Vercel — não há `.env*` no repo (só listado no `.gitignore`) e o código não lê
nenhuma `process.env.*` hoje, então provavelmente não há nenhuma variável
necessária, mas isso não é 100% verificável sem acesso ao dashboard.

## Rollback

Não há script de rollback neste repo (ao contrário do app `dindin`, que tem
`scripts/deploy.sh` com gates de backup). Pra reverter um deploy problemático:

- **Vercel dashboard** → projeto `dindin-landing` → aba "Deployments" → deploy
  anterior (bom conhecido) → "Promote to Production". Não precisa reverter o
  commit no Git pra isso — a Vercel mantém builds anteriores prontos pra
  promoção.
- Alternativamente, reverter o commit problemático em `main`
  (`git revert <commit>`) e empurrar — dispara um novo build automático.

## Observações

- Sem monitoramento de uptime/erros configurado para esta landing — é uma
  página estática sem lógica de servidor, então a superfície de falha é
  pequena (build quebrado é visível no dashboard da Vercel na hora do push).
- Como não há backend/API neste repo, não existem segredos/credenciais a
  gerenciar aqui além de eventuais variáveis de build da própria Vercel
  (nenhuma identificada no código hoje).
