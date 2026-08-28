import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { LEGAL_DOCS_APPROVED, LEGAL_DOCS_DATE, LEGAL_DOCS_VERSION } from "./status";

// Banner shown at the very top of /privacidade and /termos while the source
// drafts have not been through legal review. Rendered before the document
// title on purpose: the first thing anyone reads — user, Google Play reviewer
// or the lawyer doing the review — has to be "this is a draft", not the
// document's own confident prose.
export async function DraftNotice() {
  if (LEGAL_DOCS_APPROVED) return null;

  const tLegal = await getTranslations("Legal");

  return (
    <div
      role="note"
      className="mb-8 rounded-2xl border-2 border-accent bg-surface p-4 shadow-card sm:p-5"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">
        {tLegal("draftBadge")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        {tLegal("draftHeadline", {
          version: LEGAL_DOCS_VERSION,
          date: LEGAL_DOCS_DATE,
        })}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{tLegal("draftBody")}</p>
    </div>
  );
}

// Shown on the legal documents when the visitor is on /en. The binding text is
// the Portuguese one; a translated version would need its own legal review and
// is deliberately out of scope.
export async function PtOnlyNotice({ locale }: { locale: string }) {
  if (locale === "pt") return null;

  const tLegal = await getTranslations("Legal");

  return (
    <p
      lang="en"
      className="mb-8 rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-muted"
    >
      {tLegal("ptOnlyNotice")}
    </p>
  );
}

// Wraps a `[CONFIRMAR: ...]` placeholder from the source draft. The point is
// that an unresolved placeholder can never be mistaken for finished text: it
// is visually separated, explicitly labelled, and the corresponding entry in
// PUBLICATION_BLOCKERS (legal/status.ts) blocks the build if someone marks the
// documents as approved without answering it first.
//
// `variant="notice"` reuses the same treatment for the drafts' own closing
// "Aviso de elaboração" — same "this is not finished" signal, but it isn't a
// missing piece of data, so it gets a neutral label.
export async function UnresolvedPlaceholder({
  variant = "pending",
  children,
}: {
  variant?: "pending" | "notice";
  children: ReactNode;
}) {
  const tLegal = await getTranslations("Legal");

  return (
    <aside role="note" className="legal-pending">
      <p className="legal-pending-label">
        {variant === "notice" ? tLegal("noticeLabel") : tLegal("pendingLabel")}
      </p>
      {children}
    </aside>
  );
}
