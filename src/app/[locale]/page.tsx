import Image from "next/image";
import { getTranslations } from "next-intl/server";

import CaixinhasDemo from "./CaixinhasDemo";
import { LanguageSwitcher } from "./LanguageSwitcher";

const WEB_APP_URL = "https://app.dindin.cafelabs.net";

const heroTabs = [
  { top: "60px", left: "6%", rotate: "-9deg", cat: "var(--cat-1)" },
  { top: "40px", left: "20%", rotate: "6deg", cat: "var(--cat-3)" },
  { top: "90px", right: "22%", rotate: "-5deg", cat: "var(--cat-4)" },
  { top: "50px", right: "7%", rotate: "10deg", cat: "var(--cat-2)" },
  { bottom: "20px", left: "12%", rotate: "4deg", cat: "var(--cat-7)" },
  { bottom: "10px", right: "14%", rotate: "-7deg", cat: "var(--cat-5)" },
];

export default async function Home() {
  const [tHeader, tHero, tDownload, tFeatures, tFooter] = await Promise.all([
    getTranslations("Header"),
    getTranslations("Hero"),
    getTranslations("Download"),
    getTranslations("Features"),
    getTranslations("Footer"),
  ]);

  const features = [
    { title: tFeatures("item1Title"), description: tFeatures("item1Description") },
    { title: tFeatures("item2Title"), description: tFeatures("item2Description") },
    { title: tFeatures("item3Title"), description: tFeatures("item3Description") },
  ];

  return (
    <>
      <header className="h-16 w-full border-b border-border">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Image src="/dindin-logo.svg" alt="Dindin" width={28} height={28} />
            <span className="text-lg font-semibold">Dindin</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://cafelabs.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-subtle transition-colors hover:text-foreground"
            >
              {tHeader("brandBy")}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
            {heroTabs.map((tab, index) => (
              <span
                key={index}
                className="envelope-tab"
                style={{
                  top: tab.top,
                  left: tab.left,
                  right: tab.right,
                  bottom: tab.bottom,
                  transform: `rotate(${tab.rotate})`,
                  color: tab.cat,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-12 text-center">
            <Image src="/dindin-logo.svg" alt="" width={72} height={72} aria-hidden />
            <h1 className="max-w-2xl font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {tHero("title")}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              {tHero("description")}
            </p>
            <a
              href={WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              {tHero("ctaOpenApp")}
            </a>
            <a
              href="#caixinhas"
              className="scroll-cue mt-6 flex flex-col items-center gap-1 text-sm text-subtle transition-colors hover:text-foreground"
            >
              {tHero("ctaHowItWorks")}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-serif text-3xl font-semibold text-foreground">
            {tDownload("title")}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <a
              href={WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-6 text-center shadow-card transition-colors hover:border-primary"
            >
              <span className="text-base font-semibold text-foreground">
                {tDownload("webLabel")}
              </span>
              <span className="inline-flex rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-primary-container-foreground">
                {tDownload("webAvailable")}
              </span>
            </a>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-6 text-center text-subtle">
              <span className="text-base font-semibold">{tDownload("windowsLabel")}</span>
              <span className="text-sm">{tDownload("comingSoon")}</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-6 text-center text-subtle">
              <span className="text-base font-semibold">{tDownload("androidLabel")}</span>
              <span className="text-sm">{tDownload("comingSoon")}</span>
            </div>
          </div>
        </section>

        <CaixinhasDemo />

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-hover rounded-2xl border border-border bg-surface p-6 shadow-card"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 text-sm text-subtle sm:flex-row sm:justify-between">
          <span>{tFooter("brand")}</span>
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
