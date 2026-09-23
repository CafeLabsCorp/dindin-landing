import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { BASE_URL } from "@/lib/site";
import { LEGAL_DOCS_APPROVED } from "./[locale]/legal/status";

// 2026-09-22 public-site audit item: sitemap for the 4 routes this site has,
// each in both locales. /privacidade and /termos are left out while they are
// still unreviewed drafts (LEGAL_DOCS_APPROVED === false) — those pages
// already send `noindex, nofollow` (see legal/status.ts), and listing a page
// in the sitemap while also telling crawlers not to index it is a
// contradictory signal search engines are known to flag.
const ROUTES = ["", "/excluir-conta", ...(LEGAL_DOCS_APPROVED ? ["/privacidade", "/termos"] : [])];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) =>
    routing.locales.map((locale) => {
      const languages = Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}${route}`]),
      );

      return {
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        alternates: {
          languages: {
            ...languages,
            "x-default": `${BASE_URL}/${routing.defaultLocale}${route}`,
          },
        },
      };
    }),
  );
}
