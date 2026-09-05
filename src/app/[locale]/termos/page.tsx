import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LegalPageShell } from "../legal/LegalPageShell";
import { DraftNotice, PtOnlyNotice, UnresolvedPlaceholder } from "../legal/Notices";
import { LEGAL_DOCS_APPROVED, LEGAL_DOCS_DATE, LEGAL_DOCS_VERSION } from "../legal/status";

// Content transcribed from dindin/legal/termos-de-uso.md (Versão 0.1 — MINUTA
// de 27 de agosto de 2026). Markdown → semantic HTML only; no wording added,
// removed or reworded. See ../privacidade/page.tsx for the note on which parts
// of the source file are intentionally left off the page (the internal
// publishing blockquote) and which are kept (the closing "Aviso de
// elaboração", still true here) — same reasoning applies.
//
// `noindex, nofollow` and a draft banner while LEGAL_DOCS_APPROVED is false.
// See ../legal/status.ts.
const BASE_URL = "https://dindin.cafelabs.net";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tLegal = await getTranslations({ locale, namespace: "Legal" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${BASE_URL}/${l}/termos`]),
  );

  return {
    title: tLegal("termsTitle"),
    description: tLegal("termsMetaDescription"),
    robots: { index: LEGAL_DOCS_APPROVED, follow: LEGAL_DOCS_APPROVED },
    alternates: {
      canonical: `${BASE_URL}/${locale}/termos`,
      languages: {
        ...languages,
        "x-default": `${BASE_URL}/${routing.defaultLocale}/termos`,
      },
    },
    openGraph: {
      title: tLegal("termsTitle"),
      description: tLegal("termsMetaDescription"),
      url: `${BASE_URL}/${locale}/termos`,
      siteName: "Dindin",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tLegal("termsTitle"),
      description: tLegal("termsMetaDescription"),
    },
  };
}

export default async function TermosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tLegal = await getTranslations({ locale, namespace: "Legal" });

  return (
    <LegalPageShell
      title={tLegal("termsTitle")}
      subtitle={
        <>
          Versão {LEGAL_DOCS_VERSION} — MINUTA de {LEGAL_DOCS_DATE}
          <br />
          Status: não revisados por advogado(a).
        </>
      }
      notices={
        <>
          <DraftNotice />
          <PtOnlyNotice locale={locale} />
        </>
      }
    >
      <div lang="pt-BR">
        <h2>1. O que é o Dindin</h2>
        <p>
          O Dindin é um aplicativo de{" "}
          <strong>organização financeira pessoal</strong> baseado em
          &quot;caixinhas&quot; (envelopes): você registra o que recebe,
          distribui esse valor entre caixinhas com propósitos diferentes (gastar
          ou guardar) e registra o que gasta em cada uma.
        </p>
        <p>
          <strong>Todo lançamento é feito manualmente por você.</strong> O
          Dindin é um caderno digital: ele soma, organiza e mostra o que você
          escreveu.
        </p>
        <p>
          O Dindin é fornecido pela <strong>Café Labs</strong>, operada por
          Felipe Portes Antunes — a Café Labs ainda não possui CNPJ próprio.
          Contato: <code>contato@cafelabs.net</code>.
        </p>

        <h3>1.1 O que o Dindin NÃO é</h3>
        <p>
          Leia esta lista com atenção, porque ela define o que você pode esperar
          do aplicativo:
        </p>
        <ul>
          <li>
            <strong>
              Não é uma instituição financeira, banco, fintech, carteira digital
              ou meio de pagamento.
            </strong>{" "}
            A Café Labs não é autorizada nem regulada pelo Banco Central do
            Brasil, e não precisa ser: o Dindin não realiza nenhuma operação
            financeira.
          </li>
          <li>
            <strong>Não se conecta ao seu banco, cartão ou Open Finance.</strong>{" "}
            Não importa extrato, não lê fatura, não sincroniza saldo real. Se o
            número no app estiver diferente do número no seu banco, o número
            certo é o do banco.
          </li>
          <li>
            <strong>Não movimenta dinheiro.</strong> Nenhum valor é transferido,
            pago, cobrado, investido ou resgatado pelo Dindin. Uma
            &quot;transferência entre caixinhas&quot; é apenas uma anotação sua,
            não um movimento bancário.
          </li>
          <li>
            <strong>
              Não é consultoria financeira, recomendação de investimento nem
              aconselhamento de crédito.
            </strong>{" "}
            Nada no aplicativo deve ser entendido como orientação profissional.
            As suas decisões financeiras são suas.
          </li>
          <li>
            <strong>
              Não faz análise de crédito, score, nem repassa dados a bureaus.
            </strong>
          </li>
          <li>
            <strong>Não é canal de atendimento de urgência.</strong>
          </li>
        </ul>

        <h3>1.2 Como as assinaturas e parcelamentos funcionam de verdade</h3>
        <p>
          Uma &quot;assinatura&quot; ou um &quot;parcelamento&quot; registrado
          no Dindin <strong>não é uma cobrança real</strong>: é um lembrete que
          o app converte em um gasto anotado. Além disso, essa conversão
          acontece <strong>somente quando você abre o aplicativo</strong> — não
          existe processo rodando em servidor enquanto o app está fechado. Se
          você ficar meses sem abrir, os lançamentos aparecem de uma vez no
          próximo acesso, e não nas datas exatas de vencimento. Se um lançamento
          não couber no saldo disponível, ele fica pendente e é tentado de novo
          no próximo acesso.
        </p>

        <h2>2. Conta, elegibilidade e responsabilidade pelo acesso</h2>
        <ul>
          <li>
            O uso do Dindin exige a criação de uma conta, com e-mail e senha ou
            com uma conta Google.
          </li>
          <li>
            O cadastro é <strong>restrito a maiores de 18 anos</strong>. Ao
            criar a conta, você declara ter 18 anos ou mais. Veja a seção 9 da
            Política de Privacidade sobre dados de crianças e adolescentes.
          </li>
          <li>
            A conta é <strong>pessoal e individual</strong>. Você é responsável
            por manter a sua senha em sigilo e por tudo que for feito na sua
            conta.
          </li>
          <li>
            Você é responsável pela <strong>exatidão do que digita</strong>. O
            Dindin não valida, não confere e não corrige os seus lançamentos
            contra nenhuma fonte externa.
          </li>
          <li>
            Se suspeitar de acesso indevido à sua conta, avise imediatamente
            pelo canal da seção 11.
          </li>
        </ul>

        <h2>3. Preço</h2>
        <p>
          O Dindin é oferecido <strong>gratuitamente</strong> nesta versão. Não
          há assinatura, compra dentro do aplicativo, anúncio ou cobrança de
          qualquer natureza.
        </p>
        <p>
          Se algum dia existir uma funcionalidade paga, ela será apresentada com
          preço e condições próprios, e o uso gratuito atual não será convertido
          em pago sem aviso e sem a sua aceitação expressa.
        </p>

        <h2>4. Uso proibido</h2>
        <p>É vedado a qualquer pessoa:</p>
        <ul>
          <li>
            Tentar acessar a conta ou os dados de outra pessoa, por qualquer
            meio;
          </li>
          <li>
            Contornar, testar ou explorar as regras de segurança do serviço sem
            autorização escrita;
          </li>
          <li>
            Automatizar criação de contas, gerar tráfego artificial ou qualquer
            conduta que sobrecarregue a infraestrutura (o serviço opera em plano
            gratuito com cotas limitadas — abuso derruba o app para todo mundo);
          </li>
          <li>Copiar, raspar, extrair em massa ou revender dados do serviço;</li>
          <li>
            Usar o Dindin para atividade ilícita, inclusive lavagem de dinheiro,
            fraude ou registro de operação ilegal;
          </li>
          <li>
            Fazer engenharia reversa do serviço ou interferir no seu
            funcionamento.
          </li>
        </ul>
        <p>
          O descumprimento pode levar à suspensão ou ao encerramento imediato da
          conta, sem prejuízo das responsabilidades civil e criminal cabíveis.
        </p>

        <h2>5. Disponibilidade</h2>
        <p>
          O Dindin é oferecido{" "}
          <strong>&quot;no estado em que se encontra&quot;</strong>,
          gratuitamente, em fase inicial de uso. Não há garantia de
          disponibilidade ininterrupta, e pode haver interrupções para
          manutenção, falhas de infraestrutura de terceiros (Google Firebase,
          Vercel, provedores de internet) ou correções.
        </p>
        <p>
          <strong>Faça as suas próprias cópias.</strong> O aplicativo oferece
          exportação completa dos seus dados em Ajustes → Exportar JSON.
          Recomendamos exportar periodicamente: essa é a única cópia dos seus
          dados que fica sob o seu controle.
        </p>
        <p>
          A Café Labs pode alterar, suspender ou descontinuar o serviço. Em caso
          de descontinuação definitiva, você será avisado por e-mail com
          antecedência mínima de <strong>60 dias</strong>, para exportar os seus
          dados antes da eliminação.
        </p>

        <h2>6. Responsabilidade</h2>
        <ul>
          <li>
            <strong>Pelo conteúdo dos lançamentos</strong> — o que você anota, a
            exatidão dos valores e qualquer decisão que você tome a partir deles
            — responde <strong>você</strong>. A Café Labs não interfere, não
            valida e não revisa o conteúdo dos seus lançamentos.
          </li>
          <li>
            <strong>Pelo funcionamento e pela segurança técnica do serviço</strong>{" "}
            responde a <strong>Café Labs</strong>, nos limites da lei aplicável.
          </li>
          <li>
            A Café Labs{" "}
            <strong>
              não responde por prejuízo financeiro decorrente de decisão tomada
              com base nos números exibidos
            </strong>
            , inclusive quando o número estiver errado por erro de digitação,
            por lançamento pendente ainda não processado ou por divergência em
            relação ao seu banco.
          </li>
          <li>
            A Café Labs não responde por: perda de dados causada por exclusão
            feita por você (inclusive pela importação de um backup, que
            substitui os dados atuais); compartilhamento voluntário da sua
            senha; uso de aparelho comprometido; indisponibilidade de serviços
            de terceiros.
          </li>
          <li>
            Nada nestes Termos limita direitos que a legislação brasileira,
            inclusive o Código de Defesa do Consumidor e a LGPD, assegure de
            forma inafastável.
          </li>
        </ul>

        <h2>7. Propriedade</h2>
        <p>
          O software, o nome, a marca e a interface do Dindin pertencem à Café
          Labs.
        </p>
        <p>
          <strong>
            Os seus dados financeiros não pertencem à Café Labs
          </strong>{" "}
          — eles são seus. A Café Labs os trata apenas para operar o serviço,
          conforme a Política de Privacidade, e não os utiliza para nenhuma
          finalidade própria.
        </p>

        <h2>8. Encerramento e exclusão da conta</h2>
        <ul>
          <li>
            Você pode encerrar a sua conta a qualquer momento, sem justificar,
            pelo aplicativo (Ajustes → Excluir conta) ou pela página pública{" "}
            <Link href="/excluir-conta">
              https://dindin.cafelabs.net/excluir-conta
            </Link>
            .
          </li>
          <li>
            A exclusão apaga a sua conta de login e <strong>todos</strong> os
            seus dados, e é <strong>definitiva e irreversível</strong>. Exporte
            o seu JSON antes.
          </li>
          <li>
            A Café Labs pode encerrar a sua conta em caso de violação da seção
            4, comunicando o motivo por e-mail, salvo quando a comunicação
            prejudicar investigação de fraude ou determinação legal.
          </li>
        </ul>

        <h2>9. Privacidade</h2>
        <p>
          O tratamento de dados pessoais é regido pela{" "}
          <strong>Política de Privacidade</strong>, disponível em{" "}
          <Link href="/privacidade">dindin.cafelabs.net/privacidade</Link> e
          dentro do aplicativo, que é parte integrante destes Termos.
        </p>

        <h2>10. Alterações destes Termos</h2>
        <p>
          Alterações relevantes serão publicadas com nova data de vigência e
          comunicadas dentro do aplicativo. Se você continuar usando o Dindin
          após a nova versão entrar em vigor, ela passa a valer para você; se
          não concordar, pode encerrar a conta conforme a seção 8. As versões
          anteriores permanecem arquivadas.
        </p>

        <h2>11. Lei aplicável, foro e contato</h2>
        <p>
          Aplica-se a lei brasileira. Fica eleito o foro do domicílio do
          consumidor para questões envolvendo pessoa consumidora, e o foro de
          Belo Horizonte/MG para as demais.
        </p>
        <p>
          Contato:{" "}
          <a href="mailto:contato@cafelabs.net">contato@cafelabs.net</a> (geral)
          e{" "}
          <a href="mailto:privacidade@cafelabs.net">privacidade@cafelabs.net</a>{" "}
          (privacidade e dados pessoais).
        </p>

        <UnresolvedPlaceholder variant="notice">
          <p>
            <strong>Aviso de elaboração:</strong> esta minuta foi redigida com
            apoio de IA a partir do escopo real do produto. Ela{" "}
            <strong>não substitui a revisão de advogado(a)</strong>. Cláusulas
            de limitação de responsabilidade em aplicativo financeiro e em
            relação de consumo são justamente as que mais dependem de revisão
            jurídica para efetivamente proteger — não presuma que este texto já
            protege. Em especial, precisam de olhar profissional: a seção 6
            (limitação de responsabilidade por decisão financeira), a seção 1.1
            (afirmação de não ser instituição financeira / não estar sujeito a
            regulação do Banco Central) e a seção 5 (ausência de garantia em
            relação de consumo).
          </p>
        </UnresolvedPlaceholder>
      </div>
    </LegalPageShell>
  );
}
