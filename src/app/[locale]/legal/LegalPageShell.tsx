import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { SiteFooter } from "../SiteFooter";

// Shared chrome for the text-heavy pages that hang off the landing
// (/privacidade, /termos, /excluir-conta). Same visual language as the home
// page ([locale]/page.tsx) — narrower column, since these are read, not
// scanned. Kept as its own file only because three pages need it, not as a
// general-purpose layout system.
//
// `notices` renders above the H1: it's where each page puts its own banners
// (draft status, Portuguese-only warning), which differ per page — the legal
// documents are drafts and PT-only, /excluir-conta is neither.
export async function LegalPageShell({
  title,
  subtitle,
  notices,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  notices?: ReactNode;
  children: ReactNode;
}) {
  const tLegal = await getTranslations("Legal");

  return (
    <>
      <header className="h-16 w-full border-b border-border">
        <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Image src="/dindin-logo.svg" alt="" width={28} height={28} aria-hidden />
            <span className="text-lg font-semibold">Dindin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-subtle transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {tLegal("backHome")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-12">
          {notices}

          <h1 className="font-serif text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm leading-relaxed text-subtle">{subtitle}</p>}

          <article className="legal-doc">{children}</article>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
