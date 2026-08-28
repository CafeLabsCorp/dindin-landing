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
  // 1. Unresolved [CONFIRMAR] in the source draft, section 6. Nobody has
  //    confirmed the Firestore region of the `dindin-cafelabs` project, and
  //    the answer changes the text: `southamerica-east1` means the data stays
  //    in Brazil, anything else means there IS an international transfer.
  //    The page renders both branches verbatim, flagged as unresolved — no
  //    value was invented here.
  "Política de Privacidade §6: região do Firestore do projeto `dindin-cafelabs` " +
    "ainda não confirmada — o texto publica as duas hipóteses (transferência " +
    "internacional ou não) em vez de uma afirmação.",

  // 2. Unresolved [CONFIRMAR] in the source draft, section 8: the deletion
  //    procedure describes intended behaviour of a flow that is not yet
  //    implemented in the app.
  "Política de Privacidade §8: o fluxo de exclusão de conta descrito " +
    "(Ajustes → Excluir conta) ainda não está implementado no aplicativo.",

  // 3. Found by the frontend pass, not present in the compliance draft:
  //    next-intl's middleware sets a `NEXT_LOCALE` cookie (functional, no
  //    tracking, no cross-site identifier) when the visitor's locale differs
  //    from what Accept-Language would pick, and whenever the language toggle
  //    is used. Section 3.5 currently states, without qualification, that the
  //    site sets no cookie. That sentence needs either a carve-out for the
  //    language-preference cookie or `localeCookie: false` in
  //    `src/i18n/routing.ts`. Not decided unilaterally here — see the report.
  "Política de Privacidade §3.5: afirma que o site não usa cookie, mas o " +
    "middleware do next-intl grava um cookie funcional `NEXT_LOCALE` de " +
    "preferência de idioma. Corrigir o texto ou desligar o cookie.",

  // 4. The drafts print Felipe's CPF in full (privacidade §2 and §12, termos
  //    §1) on what will be a public, indexable page. That is a deliberate
  //    identification choice for a controller without CNPJ, but it is also a
  //    personal identifier of a natural person exposed to the open web — a
  //    call for the lawyer, not for this repo.
  "Publicação do CPF completo do controlador em página pública indexável: " +
    "confirmar com advogado(a) se é necessário identificar assim ou se nome " +
    "completo + e-mail bastam.",
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
