"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

type CaixinhaId = "verde" | "terra" | "ambar";
type Mode = "add" | "alocar" | "transferir";

interface Caixinha {
  id: CaixinhaId;
  color: string;
  balance: number;
}

const SEED_CONTA = 500;
const SEED_CAIXINHAS: Caixinha[] = [
  { id: "verde", color: "var(--cat-1)", balance: 0 },
  { id: "terra", color: "var(--cat-2)", balance: 0 },
  { id: "ambar", color: "var(--cat-3)", balance: 0 },
];

const CAIXINHA_NAME_KEY: Record<CaixinhaId, "caixinhaVerde" | "caixinhaTerra" | "caixinhaAmbar"> = {
  verde: "caixinhaVerde",
  terra: "caixinhaTerra",
  ambar: "caixinhaAmbar",
};

// Currency stays in BRL regardless of language — this demo mirrors a
// Brazilian financial app, only the surrounding copy switches locale — but
// grouping/decimal separators still follow the active locale's convention.
function intlLocale(locale: string) {
  return locale === "pt" ? "pt-BR" : "en-US";
}

function fmt(locale: string, value: number) {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Increases read "+R$ 150,00"; decreases read "R$ -150,00" — money moving out
// via a chosen transfer/allocation isn't an error, so it keeps the ordinary
// currency shape rather than a plain minus sign in front.
function fmtDelta(locale: string, amount: number) {
  const abs = new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return amount > 0 ? `+R$ ${abs}` : `R$ -${abs}`;
}

interface DeltaState {
  id: number;
  amount: number;
  show: boolean;
}

function useDeltaPill() {
  const [delta, setDelta] = useState<DeltaState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  function trigger(amount: number) {
    if (amount === 0) return;
    const id = Date.now() + Math.random();
    setDelta({ id, amount, show: false });
    requestAnimationFrame(() => {
      setDelta((current) => (current && current.id === id ? { ...current, show: true } : current));
    });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDelta((current) => (current && current.id === id ? { ...current, show: false } : current));
    }, 1400);
  }

  return { delta, trigger };
}

function usePulse() {
  const [pulseId, setPulseId] = useState(0);
  function trigger() {
    setPulseId((n) => n + 1);
  }
  return { pulseId, trigger };
}

function DeltaPill({ delta }: { delta: DeltaState | null }) {
  const locale = useLocale();
  if (!delta) return null;
  return (
    <span
      className={`delta-pill text-xs font-bold [font-variant-numeric:tabular-nums] ${
        delta.show ? "show" : ""
      } ${delta.amount > 0 ? "text-status-good" : "text-subtle"}`}
    >
      {fmtDelta(locale, delta.amount)}
    </span>
  );
}

// Only apply the pulse class once a real change has happened (pulseId > 0),
// so the numbers don't animate on first page load.
function pulseClassName(pulseId: number, base: string) {
  return pulseId > 0 ? `${base} value-pulse` : base;
}

