import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

// Single footer shared by the home page and by every legal/action page
// (/privacidade, /termos, /excluir-conta) — extracted when those pages landed,
// so the three required links can't drift out of sync between copies.
//
// /privacidade and /termos are linked unconditionally even while the documents
// are still drafts (see legal/status.ts): the draft status is communicated on
// the page itself, and a footer that hides its own legal links would be worse
// for anyone actually looking for them.
export async function SiteFooter() {
  const tFooter = await getTranslations("Footer");

  const linkClass =
    "transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <footer className="w-full border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 text-sm text-subtle sm:flex-row sm:items-start sm:justify-between">
        <span>{tFooter("brand")}</span>
        <nav aria-label={tFooter("navLabel")}>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
            <li>
              <Link href="/privacidade" className={linkClass}>
                {tFooter("privacyLink")}
              </Link>
            </li>
            <li>
              <Link href="/termos" className={linkClass}>
                {tFooter("termsLink")}
              </Link>
            </li>
            <li>
              <Link href="/excluir-conta" className={linkClass}>
                {tFooter("deleteAccountLink")}
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/CafeLabsCorp/dindin"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="mailto:contato@cafelabs.net" className={linkClass}>
                contato@cafelabs.net
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
