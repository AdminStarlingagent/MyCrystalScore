/* =====================================================================
   MyCrystalScore — statutory texts for the client agreement
   English text is VERBATIM from the statutes (do not edit):
     - 15 U.S.C. §1679c (federal disclosure statement)
     - 15 U.S.C. §1679d(b)(4) and §1679e(b) (federal cancellation)
     - Tex. Fin. Code §393.202 (Texas cancellation)
   Spanish versions are courtesy translations.
   ===================================================================== */
(function () {
  'use strict';
  var D = window.MCSDocs = window.MCSDocs || {};

  /* ---------- Document 1: federal statement (must be a separate document) ---------- */
  D.federal = function (lang) {
    var en =
      '<div lang="en" class="keep-lang statute">' +
      '<h3 class="doc-title">Consumer Credit File Rights Under State and Federal Law</h3>' +
      '<p>You have a right to dispute inaccurate information in your credit report by contacting the credit bureau directly. However, neither you nor any "credit repair" company or credit repair organization has the right to have accurate, current, and verifiable information removed from your credit report. The credit bureau must remove accurate, negative information from your report only if it is over 7 years old. Bankruptcy information can be reported for 10 years.</p>' +
      '<p>You have a right to obtain a copy of your credit report from a credit bureau. You may be charged a reasonable fee. There is no fee, however, if you have been turned down for credit, employment, insurance, or a rental dwelling because of information in your credit report within the preceding 60 days. The credit bureau must provide someone to help you interpret the information in your credit file. You are entitled to receive a free copy of your credit report if you are unemployed and intend to apply for employment in the next 60 days, if you are a recipient of public welfare assistance, or if you have reason to believe that there is inaccurate information in your credit report due to fraud.</p>' +
      '<p>You have a right to sue a credit repair organization that violates the Credit Repair Organization Act. This law prohibits deceptive practices by credit repair organizations.</p>' +
      '<p>You have the right to cancel your contract with any credit repair organization for any reason within 3 business days from the date you signed it.</p>' +
      '<p>Credit bureaus are required to follow reasonable procedures to ensure that the information they report is accurate. However, mistakes may occur.</p>' +
      '<p>You may, on your own, notify a credit bureau in writing that you dispute the accuracy of information in your credit file. The credit bureau must then reinvestigate and modify or remove inaccurate or incomplete information. The credit bureau may not charge any fee for this service. Any pertinent information and copies of all documents you have concerning an error should be given to the credit bureau.</p>' +
      '<p>If the credit bureau\'s reinvestigation does not resolve the dispute to your satisfaction, you may send a brief statement to the credit bureau, to be kept in your file, explaining why you think the record is inaccurate. The credit bureau must include a summary of your statement about disputed information with any report it issues about you.</p>' +
      '<p>The Federal Trade Commission regulates credit bureaus and credit repair organizations. For more information contact:</p>' +
      '<p><strong>The Public Reference Branch<br>Federal Trade Commission<br>Washington, D.C. 20580</strong></p>' +
      '</div>';

    if (lang === 'en') return en;

    return en +
      '<div lang="es" class="keep-lang translation">' +
      '<h3 class="doc-title">Traducción al español: Derechos sobre su archivo de crédito según las leyes estatales y federales</h3>' +
      '<p class="note">El texto oficial en inglés aparece arriba.</p>' +
      '<p>Usted tiene derecho a disputar información inexacta en su reporte de crédito comunicándose directamente con el buró de crédito. Sin embargo, ni usted ni ninguna compañía de "reparación de crédito" u organización de reparación de crédito tiene derecho a que se elimine de su reporte información exacta, actual y verificable. El buró de crédito debe eliminar de su reporte información negativa exacta solo si tiene más de 7 años. La información de bancarrota puede reportarse durante 10 años.</p>' +
      '<p>Usted tiene derecho a obtener una copia de su reporte de crédito de un buró de crédito. Es posible que se le cobre una tarifa razonable. Sin embargo, no hay cargo si en los últimos 60 días se le negó crédito, empleo, seguro o una vivienda de alquiler debido a información en su reporte de crédito. El buró de crédito debe proporcionarle a alguien que le ayude a interpretar la información de su archivo de crédito. Usted tiene derecho a recibir una copia gratuita de su reporte de crédito si está desempleado y piensa solicitar empleo en los próximos 60 días, si recibe asistencia pública, o si tiene razones para creer que hay información inexacta en su reporte debido a un fraude.</p>' +
      '<p>Usted tiene derecho a demandar a una organización de reparación de crédito que viole la Ley de Organizaciones de Reparación de Crédito. Esta ley prohíbe las prácticas engañosas de las organizaciones de reparación de crédito.</p>' +
      '<p>Usted tiene derecho a cancelar su contrato con cualquier organización de reparación de crédito, por cualquier motivo, dentro de los 3 días hábiles a partir de la fecha en que lo firmó.</p>' +
      '<p>Los burós de crédito deben seguir procedimientos razonables para asegurar que la información que reportan sea exacta. Sin embargo, pueden ocurrir errores.</p>' +
      '<p>Usted puede, por su cuenta, notificar por escrito a un buró de crédito que disputa la exactitud de información en su archivo de crédito. El buró debe entonces volver a investigar y modificar o eliminar la información inexacta o incompleta. El buró no puede cobrarle por este servicio. Debe entregarle al buró toda la información pertinente y copias de todos los documentos que tenga sobre el error.</p>' +
      '<p>Si la nueva investigación del buró no resuelve la disputa a su satisfacción, usted puede enviarle una breve declaración, que se guardará en su archivo, explicando por qué cree que el registro es inexacto. El buró debe incluir un resumen de su declaración sobre la información disputada en cualquier reporte que emita sobre usted.</p>' +
      '<p>La Comisión Federal de Comercio (FTC) regula a los burós de crédito y a las organizaciones de reparación de crédito. Para más información, comuníquese con: The Public Reference Branch, Federal Trade Commission, Washington, D.C. 20580.</p>' +
      '</div>';
  };

  /* ---------- Cancellation statements shown right next to the signature ---------- */
  D.cancelStatements = function (lang) {
    var html =
      '<div class="statutory keep-lang" lang="en">' +
      '<p>You may cancel this contract without penalty or obligation at any time before midnight of the 3rd business day after the date on which you signed the contract. See the attached notice of cancellation form for an explanation of this right.</p>' +
      '<p>YOU, THE BUYER, MAY CANCEL THIS CONTRACT AT ANY TIME BEFORE MIDNIGHT OF THE THIRD DAY AFTER THE DATE OF THE TRANSACTION. SEE THE ATTACHED NOTICE OF CANCELLATION FORM FOR AN EXPLANATION OF THIS RIGHT.</p>' +
      '</div>';
    if (lang !== 'en') {
      html +=
        '<div class="statutory statutory-es keep-lang" lang="es">' +
        '<p>Usted puede cancelar este contrato sin penalidad ni obligación en cualquier momento antes de la medianoche del 3er día hábil después de la fecha en que firmó el contrato. Vea el formulario de aviso de cancelación adjunto para una explicación de este derecho.</p>' +
        '<p>USTED, EL COMPRADOR, PUEDE CANCELAR ESTE CONTRATO EN CUALQUIER MOMENTO ANTES DE LA MEDIANOCHE DEL TERCER DÍA DESPUÉS DE LA FECHA DE LA TRANSACCIÓN. VEA EL FORMULARIO DE AVISO DE CANCELACIÓN ADJUNTO PARA UNA EXPLICACIÓN DE ESTE DERECHO.</p>' +
        '</div>';
    }
    return html;
  };

  /* ---------- Notice of Cancellation forms (federal + Texas) ---------- */
  function federalForm(ctx) {
    return '<div class="notice-form keep-lang" lang="en">' +
      '<h4>Notice of Cancellation</h4>' +
      '<p>You may cancel this contract, without any penalty or obligation, at any time before midnight of the 3rd day which begins after the date the contract is signed by you.</p>' +
      '<p>To cancel this contract, mail or deliver a signed, dated copy of this cancellation notice, or any other written notice to ' + ctx.entity + ' at ' + ctx.address + ' before midnight on ' + ctx.deadlineEn + '</p>' +
      '<p>I hereby cancel this transaction,</p>' +
      '<p class="blank">______________________ [date]</p>' +
      '<p class="blank">______________________ [purchaser\'s signature]</p>' +
      '<p class="form-src">15 U.S.C. §1679e</p>' +
      '</div>';
  }
  function texasForm(ctx) {
    return '<div class="notice-form keep-lang" lang="en">' +
      '<h4>Notice of Cancellation</h4>' +
      '<p>You may cancel this contract, without any penalty or obligation, within three days after the date the contract is signed.</p>' +
      '<p>If you cancel, any payment made by you under this contract will be returned within 10 days after the date of receipt by the seller of your cancellation notice.</p>' +
      '<p>To cancel this contract, mail or deliver a signed dated copy of this cancellation notice, or other written notice, to:</p>' +
      '<p>' + ctx.entity + ' at ' + ctx.address + ' not later than midnight ' + ctx.deadlineEn + '</p>' +
      '<p>I hereby cancel this transaction.</p>' +
      '<p class="blank">______________________ (date)</p>' +
      '<p class="blank">______________________ (purchaser\'s signature)</p>' +
      '<p class="form-src">Tex. Fin. Code §393.202</p>' +
      '</div>';
  }
  function formsEs(ctx) {
    return '<div class="translation keep-lang" lang="es">' +
      '<h4>Traducción al español: Aviso de cancelación</h4>' +
      '<p>Usted puede cancelar este contrato, sin penalidad ni obligación, en cualquier momento antes de la medianoche del 3er día que comienza después de la fecha en que usted firmó el contrato (ley federal), o dentro de los tres días después de la fecha en que se firmó el contrato (ley de Texas). Si cancela, cualquier pago que haya hecho bajo este contrato se le devolverá dentro de los 10 días después de que recibamos su aviso de cancelación.</p>' +
      '<p>Para cancelar, envíe por correo o entregue una copia firmada y fechada de este aviso de cancelación, o cualquier otro aviso por escrito, a ' + ctx.entity + ' en ' + ctx.address + ' antes de la medianoche del ' + ctx.deadline + '.</p>' +
      '<p>"Por la presente cancelo esta transacción." (fecha) (firma del comprador)</p>' +
      '</div>';
  }

  // copies = 2 for the printable/downloadable package (statutes require duplicate forms)
  D.notices = function (lang, ctx, copies) {
    copies = copies || 1;
    var out = '';
    for (var i = 0; i < copies; i++) {
      var label = copies > 1 ? (lang === 'en' ? ' (copy ' + (i + 1) + ' of ' + copies + ')' : ' (copia ' + (i + 1) + ' de ' + copies + ')') : '';
      out += '<div class="notice-set">' +
        '<p class="cut">' + (lang === 'en' ? 'Federal form' : 'Formulario federal') + label + '</p>' + federalForm(ctx) +
        '<p class="cut">' + (lang === 'en' ? 'Texas form' : 'Formulario de Texas') + label + '</p>' + texasForm(ctx) +
        '</div>';
    }
    if (lang !== 'en') out += formsEs(ctx);
    if (ctx.extraCancel) out += '<p class="also-cancel">' + ctx.extraCancel + '</p>';
    return out;
  };
})();
