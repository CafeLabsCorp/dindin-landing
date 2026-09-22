// Publication gate for the Dindin legal documents (/privacidade, /termos).
//
// The lawyer reviewed the drafts (dindin/legal/*.md) as a delta of the
// Micare review (approved 2026-08-21) and approved them on 2026-09-22
// (B4/decision 6). The account-deletion flow they describe (§8) also shipped
// in the app before this flag flipped (`2dac928`, tested).
//
// The pages are built and transcribed in full, and everything that makes
// them read as finished text is driven from this single flag:
//
//   - LEGAL_DOCS_APPROVED === false  →  every legal page renders a prominent
//     "MINUTA" notice as its first content and sends `noindex, nofollow`.
//   - LEGAL_DOCS_APPROVED === true   →  no draft banner, pages are indexable.
//
// The flag cannot be flipped while anything in PUBLICATION_BLOCKERS is still
// open: the assertion at the bottom of this file throws at module evaluation,
// which fails `next build`. This is deliberate — an unresolved blocker must
// not be able to ship silently as if it were finished text.
export const LEGAL_DOCS_APPROVED: boolean = true;

export const LEGAL_DOCS_VERSION = "1.0";
export const LEGAL_DOCS_DATE = "22 de setembro de 2026";

// Everything that has to be resolved before LEGAL_DOCS_APPROVED can become
// `true`. Remove an entry only when the underlying question is actually
// answered — not when the page merely stops mentioning it.
export const PUBLICATION_BLOCKERS: string[] = [
  // Resolved and removed from this list on 2026-08-31:
  //  - §6 Firestore region: confirmed `southamerica-east1` (São Paulo) — the
  //    text now states plainly that data stays in Brazil, no international
  //    transfer of the financial notes.
  //  - §3.5 no-cookie claim: `localeCookie: false` set in `src/i18n/routing.ts`,
  //    so next-intl no longer writes the `NEXT_LOCALE` cookie. Claim is true.
  //  - Controller CPF on a public page: Felipe decided full name + e-mail is
  //    enough; the CPF was removed from both drafts and both landing pages.
  //    (Still worth a line to the lawyer to confirm this identifies the
  //    controller sufficiently under the LGPD.)
  //
  // Resolved and removed from this list on 2026-09-22 (lawyer review, B4/
  // decision 6, approved):
  //  - §3.4 Google Analytics para Firebase: legal basis (legítimo interesse +
  //    opt-out) and retention window confirmed by the lawyer. The in-app
  //    "Ajustes → Privacidade" opt-out toggle it promises is already shipped
  //    (`settings_page.dart`, `analyticsOptOutProvider`).
  //  - §8 account deletion: the self-service flow (Ajustes → Excluir conta,
  //    immediate hard delete with export offered beforehand) shipped and was
  //    tested (`2dac928`, 345 Dart tests + 111 rules tests green).
];

if (LEGAL_DOCS_APPROVED && PUBLICATION_BLOCKERS.length > 0) {
  throw new Error(
    "LEGAL_DOCS_APPROVED foi marcado como true, mas ainda há pendências " +
      "abertas em PUBLICATION_BLOCKERS:\n" +
      PUBLICATION_BLOCKERS.map((item) => `  - ${item}`).join("\n") +
      "\nResolva as pendências (e remova-as da lista) antes de publicar os " +
      "documentos legais.",
  );
}
