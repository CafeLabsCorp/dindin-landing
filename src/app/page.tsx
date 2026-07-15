import Image from "next/image";

const WEB_APP_URL = "https://app.dindin.cafelabs.net";

const features = [
  {
    title: "Caixinhas categorizadas",
    description:
      "Divida o dinheiro em caixinhas — mercado, transporte, lazer — e acompanhe quanto sobra em cada uma.",
  },
  {
    title: "Receitas alocadas na hora",
    description:
      "Cada receita que entra é distribuída entre as caixinhas, sem planilha e sem cálculo manual.",
  },
  {
    title: "Gastos no lugar certo",
    description:
      "Todo gasto sai da caixinha correta, então você sempre sabe o que ainda pode gastar em cada categoria.",
  },
  {
    title: "Backup e restauração",
    description:
      "Exporte todos os seus dados em JSON quando quiser, e importe de volta pra migrar entre contas.",
  },
];

export default function Home() {
  return (
    <>
      <header className="w-full border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image src="/dindin-logo.svg" alt="Dindin" width={28} height={28} />
            <span className="text-lg font-semibold">Dindin</span>
          </div>
          <a
            href="https://cafelabs.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-subtle transition-colors hover:text-foreground"
          >
            por Café Labs
          </a>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center">
          <Image src="/dindin-logo.svg" alt="" width={72} height={72} aria-hidden />
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Controle financeiro por caixinhas
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">
            Receitas entram, são alocadas entre categorias, e os gastos saem de cada
            caixinha. Simples assim.
          </p>
          <a
            href={WEB_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Abrir Dindin na web
          </a>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-semibold">Baixe o Dindin</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <a
              href={WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-6 text-center transition-colors hover:border-primary"
            >
              <span className="text-base font-medium">Web</span>
              <span className="text-sm text-subtle">Disponível agora</span>
            </a>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border p-6 text-center text-subtle">
              <span className="text-base font-medium">Windows</span>
              <span className="text-sm">Em breve</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border p-6 text-center text-subtle">
              <span className="text-base font-medium">Android</span>
              <span className="text-sm">Em breve</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 text-sm text-subtle sm:flex-row sm:justify-between">
          <span>Dindin — um produto Café Labs</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/CafeLabsDev/dindin"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="mailto:contato@cafelabs.net"
              className="transition-colors hover:text-foreground"
            >
              contato@cafelabs.net
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
