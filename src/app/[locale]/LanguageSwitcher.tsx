"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Header");
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === "pt" ? "en" : "pt";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label={t("switchLanguage")}
      className="rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-subtle transition-colors hover:border-primary hover:text-foreground"
    >
      {nextLocale}
    </button>
  );
}
