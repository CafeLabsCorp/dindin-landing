import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  // Desliga o cookie `NEXT_LOCALE` do next-intl. O idioma já vem no path
  // (`/pt`, `/en`) e no seletor de idioma; sem o cookie, a Política de
  // Privacidade pode afirmar sem ressalva que o site não grava nenhum cookie.
  localeCookie: false,
});
