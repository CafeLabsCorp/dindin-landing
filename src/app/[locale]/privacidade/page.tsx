import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LegalPageShell } from "../legal/LegalPageShell";
import { DraftNotice, PtOnlyNotice, UnresolvedPlaceholder } from "../legal/Notices";
import { LEGAL_DOCS_APPROVED, LEGAL_DOCS_DATE, LEGAL_DOCS_VERSION } from "../legal/status";

// Content transcribed from dindin/legal/politica-de-privacidade.md (Versão 0.1
// — MINUTA de 27 de agosto de 2026). This is a Markdown → semantic HTML
// conversion only: no wording was added, removed or reworded, and the
// document's own `[CONFIRMAR: ...]` placeholders were NOT filled in — they are
// rendered through <UnresolvedPlaceholder>, which makes them visually
// impossible to mistake for finished text (see ../legal/Notices.tsx).
//
// Differences from the source file, all deliberate and none of them edits to
// the legal text:
//   - The first blockquote (internal publishing/versioning notes: "Publicação
//     prevista: ...", "Também deve ficar acessível de dentro do aplicativo")
//     is internal process, not part of the policy, and is left out.
//   - The second blockquote (the list of open `[CONFIRMAR]` items) IS kept,
//     at the top of the document, because it tells the reader the text is
//     incomplete.
//   - The closing "Aviso de elaboração" is kept verbatim — unlike Micare's, it
//     is still true here, and dropping it would be the one edit that makes the
//     page read as more finished than it is.
//   - Decorative warning emoji from the Markdown are dropped; the emphasis
//     they carried is preserved by the surrounding <strong>.
//
// The page is `noindex, nofollow` and carries a draft banner while
// LEGAL_DOCS_APPROVED is false. See ../legal/status.ts.
const BASE_URL = "https://dindin.cafelabs.net";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tLegal = await getTranslations({ locale, namespace: "Legal" });

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${BASE_URL}/${l}/privacidade`]),
  );

  return {
    title: tLegal("privacyTitle"),
    description: tLegal("privacyMetaDescription"),
    // Kept out of search results until a lawyer has signed off: an
    // unreviewed draft indexed as "the" privacy policy of a Play Store app
    // is exactly the state this must not ship in.
    robots: { index: LEGAL_DOCS_APPROVED, follow: LEGAL_DOCS_APPROVED },
    alternates: {
      canonical: `${BASE_URL}/${locale}/privacidade`,
      languages: {
        ...languages,
        "x-default": `${BASE_URL}/${routing.defaultLocale}/privacidade`,
      },
    },
    openGraph: {
      title: tLegal("privacyTitle"),
      description: tLegal("privacyMetaDescription"),
      url: `${BASE_URL}/${locale}/privacidade`,
      siteName: "Dindin",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: tLegal("privacyTitle"),
      description: tLegal("privacyMetaDescription"),
    },
  };
}

export default async function PrivacidadePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tLegal = await getTranslations({ locale, namespace: "Legal" });

  return (
    <LegalPageShell
      title={tLegal("privacyTitle")}
      subtitle={
        <>
          Versão {LEGAL_DOCS_VERSION} — MINUTA de {LEGAL_DOCS_DATE}
          <br />
          Status: não revisada por advogado(a).
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
        <UnresolvedPlaceholder>
          <p>
            <strong>Pendências de dado real neste documento</strong> (marcadas
            com <code>[CONFIRMAR]</code> ao longo do texto): região do Firestore
            do projeto <code>dindin-cafelabs</code>. Enquanto não forem
            preenchidas, o texto está incompleto e não pode ser publicado.
          </p>
        </UnresolvedPlaceholder>

        <h2>1. Em linguagem simples</h2>
        <p>
          O Dindin é um caderno digital de finanças pessoais. Você anota o que
          ganha, divide esse dinheiro em &quot;caixinhas&quot; e anota o que
          gasta. Os números que aparecem no app são os números que{" "}
          <strong>você digitou</strong>.
        </p>
        <p>
          O Dindin <strong>não se conecta ao seu banco</strong>,{" "}
          <strong>não movimenta dinheiro</strong>,{" "}
          <strong>não pede o número do seu cartão</strong> e{" "}
          <strong>não pede o seu CPF</strong>. Ele não sabe nada sobre a sua
          vida financeira além do que você mesmo escreveu nele.
        </p>
        <p>
          Para guardar essas anotações e sincronizá-las entre os seus aparelhos,
          o Dindin precisa de uma conta — e é por isso que ele pede o seu
          e-mail. Nada disso é vendido, usado para propaganda ou mostrado para
          outra pessoa.
        </p>
        <p>
          O resto deste documento explica isso em detalhe, porque a lei exige
          que a explicação seja completa.
        </p>

        <h2>2. Quem é responsável pelos seus dados</h2>
        <p>
          <strong>
            Controlador (quem decide quais dados existem e por quê):
          </strong>
          <br />
          Café Labs, operada por Felipe Portes Antunes (CPF 704.995.256-71) — a
          Café Labs ainda não possui CNPJ próprio.
        </p>
        <p>
          Diferentemente de outros produtos da Café Labs, aqui{" "}
          <strong>não existe um terceiro controlador</strong>: quem decide as
          finalidades do tratamento é a própria Café Labs, e é ela quem responde
          perante você e perante a ANPD.
        </p>
        <p>
          <strong>
            Operadores (quem processa dados por conta da Café Labs):
          </strong>
        </p>
        <ul>
          <li>
            <strong>
              Google LLC / Google Cloud (Firebase Authentication e Cloud
              Firestore)
            </strong>{" "}
            — hospeda a sua conta e as suas anotações financeiras.
          </li>
          <li>
            <strong>Vercel Inc.</strong> — hospeda apenas o site de apresentação{" "}
            <code>dindin.cafelabs.net</code>, que não recebe nenhum dado
            financeiro seu.
          </li>
        </ul>
        <p>
          <strong>Canal de contato sobre privacidade:</strong>
          <br />
          <a href="mailto:privacidade@cafelabs.net">privacidade@cafelabs.net</a>
        </p>
        <p>
          Esse é o canal para tirar dúvidas sobre esta política e para exercer
          os direitos descritos na seção 8. A Café Labs é hoje um agente de
          tratamento de pequeno porte e, nos termos da Resolução CD/ANPD nº
          2/2022, está dispensada da indicação formal de Encarregado(a) — mas
          mantém este canal de comunicação com você e com a ANPD, como a mesma
          norma exige. Se o volume ou a natureza do tratamento mudar, a
          indicação será feita e esta política será atualizada.
        </p>

        <h2>3. Quais dados são tratados</h2>

        <h3>3.1 Dados da sua conta</h3>
        <p>
          Criados quando você se cadastra, e tratados pelo Firebase
          Authentication:
        </p>
        <ul>
          <li>
            <strong>E-mail</strong> — usado como identificador de login.
          </li>
          <li>
            <strong>Senha</strong> — se você se cadastrou por e-mail e senha. A
            senha é armazenada pelo Google de forma cifrada e{" "}
            <strong>não é legível pela Café Labs</strong>.
          </li>
          <li>
            <strong>Nome e foto de perfil da conta Google</strong> — apenas se
            você entrar com &quot;Entrar com Google&quot;. Vêm da sua conta
            Google; o Dindin não pede esses dados a você e não os usa para nada
            além de identificar a sua sessão.
          </li>
          <li>
            <strong>Identificador interno da conta (UID)</strong> — um código
            gerado pelo Firebase, que é a chave sob a qual as suas anotações
            ficam guardadas.
          </li>
          <li>
            <strong>Datas de criação da conta e do último acesso</strong>,
            registradas pelo Firebase Authentication.
          </li>
        </ul>

        <h3>3.2 As suas anotações financeiras</h3>
        <p>
          Tudo abaixo é <strong>digitado por você</strong> — nada é importado de
          banco, cartão, fatura ou qualquer fonte externa:
        </p>
        <ul>
          <li>
            <strong>Caixinhas (envelopes)</strong>: nome que você deu, se é de
            gasto ou de reserva, limite mensal, meta de guardar, se pode ficar
            negativa, data de criação.
          </li>
          <li>
            <strong>Entradas (receitas)</strong>: valor, data, origem (texto
            livre — por exemplo &quot;salário&quot;) e descrição opcional.
          </li>
          <li>
            <strong>Alocações</strong>: quanto você moveu da conta para cada
            caixinha, e as transferências entre caixinhas.
          </li>
          <li>
            <strong>Gastos</strong>: valor, data, caixinha de origem (ou
            &quot;conta&quot;), descrição opcional e, quando o gasto foi gerado
            por uma assinatura ou parcelamento, a referência ao lançamento que o
            originou.
          </li>
          <li>
            <strong>Assinaturas</strong>: nome, valor, dia de vencimento,
            caixinha de origem.
          </li>
          <li>
            <strong>Parcelamentos</strong>: nome, valor total, número de
            parcelas, datas, quantas parcelas já foram lançadas e quanto foi
            adiantado.
          </li>
          <li>
            <strong>Saldos calculados</strong>: saldo da conta e saldo de cada
            caixinha, derivados automaticamente dos lançamentos acima.
          </li>
        </ul>
        <p>
          <strong>Atenção aos campos de texto livre.</strong> Os campos
          &quot;origem&quot;, &quot;descrição&quot; e o nome das
          caixinhas/assinaturas aceitam qualquer texto. Se você escrever ali
          informações pessoais (nome de pessoas, endereço, dado de saúde, etc.),
          elas passam a ser tratadas junto com o resto.{" "}
          <strong>
            Recomendamos não escrever nesses campos nada além do necessário para
            você se organizar.
          </strong>
        </p>
        <p>
          Sob a LGPD, dados financeiros <strong>não</strong> são classificados
          como &quot;dados pessoais sensíveis&quot; (art. 5º, II), mas são
          tratados aqui com o mesmo cuidado, porque revelam hábitos e situação
          de vida.
        </p>

        <h3>3.3 Dados técnicos</h3>
        <ul>
          <li>
            <strong>Sessão de login</strong>: no aplicativo web, a sessão é
            guardada no seu próprio navegador (armazenamento local do Firebase
            Authentication) para que você não precise entrar de novo a cada
            visita. Não é um cookie de publicidade e não acompanha você em
            outros sites.
          </li>
          <li>
            <strong>Registros técnicos do Google</strong>: ao usar o app, o seu
            endereço IP e dados básicos da requisição chegam à infraestrutura do
            Google Firebase, que os registra para operação e segurança do
            serviço, sob a política de privacidade do próprio Google.
          </li>
        </ul>

        <h3>3.4 O que NÃO é coletado</h3>
        <p>
          Por decisão de projeto, o Dindin <strong>não</strong> coleta e{" "}
          <strong>não</strong> pede:
        </p>
        <ul>
          <li>CPF, RG ou qualquer documento de identidade</li>
          <li>
            Número de cartão, conta bancária, chave Pix ou qualquer dado de
            pagamento
          </li>
          <li>
            Conexão com banco, Open Finance, importação de fatura ou extrato
          </li>
          <li>Localização/GPS, contatos da agenda, fotos, câmera, microfone</li>
          <li>Dados de saúde ou qualquer outro dado pessoal sensível</li>
        </ul>
        <p>
          O aplicativo{" "}
          <strong>
            não contém SDK de analytics, de publicidade ou de rastreamento de
            terceiros
          </strong>
          , não exibe anúncios e não compartilha dados com redes de anúncios.
          Isso é verificável: as dependências do app estão públicas em{" "}
          <code>pubspec.yaml</code>, no repositório do projeto.
        </p>

        <h3>
          3.5 Site de apresentação (<code>dindin.cafelabs.net</code>)
        </h3>
        <p>
          O site de apresentação é apenas informativo — <strong>não</strong> dá
          acesso a nenhuma anotação financeira e não tem formulário, cadastro ou
          login. Ele usa uma medição de audiência agregada (Vercel Web
          Analytics), que <strong>não utiliza cookies</strong>, não cria
          identificador persistente e não permite identificar quem visitou. São
          registrados apenas dados agregados como página visitada, país/região
          aproximados, tipo de aparelho e navegador. Como não há cookie nem
          identificação individual, não é exibido banner de cookies.
        </p>

        <h2>4. Para que os dados são usados</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Finalidade</th>
              <th scope="col">Dados envolvidos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Criar e manter a sua conta, e reconhecer você no login</td>
              <td>e-mail, senha, dados da conta Google (se usada), UID</td>
            </tr>
            <tr>
              <td>
                Guardar as suas anotações e sincronizá-las entre os seus
                aparelhos
              </td>
              <td>todas as anotações financeiras da seção 3.2</td>
            </tr>
            <tr>
              <td>
                Calcular saldos, resumos mensais e lançar
                assinaturas/parcelamentos vencidos
              </td>
              <td>todas as anotações financeiras</td>
            </tr>
            <tr>
              <td>Impedir que uma pessoa acesse os dados de outra</td>
              <td>UID, regras de segurança do Firestore</td>
            </tr>
            <tr>
              <td>
                Manter o serviço funcionando (corrigir falhas, operar a
                infraestrutura)
              </td>
              <td>dados técnicos, com acesso restrito</td>
            </tr>
            <tr>
              <td>
                Responder a você quando pedir suporte ou exercer um direito
              </td>
              <td>e-mail</td>
            </tr>
            <tr>
              <td>Medir audiência do site de apresentação, de forma agregada</td>
              <td>dados agregados da seção 3.5</td>
            </tr>
          </tbody>
        </table>
        <p>
          Os dados <strong>não</strong> são usados para: propaganda, marketing,
          venda, perfilamento, análise de crédito, score, ou compartilhamento
          com bancos, seguradoras, empregadores, lojas ou qualquer terceiro
          comercial.
        </p>
        <p>
          <strong>O Dindin não envia mensagens promocionais.</strong> Hoje o
          único e-mail que você pode receber é transacional (por exemplo, uma
          confirmação ou uma resposta a um pedido seu). Se um dia a Café Labs
          quiser enviar novidades ou qualquer comunicação promocional, isso
          exigirá um{" "}
          <strong>consentimento separado e específico</strong>, pedido em uma
          caixa própria (nunca embutido na aceitação dos Termos), que você
          poderá recusar ou retirar a qualquer momento{" "}
          <strong>sem perder o acesso ao aplicativo</strong>.
        </p>

        <h2>5. Base legal de cada tratamento</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Tratamento</th>
              <th scope="col">Base legal (Lei 13.709/2018 — LGPD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Conta (e-mail, senha, dados da conta Google, UID)</td>
              <td>
                art. 7º, V — execução de contrato do qual você é parte (os
                Termos de Uso)
              </td>
            </tr>
            <tr>
              <td>Anotações financeiras (seção 3.2)</td>
              <td>
                art. 7º, V — execução de contrato: sem elas o aplicativo não tem
                função
              </td>
            </tr>
            <tr>
              <td>
                Isolamento entre contas e proteção contra acesso indevido
              </td>
              <td>
                art. 7º, V, e art. 7º, IX — legítimo interesse na segurança do
                próprio serviço
              </td>
            </tr>
            <tr>
              <td>Registros técnicos de operação (IP, logs do Firebase)</td>
              <td>art. 7º, IX — legítimo interesse na operação e segurança</td>
            </tr>
            <tr>
              <td>Atendimento a pedidos de titular</td>
              <td>art. 7º, II — cumprimento de obrigação legal</td>
            </tr>
            <tr>
              <td>Medição agregada do site de apresentação</td>
              <td>
                art. 7º, IX — legítimo interesse, sem identificação individual
              </td>
            </tr>
            <tr>
              <td>Comunicação promocional (não existe hoje)</td>
              <td>
                art. 7º, I — consentimento específico e destacado, se um dia
                existir
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Nenhum tratamento do Dindin depende de você consentir com propaganda:
          recusar comunicação promocional <strong>não</strong> limita nada no
          aplicativo.
        </p>

        <h2>6. Onde os dados ficam e transferência internacional</h2>
        <p>
          A sua conta e as suas anotações ficam armazenadas no{" "}
          <strong>
            Google Firebase (Firebase Authentication e Cloud Firestore)
          </strong>
          , no projeto <code>dindin-cafelabs</code>.
        </p>

        <UnresolvedPlaceholder>
          <p>
            <code>
              [CONFIRMAR: região do banco de dados Firestore do projeto
              dindin-cafelabs]
            </code>
          </p>
          <p>
            Enquanto a região não for confirmada, as duas hipóteses abaixo
            permanecem no texto — o documento{" "}
            <strong>ainda não afirma</strong> se há ou não transferência
            internacional das suas anotações financeiras.
          </p>
        </UnresolvedPlaceholder>

        <ul>
          <li>
            <strong>
              Se a região for <code>southamerica-east1</code> (São Paulo,
              Brasil):
            </strong>{" "}
            as suas anotações financeiras ficam armazenadas em território
            nacional. O Google, como operador, pode acessá-las a partir de
            outros países exclusivamente para suporte técnico e operação da
            infraestrutura, sob os compromissos contratuais de proteção de dados
            do Google Cloud — hipótese do art. 33, II, da LGPD (cláusulas
            contratuais).
          </li>
          <li>
            <strong>
              Se a região for qualquer outra (por exemplo <code>nam5</code>,
              Estados Unidos):
            </strong>{" "}
            há <strong>transferência internacional de dados</strong>. Nesse
            caso, as suas anotações financeiras são armazenadas fora do Brasil,
            em infraestrutura do Google, e a transferência se apoia no art. 33,
            II, da LGPD (cláusulas contratuais padrão firmadas com o Google
            Cloud/Firebase), com as garantias do &quot;Cloud Data Processing
            Addendum&quot; do Google.
          </li>
        </ul>
        <p>
          O Firebase Authentication opera em infraestrutura global do Google,
          independentemente da região escolhida para o Firestore — ou seja,{" "}
          <strong>
            os dados da sua conta (e-mail e credencial) trafegam e podem ser
            armazenados fora do Brasil
          </strong>{" "}
          em qualquer cenário, sob a mesma hipótese do art. 33, II.
        </p>
        <p>
          O site de apresentação é hospedado na Vercel, com servidores fora do
          Brasil, mas o site{" "}
          <strong>não recebe nenhum dado financeiro nem dado de conta</strong>;
          a única informação que sai do país por ali é a medição agregada e não
          identificável descrita no item 3.5.
        </p>

        <h2>7. Por quanto tempo os dados ficam guardados</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Dado</th>
              <th scope="col">Prazo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Conta e anotações financeiras</td>
              <td>
                enquanto a sua conta existir — você decide, não há expiração
                automática
              </td>
            </tr>
            <tr>
              <td>Conta inativa</td>
              <td>
                não há exclusão automática por inatividade hoje; se isso mudar,
                você será avisado por e-mail com antecedência mínima de 30 dias
                antes de qualquer eliminação
              </td>
            </tr>
            <tr>
              <td>Após pedido de exclusão da conta</td>
              <td>
                eliminação conforme a seção 8, item &quot;Exclusão&quot;
              </td>
            </tr>
            <tr>
              <td>Cópias de segurança da infraestrutura</td>
              <td>
                ciclo de até <strong>30 dias</strong> do provedor; dados
                excluídos desaparecem das cópias ao fim do ciclo
              </td>
            </tr>
            <tr>
              <td>
                Registro de que a exclusão foi feita (sem os seus dados
                pessoais)
              </td>
              <td>5 anos, apenas para comprovar o cumprimento da lei</td>
            </tr>
            <tr>
              <td>Registros técnicos de operação/segurança</td>
              <td>conforme a retenção do provedor (Google Firebase)</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>
            O Dindin não é obrigado a guardar as suas anotações financeiras por
            prazo legal nenhum.
          </strong>{" "}
          Ele não é instituição financeira, não emite documento fiscal e não
          registra operação regulada — por isso pode atender integralmente a um
          pedido de exclusão, sem exceções de &quot;obrigação de guarda&quot;.
        </p>

        <h2>8. Seus direitos e como exercê-los</h2>
        <p>Pela LGPD (art. 18), você pode a qualquer momento:</p>
        <ul>
          <li>
            <strong>Saber</strong> se existem dados seus e quais são
          </li>
          <li>
            <strong>Acessar</strong> os seus dados — o próprio aplicativo já é
            esse acesso: tudo que o Dindin guarda sobre você está visível nas
            telas do app
          </li>
          <li>
            <strong>Corrigir</strong> dados incompletos, errados ou
            desatualizados — você mesmo edita qualquer lançamento dentro do app
          </li>
          <li>
            <strong>Pedir a exclusão</strong> da sua conta e de todos os seus
            dados
          </li>
          <li>
            <strong>Pedir a portabilidade</strong> — Ajustes →{" "}
            <strong>Exportar JSON</strong> gera, na hora, um arquivo com todas
            as suas anotações em formato aberto e legível, que você pode guardar
            ou levar para outro serviço
          </li>
          <li>
            <strong>Saber com quem</strong> os seus dados são compartilhados
            (seção 2)
          </li>
          <li>
            <strong>Revogar</strong> qualquer consentimento que você tenha dado
            separadamente
          </li>
          <li>
            <strong>Se opor</strong> a um tratamento que você considere
            irregular
          </li>
          <li>
            <strong>Reclamar</strong> à ANPD (Autoridade Nacional de Proteção de
            Dados)
          </li>
        </ul>
        <p>
          <strong>Como pedir:</strong> escreva para{" "}
          <a href="mailto:privacidade@cafelabs.net">privacidade@cafelabs.net</a>
          . A resposta é dada em até <strong>15 dias</strong>.
        </p>

        <h3>Exclusão da conta — o que acontece na prática</h3>

        <UnresolvedPlaceholder>
          <p>
            <code>
              [CONFIRMAR: o procedimento abaixo descreve o comportamento
              pretendido do fluxo de exclusão; ele ainda NÃO está implementado
              no aplicativo. Ver seção &quot;Requisitos de implementação&quot; do
              relatório de compliance.]
            </code>
          </p>
        </UnresolvedPlaceholder>

        <ol>
          <li>
            Você pede a exclusão de dentro do aplicativo (Ajustes → Excluir
            conta) ou pela página pública{" "}
            <a href="https://dindin.cafelabs.net/excluir-conta">
              https://dindin.cafelabs.net/excluir-conta
            </a>
            .
          </li>
          <li>
            Antes de confirmar, o aplicativo oferece a exportação do seu JSON —
            depois da exclusão não é possível recuperar nada.
          </li>
          <li>
            São eliminados: a sua conta de login (Firebase Authentication) e{" "}
            <strong>todo</strong> o conteúdo de <code>users/{"{seu-id}"}</code>{" "}
            — caixinhas, entradas, alocações, gastos, assinaturas, parcelamentos
            e saldos.
          </li>
          <li>
            Cópias de segurança já feitas expiram no ciclo de até 30 dias e não
            são restauradas.
          </li>
          <li>
            Fica guardado apenas um registro de que a exclusão ocorreu,{" "}
            <strong>sem os seus dados pessoais</strong>, para provar que a lei
            foi cumprida.
          </li>
        </ol>
        <p>
          A exclusão é <strong>definitiva e não reversível</strong>. Não existe
          &quot;conta desativada&quot; que possa ser recuperada depois.
        </p>

        <h2>9. Crianças e adolescentes</h2>
        <p>
          O Dindin <strong>não é destinado a menores de 18 anos</strong> e a
          Café Labs não direciona o produto a crianças ou adolescentes — não há
          conteúdo, linguagem ou divulgação voltados a esse público.
        </p>
        <p>Mesmo assim, o aplicativo reconhece que um adolescente pode tentar usá-lo:</p>
        <ul>
          <li>
            <strong>Menores de 12 anos (crianças):</strong> o tratamento de
            dados de criança exige consentimento específico e em destaque de
            pelo menos um dos pais ou do responsável legal (art. 14, §1º, da
            LGPD). O Dindin <strong>não coleta esse consentimento</strong> e,
            portanto, <strong>não deve ser usado por crianças</strong>. Se
            tomarmos conhecimento de que uma conta pertence a uma criança, ela
            será excluída e os dados eliminados.
          </li>
          <li>
            <strong>Entre 12 e 17 anos (adolescentes):</strong> o tratamento, se
            ocorrer, é feito no melhor interesse do adolescente (art. 14,
            caput). Ainda assim, os Termos de Uso restringem o cadastro a
            maiores de 18 anos, e pai, mãe ou responsável pode pedir a exclusão
            da conta pelo canal da seção 8.
          </li>
        </ul>
        <p>
          Em nenhuma hipótese dados de crianças ou adolescentes são usados para
          publicidade ou repassados a terceiros.
        </p>

        <h2>10. Segurança</h2>
        <ul>
          <li>Todo o tráfego é criptografado em trânsito (HTTPS/TLS).</li>
          <li>
            Os dados em repouso são criptografados pela infraestrutura do Google
            Firebase.
          </li>
          <li>
            O isolamento entre contas é imposto pelo servidor, por meio das{" "}
            <em>Security Rules</em> do Firestore: cada conta só alcança o
            próprio caminho de dados, nunca o de outra pessoa. Essa regra é
            testada automaticamente a cada alteração do código.
          </li>
          <li>
            A senha de e-mail/senha é armazenada e verificada pelo Google, em
            formato cifrado, e não é legível pela Café Labs.
          </li>
          <li>O acesso administrativo à infraestrutura é individual e restrito.</li>
        </ul>
        <p>
          Nenhum sistema é 100% seguro. Se ocorrer um incidente de segurança que
          possa gerar risco ou dano relevante a você, a Café Labs comunicará a{" "}
          <strong>ANPD</strong> e <strong>você</strong> nos termos do art. 48 da
          LGPD, dentro do prazo fixado pela regulamentação da ANPD (hoje,{" "}
          <strong>3 dias úteis</strong> contados do conhecimento do incidente),
          informando o que aconteceu, quais dados foram afetados, quais riscos
          isso gera e o que está sendo feito. O procedimento interno de resposta
          a incidente está descrito em <code>docs/</code> no repositório do
          projeto.
        </p>
        <p>
          <strong>Proteja a sua senha.</strong> A Café Labs nunca vai pedir a
          sua senha por e-mail, mensagem ou telefone.
        </p>

        <h2>11. Alterações desta política</h2>
        <p>
          Se esta política mudar de forma relevante, a nova versão será
          publicada em <code>dindin.cafelabs.net/privacidade</code> com a data
          de vigência, e você será avisado dentro do aplicativo antes de
          continuar usando. As versões anteriores permanecem arquivadas.
        </p>

        <h2>12. Contato</h2>
        <p>
          Café Labs — Felipe Portes Antunes (CPF 704.995.256-71)
          <br />
          E-mail:{" "}
          <a href="mailto:privacidade@cafelabs.net">privacidade@cafelabs.net</a>
        </p>
        <p>
          Autoridade Nacional de Proteção de Dados (ANPD):{" "}
          <a
            href="https://www.gov.br/anpd"
            target="_blank"
            rel="noopener noreferrer"
          >
            gov.br/anpd
          </a>
        </p>

        <UnresolvedPlaceholder variant="notice">
          <p>
            <strong>Aviso de elaboração:</strong> esta minuta foi redigida com
            apoio de IA a partir do inventário real de dados do produto (esquema
            do Firestore, serviços de autenticação e dependências efetivamente
            usadas). Ela <strong>não substitui a revisão de advogado(a)</strong>{" "}
            e não deve ser publicada, vinculada no Google Play nem apresentada a
            usuário antes dessa revisão. Diferentemente do Micare, o texto do
            Dindin <strong>ainda não passou por advogado(a)</strong>.
          </p>
        </UnresolvedPlaceholder>
      </div>
    </LegalPageShell>
  );
}
