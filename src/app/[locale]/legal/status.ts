// Publication gate for the Dindin legal documents (/privacidade, /termos).
//
// Unlike Micare's, the Dindin legal texts have NOT been reviewed by a lawyer.
// The source drafts (dindin/legal/*.md) are marked "Versão 0.1 — MINUTA" and
// carry an explicit instruction not to publish, not to link from the Google
// Play listing and not to present them to a user before legal review.
//
// The pages are built and transcribed in full so the review can happen on the
// real thing, but everything that would make them read as finished text is
// driven from this single flag:
//
//   - LEGAL_DOCS_APPROVED === false  →  every legal page renders a prominent
//     "MINUTA" notice as its first content and sends `noindex, nofollow`.
//   - Flipping it to `true` is the ONLY change needed the day the lawyer
//     signs off — nothing else in the pages hardcodes the draft status.
//
// The flag cannot be flipped while anything in PUBLICATION_BLOCKERS is still
// open: the assertion at the bottom of this file throws at module evaluation,
// which fails `next build`. This is deliberate — the drafts contain at least
// one unresolved `[CONFIRMAR]` placeholder, and an unresolved placeholder must
// not be able to ship silently as if it were finished text.
export const LEGAL_DOCS_APPROVED: boolean = false;

export const LEGAL_DOCS_VERSION = "0.1";
export const LEGAL_DOCS_DATE = "27 de agosto de 2026";

// Everything that has to be resolved before LEGAL_DOCS_APPROVED can become
// `true`. Remove an entry only when the underlying question is actually
// answered — not when the page merely stops mentioning it.
export const PUBLICATION_BLOCKERS: string[] = [
  // The deletion procedure in section 8 describes the behaviour of a flow that
  // is not yet built in the app. The policy (immediate hard delete, export
  // offered beforehand) was ratified on 2026-08-31, but the in-app screen and
  // public /excluir-conta flow still have to be implemented before the page
  // can claim this works. Clears when the mobile app ships the deletion UI.
  "Política de Privacidade §8: o fluxo de exclusão de conta descrito " +
    "(Ajustes → Excluir conta) ainda não está implementado no aplicativo.",

  // New section 3.4 (Google Analytics para Firebase, minimal instrumentation —
  // product decision of 2026-08-31). Two open [CONFIRMAR] for the lawyer:
  // whether the usage measurement rests on legitimate interest + opt-out or
  // needs opt-in consent, and the retention window to pin in the console. Also
  // the in-app "Ajustes → Privacidade" toggle it promises is not built yet.
  "Política de Privacidade §3.4: medição de uso via Firebase Analytics — " +
    "advogado(a) precisa confirmar a base legal (legítimo interesse + opt-out " +
    "vs. consentimento) e o prazo de retenção; o controle in-app ainda não existe.",

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
