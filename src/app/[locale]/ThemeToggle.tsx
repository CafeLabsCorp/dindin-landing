"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

// Alterna claro ↔ escuro. Antes do primeiro clique segue o sistema; o
// clique sempre vai pro tema oposto ao que está na tela, então nunca é um
// clique "sem efeito" (o que aconteceria com um ciclo sistema → claro →
// escuro quando o sistema já está no claro).
const noopSubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("Header");
  // O tema salvo só existe no cliente; no servidor (e na hidratação) um
  // placeholder do mesmo tamanho evita erro de hidratação e pulo de layout.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";
  const label = mounted ? t(isDark ? "themeToLight" : "themeToDark") : t("theme");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={mounted ? label : undefined}
      className="rounded-full border border-border px-2 py-1 text-subtle transition-colors hover:border-primary hover:text-foreground"
    >
      {!mounted ? (
        <span className="block h-3.5 w-3.5" />
      ) : isDark ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}