export default function CaixinhasDemo() {
  const t = useTranslations("Demo");
  const locale = useLocale();

  const [conta, setConta] = useState(SEED_CONTA);
  const [caixinhas, setCaixinhas] = useState<Caixinha[]>(SEED_CAIXINHAS);
  const [mode, setMode] = useState<Mode>("add");

  const [addValor, setAddValor] = useState("");
  const [addError, setAddError] = useState("");

  const [alocarDestino, setAlocarDestino] = useState<CaixinhaId>(SEED_CAIXINHAS[0].id);
  const [alocarValor, setAlocarValor] = useState("");
  const [alocarError, setAlocarError] = useState("");

  const [transfOrigemRaw, setTransfOrigemRaw] = useState<CaixinhaId | "">("");
  const [transfDestinoRaw, setTransfDestinoRaw] = useState<CaixinhaId | "">("");
  const [transfValor, setTransfValor] = useState("");
  const [transfError, setTransfError] = useState("");

  const [liveMessage, setLiveMessage] = useState("");

  const contaDelta = useDeltaPill();
  const contaPulse = usePulse();
  const verdeDelta = useDeltaPill();
  const verdePulse = usePulse();
  const terraDelta = useDeltaPill();
  const terraPulse = usePulse();
  const ambarDelta = useDeltaPill();
  const ambarPulse = usePulse();

  const deltaById: Record<CaixinhaId, ReturnType<typeof useDeltaPill>> = {
    verde: verdeDelta,
    terra: terraDelta,
    ambar: ambarDelta,
  };
  const pulseById: Record<CaixinhaId, ReturnType<typeof usePulse>> = {
    verde: verdePulse,
    terra: terraPulse,
    ambar: ambarPulse,
  };

  const formAreaRef = useRef<HTMLDivElement>(null);
  const isFirstModeRender = useRef(true);
  useEffect(() => {
    if (isFirstModeRender.current) {
      isFirstModeRender.current = false;
      return;
    }
    const firstField = formAreaRef.current?.querySelector<HTMLElement>("input, select");
    firstField?.focus();
  }, [mode]);

  function caixinhaName(id: CaixinhaId) {
    return t(CAIXINHA_NAME_KEY[id]);
  }

  function announce(message: string) {
    setLiveMessage("");
    requestAnimationFrame(() => setLiveMessage(message));
  }

  const totalGeral = conta + caixinhas.reduce((sum, c) => sum + c.balance, 0);
  const pctUnallocated = totalGeral > 0 ? Math.min(100, Math.max(0, (conta / totalGeral) * 100)) : 100;

  const eligibleOrigins = caixinhas.filter((c) => c.balance > 0);
  const effectiveOrigem: CaixinhaId | "" = eligibleOrigins.some((c) => c.id === transfOrigemRaw)
    ? transfOrigemRaw
    : eligibleOrigins[0]?.id ?? "";
  const destinoOptions = caixinhas.filter((c) => c.id !== effectiveOrigem);
  const effectiveDestino: CaixinhaId | "" = destinoOptions.some((c) => c.id === transfDestinoRaw)
    ? transfDestinoRaw
    : destinoOptions[0]?.id ?? "";

  function handleAddSubmit(event: FormEvent) {
    event.preventDefault();
    const val = parseFloat(addValor);
    if (!val || val <= 0) {
      setAddError(t("errorValueRequired"));
      return;
    }
    setAddError("");
    const newConta = conta + val;
    setConta(newConta);
    contaPulse.trigger();
    contaDelta.trigger(val);
    announce(t("announceAdded", { amount: fmt(locale, newConta) }));
    setAddValor("");
  }

  function handleAlocarSubmit(event: FormEvent) {
    event.preventDefault();
    const val = parseFloat(alocarValor);
    if (!val || val <= 0) {
      setAlocarError(t("errorValueRequired"));
      return;
    }
    if (val > conta) {
      setAlocarError(t("alocarErrorExceeds", { balance: fmt(locale, conta) }));
      return;
    }
    const destino = caixinhas.find((c) => c.id === alocarDestino);
    if (!destino) return;
    setAlocarError("");
    const newConta = conta - val;
    setConta(newConta);
    setCaixinhas((cs) => cs.map((c) => (c.id === destino.id ? { ...c, balance: c.balance + val } : c)));
    contaPulse.trigger();
    contaDelta.trigger(-val);
    pulseById[destino.id].trigger();
    deltaById[destino.id].trigger(val);
    announce(
      t("announceAllocated", {
        amount: fmt(locale, val),
        name: caixinhaName(destino.id),
        balance: fmt(locale, newConta),
      }),
    );
    setAlocarValor("");
  }

  function handleTransferirSubmit(event: FormEvent) {
    event.preventDefault();
    const origem = caixinhas.find((c) => c.id === effectiveOrigem);
    const destino = caixinhas.find((c) => c.id === effectiveDestino);
    if (!origem || !destino) return;
    const val = parseFloat(transfValor);
    if (!val || val <= 0) {
      setTransfError(t("errorValueRequired"));
      return;
    }
    if (val > origem.balance) {
      setTransfError(t("transferErrorExceeds", { name: caixinhaName(origem.id), balance: fmt(locale, origem.balance) }));
      return;
    }
    setTransfError("");
    setCaixinhas((cs) =>
      cs.map((c) => {
        if (c.id === origem.id) return { ...c, balance: c.balance - val };
        if (c.id === destino.id) return { ...c, balance: c.balance + val };
        return c;
      }),
    );
    pulseById[origem.id].trigger();
    deltaById[origem.id].trigger(-val);
    pulseById[destino.id].trigger();
    deltaById[destino.id].trigger(val);
    announce(
      t("announceTransferred", {
        amount: fmt(locale, val),
        origem: caixinhaName(origem.id),
        destino: caixinhaName(destino.id),
      }),
    );
    setTransfValor("");
  }

  function handleReset() {
    setConta(SEED_CONTA);
    setCaixinhas(SEED_CAIXINHAS.map((c) => ({ ...c })));
    setMode("add");
    setAddValor("");
    setAddError("");
    setAlocarValor("");
    setAlocarError("");
    setAlocarDestino(SEED_CAIXINHAS[0].id);
    setTransfOrigemRaw("");
    setTransfDestinoRaw("");
    setTransfValor("");
    setTransfError("");
    announce(t("announceReset"));
  }

  const modes: { id: Mode; label: string }[] = [
    { id: "add", label: t("modeAdd") },
    { id: "alocar", label: t("modeAlocar") },
    { id: "transferir", label: t("modeTransferir") },
  ];

  return (
    <section id="caixinhas" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center font-serif text-3xl font-semibold text-foreground">
        {t("title")}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center leading-relaxed text-muted">
        {t("description")}
      </p>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <div className="text-xs font-bold tracking-wide text-subtle uppercase">
          {t("accountBalanceLabel")}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2.5">
          <span
            key={contaPulse.pulseId}
            className={pulseClassName(
              contaPulse.pulseId,
              "font-serif text-3xl font-bold text-foreground [font-variant-numeric:tabular-nums]",
            )}
          >
            {fmt(locale, conta)}
          </span>
          <DeltaPill delta={contaDelta.delta} />
        </div>

        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-secondary transition-[width] duration-300"
            style={{ width: `${pctUnallocated}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-subtle [font-variant-numeric:tabular-nums]">
          {t("unallocatedText", { amount: fmt(locale, conta), total: fmt(locale, totalGeral) })}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {caixinhas.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-border bg-surface p-3.5"
              style={{ borderLeftWidth: 4, borderLeftColor: c.color }}
            >
              <div className="mb-2.5 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 flex-none rounded-full"
                  style={{ background: c.color }}
                />
                <span className="text-sm font-semibold text-foreground">
                  {caixinhaName(c.id)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  key={pulseById[c.id].pulseId}
                  className={pulseClassName(
                    pulseById[c.id].pulseId,
                    "font-serif text-xl font-bold text-foreground [font-variant-numeric:tabular-nums]",
                  )}
                >
                  {fmt(locale, c.balance)}
                </span>
                <DeltaPill delta={deltaById[c.id].delta} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 border-t border-border pt-5">
          <div role="group" aria-label={t("actionGroupLabel")} className="flex flex-wrap gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mode === m.id}
                onClick={() => setMode(m.id)}
                className={`min-h-11 flex-1 rounded-full border border-border px-4 text-sm font-semibold transition-colors ${
                  mode === m.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-transparent text-muted"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div ref={formAreaRef} className="mt-4">
            {mode === "add" && (
              <form onSubmit={handleAddSubmit} noValidate>
                <div className="mb-3.5 flex flex-col gap-1">
                  <label htmlFor="add-valor" className="text-sm font-semibold text-muted">
                    {t("addValorLabel")}
                  </label>
                  <input
                    id="add-valor"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={addValor}
                    onChange={(e) => setAddValor(e.target.value)}
                    className="h-11 rounded-xl border border-border bg-background px-3 text-foreground"
                  />
                </div>
                <p className="mb-3 min-h-[1em] text-xs text-status-critical" role="alert">
                  {addError}
                </p>
                <button
                  type="submit"
                  className="h-11 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
                >
                  {t("addButton")}
                </button>
              </form>
            )}

            {mode === "alocar" && (
              <form onSubmit={handleAlocarSubmit} noValidate>
                <div className="flex flex-wrap gap-3">
                  <div className="flex min-w-[160px] flex-1 flex-col gap-1">
                    <label htmlFor="alocar-destino" className="text-sm font-semibold text-muted">
                      {t("alocarDestinoLabel")}
                    </label>
                    <select
                      id="alocar-destino"
                      value={alocarDestino}
                      onChange={(e) => setAlocarDestino(e.target.value as CaixinhaId)}
                      className="h-11 rounded-xl border border-border bg-background px-3 text-foreground"
                    >
                      {caixinhas.map((c) => (
                        <option key={c.id} value={c.id}>
                          {caixinhaName(c.id)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex min-w-[160px] flex-1 flex-col gap-1">
                    <label htmlFor="alocar-valor" className="text-sm font-semibold text-muted">
                      {t("alocarValorLabel")}
                    </label>
                    <input
                      id="alocar-valor"
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={conta}
                      value={alocarValor}
                      disabled={conta === 0}
                      onChange={(e) => setAlocarValor(e.target.value)}
                      className="h-11 rounded-xl border border-border bg-background px-3 text-foreground disabled:opacity-50"
                    />
                  </div>
                </div>
                <p className="mt-3 mb-1 min-h-[1em] text-xs text-status-critical" role="alert">
                  {alocarError}
                </p>
                {conta === 0 && (
                  <p className="mb-3 text-xs text-subtle">{t("alocarNeedsBalance")}</p>
                )}
                <button
                  type="submit"
                  disabled={conta === 0}
                  className="mt-2 h-11 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-45"
                >
                  {t("alocarButton")}
                </button>
              </form>
            )}

            {mode === "transferir" && (
              <form onSubmit={handleTransferirSubmit} noValidate>
                {eligibleOrigins.length === 0 ? (
                  <>
                    <p className="mb-3 text-xs text-subtle">{t("transferNoEligible")}</p>
                    <button
                      type="submit"
                      disabled
                      className="h-11 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground disabled:opacity-45"
                    >
                      {t("transferButton")}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex min-w-[140px] flex-1 flex-col gap-1">
                        <label htmlFor="transf-origem" className="text-sm font-semibold text-muted">
                          {t("transferOrigemLabel")}
                        </label>
                        <select
                          id="transf-origem"
                          value={effectiveOrigem}
                          onChange={(e) => setTransfOrigemRaw(e.target.value as CaixinhaId)}
                          className="h-11 rounded-xl border border-border bg-background px-3 text-foreground"
                        >
                          {eligibleOrigins.map((c) => (
                            <option key={c.id} value={c.id}>
                              {caixinhaName(c.id)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex min-w-[140px] flex-1 flex-col gap-1">
                        <label htmlFor="transf-destino" className="text-sm font-semibold text-muted">
                          {t("transferDestinoLabel")}
                        </label>
                        <select
                          id="transf-destino"
                          value={effectiveDestino}
                          onChange={(e) => setTransfDestinoRaw(e.target.value as CaixinhaId)}
                          className="h-11 rounded-xl border border-border bg-background px-3 text-foreground"
                        >
                          {destinoOptions.map((c) => (
                            <option key={c.id} value={c.id}>
                              {caixinhaName(c.id)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex min-w-[140px] flex-1 flex-col gap-1">
                        <label htmlFor="transf-valor" className="text-sm font-semibold text-muted">
                          {t("transferValorLabel")}
                        </label>
                        <input
                          id="transf-valor"
                          type="number"
                          min="0.01"
                          step="0.01"
                          max={caixinhas.find((c) => c.id === effectiveOrigem)?.balance}
                          value={transfValor}
                          onChange={(e) => setTransfValor(e.target.value)}
                          className="h-11 rounded-xl border border-border bg-background px-3 text-foreground"
                        />
                      </div>
                    </div>
                    <p className="mt-3 mb-3 min-h-[1em] text-xs text-status-critical" role="alert">
                      {transfError}
                    </p>
                    <button
                      type="submit"
                      className="h-11 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
                    >
                      {t("transferButton")}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-subtle">
          <span>{t("previewNote")}</span>
          <button
            type="button"
            onClick={handleReset}
            className="font-bold text-primary underline decoration-1 underline-offset-2"
          >
            {t("resetButton")}
          </button>
        </div>
      </div>

      <div aria-live="polite" role="status" className="sr-only">
        {liveMessage}
      </div>
    </section>
  );
}
