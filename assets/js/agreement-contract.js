/* =====================================================================
   MyCrystalScore — Texas disclosure statement, e-sign consent, contract
   Draft for attorney review. ctx values arrive already HTML-escaped.
   ===================================================================== */
(function () {
  'use strict';
  var D = window.MCSDocs = window.MCSDocs || {};

  D.sessions = function (lang, ctx) {
    if (lang === 'en') {
      return '<ol class="doc-list">' +
        '<li><strong>Reading your reports.</strong> We review your Equifax, Experian, and TransUnion credit reports together (you get them free at AnnualCreditReport.com), line by line, and explain what each account means and which factors weigh most on your score.</li>' +
        '<li><strong>Payment and card plan.</strong> We build a written credit plan with you: what to pay first, how much of your cards to use, and how to avoid late payments.</li>' +
        '<li><strong>Fixing errors on your own.</strong> We teach you how to spot possible errors and dispute them yourself, directly with each bureau and at no cost, and we give you template letters with instructions. You decide what to send and you send it. You should only dispute information you believe in good faith is inaccurate or incomplete.</li>' +
        '<li><strong>Follow-up and next step.</strong> We review your progress, adjust your plan, and explain the next steps toward your goal (for example, getting ready to apply for a mortgage).</li>' +
        '</ol>' +
        '<p>Each session lasts about ' + ctx.minutes + ' minutes and takes place by phone, video call, or in person.</p>';
    }
    return '<ol class="doc-list">' +
      '<li><strong>Lectura de sus reportes.</strong> Revisamos juntos sus reportes de crédito de Equifax, Experian y TransUnion (que usted obtiene gratis en AnnualCreditReport.com), línea por línea, y le explicamos qué significa cada cuenta y qué factores pesan más en su puntaje.</li>' +
      '<li><strong>Plan de pagos y tarjetas.</strong> Preparamos con usted un plan de crédito por escrito: qué pagar primero, cuánto usar de sus tarjetas y cómo evitar pagos tarde.</li>' +
      '<li><strong>Corrección de errores por su cuenta.</strong> Le enseñamos a identificar posibles errores y a disputarlos usted mismo, directamente con cada buró y sin costo, y le damos cartas modelo con instrucciones. Usted decide qué enviar y lo envía usted. Solo debe disputar información que crea de buena fe que es inexacta o incompleta.</li>' +
      '<li><strong>Seguimiento y siguiente paso.</strong> Revisamos su avance, ajustamos su plan y le explicamos los siguientes pasos hacia su meta (por ejemplo, prepararse para solicitar un préstamo hipotecario).</li>' +
      '</ol>' +
      '<p>Cada sesión dura aproximadamente ' + ctx.minutes + ' minutos y se realiza por teléfono, videollamada o en persona.</p>';
  };

  /* ---------- E-SIGN consent ---------- */
  D.esign = function (lang, ctx) {
    if (lang === 'en') {
      return '<p>To sign online, we need your consent to receive and sign the disclosures, the contract, and the cancellation notices electronically.</p>' +
        '<ul class="doc-bullets">' +
        '<li><strong>Paper copies:</strong> you can get paper copies of every document at no cost. Ask us at ' + ctx.contact + '.</li>' +
        '<li><strong>Withdrawing consent:</strong> you can withdraw this consent at any time, at no cost, by contacting us the same way. Withdrawing does not undo documents already signed.</li>' +
        '<li><strong>What you need:</strong> a device with an up-to-date web browser and the ability to print or save files (for example, as a PDF). You will be able to download your signed copy at the end.</li>' +
        '<li><strong>Changes:</strong> tell us if your email address or phone number changes.</li>' +
        '</ul>';
    }
    return '<p>Para firmar en línea necesitamos su consentimiento para recibir y firmar electrónicamente las divulgaciones, el contrato y los avisos de cancelación.</p>' +
      '<ul class="doc-bullets">' +
      '<li><strong>Copias en papel:</strong> puede recibir copias en papel de todos los documentos sin costo. Pídalas al ' + ctx.contact + '.</li>' +
      '<li><strong>Retirar el consentimiento:</strong> puede retirar este consentimiento en cualquier momento, sin costo, avisándonos por los mismos medios. Retirarlo no anula los documentos ya firmados.</li>' +
      '<li><strong>Lo que necesita:</strong> un dispositivo con un navegador web actualizado y la capacidad de imprimir o guardar archivos (por ejemplo, como PDF). Al final podrá descargar su copia firmada.</li>' +
      '<li><strong>Cambios:</strong> avísenos si cambia su correo electrónico o su teléfono.</li>' +
      '</ul>';
  };

  /* ---------- Document 2: Texas disclosure statement (Tex. Fin. Code §393.105) ---------- */
  D.texas = function (lang, ctx) {
    if (lang === 'en') {
      return '<h3 class="doc-title">Disclosure Statement (Texas Finance Code §393.105)</h3>' +
        '<p>' + ctx.entity + ' is registered as a Credit Services Organization with the Texas Secretary of State, registration no. ' + ctx.cso + '. You may ask to inspect our registration statement.</p>' +
        '<ol class="doc-list">' +
        '<li><strong>Services and total cost.</strong> We provide a credit coaching program of ' + ctx.sessions + ' sessions:' + D.sessions('en', ctx) + '<p>Price: ' + ctx.price + ' per session. <strong>Total cost of all services: ' + ctx.total + '.</strong> Each session is invoiced only after it is delivered. We do not file disputes or contact credit bureaus or creditors on your behalf.</p></li>' +
        '<li><strong>Your right to proceed against our surety.</strong> If you are damaged by our violation of Chapter 393 of the Texas Finance Code, you may file suit against ' + ctx.entity + ' and against the surety or trustee of our $10,000 surety bond or account (Tex. Fin. Code §§393.404–393.405).</li>' +
        '<li><strong>Surety information.</strong> ' + ctx.surety + '</li>' +
        '<li><strong>Your right to review your credit file.</strong> Under the Fair Credit Reporting Act (15 U.S.C. §1681 et seq.), you have the right to review the information a consumer reporting agency (credit bureau) keeps in your file. You can request your file from Equifax, Experian, and TransUnion, and you can view your reports for free at AnnualCreditReport.com.</li>' +
        '<li><strong>When review is free.</strong> Information in your file is available for review (A) without charge if you request it from the consumer reporting agency not later than the 30th day after the date the agency receives notice that you have been denied credit (federal law extends this to 60 days); and (B) for a minimal charge at any other time. Federal law and the credit bureaus currently also let you see your reports for free at AnnualCreditReport.com.</li>' +
        '<li><strong>Your right to dispute directly.</strong> You have the right to dispute directly with a consumer reporting agency the completeness or accuracy of any item in your file. The agency must reinvestigate, generally within 30 days, at no cost to you.</li>' +
        '<li><strong>Accurate information cannot be permanently removed</strong> from the files of a consumer reporting agency.</li>' +
        '<li><strong>Obsolete information.</strong> In general, negative information becomes obsolete after 7 years (for example, late payments, collections, and charge-offs), and bankruptcies after 10 years. A consumer reporting agency is prevented from issuing a report containing obsolete information, except in limited cases allowed by federal law (such as credit or life insurance of $150,000 or more, or a job with an annual salary of $75,000 or more).</li>' +
        '<li><strong>Nonprofit credit counseling.</strong> Nonprofit credit counseling services are available, often free or at low cost. You can find agencies through the National Foundation for Credit Counseling at nfcc.org, or HUD-approved housing counseling agencies at hud.gov.</li>' +
        '</ol>';
    }
    return '<h3 class="doc-title">Declaración de divulgación (Código de Finanzas de Texas, §393.105)</h3>' +
      '<p>' + ctx.entity + ' está registrada como Organización de Servicios de Crédito ante la Secretaría de Estado de Texas, registro núm. ' + ctx.cso + '. Usted puede pedir ver nuestra declaración de registro.</p>' +
      '<ol class="doc-list">' +
      '<li><strong>Servicios y costo total.</strong> Ofrecemos un programa de asesoría de crédito de ' + ctx.sessions + ' sesiones:' + D.sessions('es', ctx) + '<p>Precio: ' + ctx.price + ' por sesión. <strong>Costo total de todos los servicios: ' + ctx.total + '.</strong> Cada sesión se factura solo después de realizarse. No presentamos disputas ni nos comunicamos con burós de crédito o acreedores en su nombre.</p></li>' +
      '<li><strong>Su derecho a reclamar contra nuestra fianza.</strong> Si usted sufre daños por una violación del Capítulo 393 del Código de Finanzas de Texas por parte nuestra, puede presentar una demanda contra ' + ctx.entity + ' y contra la compañía fiadora o el fiduciario de nuestra fianza o cuenta de garantía de $10,000 (Código de Finanzas de Texas, §§393.404–393.405).</li>' +
      '<li><strong>Información de la fianza.</strong> ' + ctx.surety + '</li>' +
      '<li><strong>Su derecho a revisar su archivo de crédito.</strong> Según la Ley de Informe Justo de Crédito (FCRA, 15 U.S.C. §1681 y siguientes), usted tiene derecho a revisar la información que una agencia de informes de consumidores (buró de crédito) tiene en su archivo. Puede pedir su archivo a Equifax, Experian y TransUnion, y puede ver sus reportes gratis en AnnualCreditReport.com.</li>' +
      '<li><strong>Cuándo es gratis revisarlo.</strong> La información de su archivo está disponible para revisión (A) sin costo si la solicita a la agencia de informes a más tardar el día 30 después de la fecha en que la agencia recibe aviso de que a usted se le negó crédito (la ley federal amplía este plazo a 60 días); y (B) por un cargo mínimo en cualquier otro momento. Actualmente la ley federal y los burós también le permiten ver sus reportes gratis en AnnualCreditReport.com.</li>' +
      '<li><strong>Su derecho a disputar directamente.</strong> Usted tiene derecho a disputar directamente con una agencia de informes de consumidores si un dato de su archivo está incompleto o es inexacto. La agencia debe volver a investigar, generalmente dentro de 30 días, sin costo para usted.</li>' +
      '<li><strong>La información exacta no puede eliminarse permanentemente</strong> de los archivos de una agencia de informes de consumidores.</li>' +
      '<li><strong>Información obsoleta.</strong> En general, la información negativa se vuelve obsoleta después de 7 años (por ejemplo, pagos tarde, cuentas en colección y cuentas canceladas), y las bancarrotas después de 10 años. Una agencia de informes de consumidores no puede emitir un reporte con información obsoleta, salvo en casos limitados que permite la ley federal (como crédito o seguro de vida de $150,000 o más, o un empleo con salario anual de $75,000 o más).</li>' +
      '<li><strong>Asesoría de crédito sin fines de lucro.</strong> Existen servicios de asesoría de crédito sin fines de lucro, muchas veces gratuitos o de bajo costo. Puede encontrar agencias en la National Foundation for Credit Counseling (nfcc.org) o agencias de asesoría de vivienda aprobadas por HUD (hud.gov).</li>' +
      '</ol>';
  };

  /* ---------- Document 3: the contract ---------- */
  D.contract = function (lang, ctx) {
    var co = ctx.coClient ? (lang === 'en'
      ? '<p>This program is for a couple. Co-client: <strong>' + ctx.coClient + '</strong>. Each person must sign their own copy of this contract; sessions begin after both cancellation periods end.</p>'
      : '<p>Este programa es para pareja. Co-cliente: <strong>' + ctx.coClient + '</strong>. Cada persona debe firmar su propia copia de este contrato; las sesiones comienzan después de que terminen ambos periodos de cancelación.</p>') : '';

    if (lang === 'en') {
      return '<h3 class="doc-title">Credit Coaching Services Contract</h3>' +
        '<p><strong>Date:</strong> ' + ctx.date + '<br>' +
        '<strong>Company:</strong> ' + ctx.entity + ', ' + ctx.address + ' ("we," "us")<br>' +
        '<strong>Client:</strong> ' + ctx.clientName + ', ' + ctx.clientAddress + ', ' + ctx.clientEmail + ', ' + ctx.clientPhone + ' ("you")</p>' + co +
        '<h4>1. Services</h4><p>We will provide you a credit coaching and education program of ' + ctx.sessions + ' individual sessions:</p>' + D.sessions('en', ctx) +
        '<h4>2. What we do not do</h4><p>We do not file disputes, and we do not contact credit bureaus, creditors, or collectors on your behalf. We are not a lender, a credit bureau, or a law firm, and we do not give legal or tax advice. We will never advise you to make a false or misleading statement about your credit, or to use a different identification number (such as a "CPN" or EIN) to hide your credit history.</p>' +
        '<h4>3. Guarantees and refunds</h4><p>We make no guarantees of performance. We do not guarantee any result, score increase, removal of information, or approval for credit or a loan. We make no promise of a full or partial refund, other than your right to cancel described below and the fact that you never pay for a session you have not received.</p>' +
        '<h4>4. Timing</h4><p>No services will be provided until your cancellation period ends. Your first session can be scheduled starting ' + ctx.earliest + '. We estimate that all services will be completed no later than ' + ctx.programDays + ' days after the date of this contract (by ' + ctx.completeBy + ').</p>' +
        '<h4>5. Payment terms</h4><p>Price: <strong>' + ctx.price + ' per session</strong>. <strong>Total of all payments: ' + ctx.total + '</strong> for ' + ctx.sessions + ' sessions. You pay nothing in advance. After each session is delivered, we will send you an invoice for that session, due within ' + ctx.dueDays + ' days. We will not charge or receive money for a session before it is performed, and we do not charge for missed or canceled sessions. There are no sign-up fees, other charges, or payments to any other person required by this contract. If you stop the program, you pay only for sessions already delivered.</p>' +
        '<h4>6. Ending the program</h4><p>You may stop the program at any time by telling us in writing. We may end it by written notice. Either way, you owe only for sessions already delivered.</p>' +
        '<h4>7. Your rights</h4><p>You have the right to cancel this contract as explained below and in the attached Notice of Cancellation forms. You may dispute inaccurate information directly with the credit bureaus at no cost. Any waiver of your rights under the federal Credit Repair Organizations Act or Chapter 393 of the Texas Finance Code is void.</p>' +
        '<h4>8. Company information</h4><p>Principal place of business: ' + ctx.address + '.<br>Agent in Texas authorized to receive service of process: ' + ctx.agentName + ', ' + ctx.agentAddress + '.<br>Texas Credit Services Organization registration no. ' + ctx.cso + '.<br>' + ctx.surety + '</p>' +
        '<h4>9. Electronic signature and copies</h4><p>You agreed to receive and sign these documents electronically. You will receive a complete copy of this contract, the disclosure statements, and the cancellation notices when you sign. You may request paper copies at no cost.</p>' +
        '<h4>10. General</h4><p>This contract, together with Document 1 (Consumer Credit File Rights) and Document 2 (Disclosure Statement) and the attached Notice of Cancellation forms, is the entire agreement. Changes must be in writing and signed by both parties. Texas law and applicable federal law govern this contract. Our privacy policy is at mycrystalscore.com/legal.html.</p>';
    }
    return '<h3 class="doc-title">Contrato de servicios de asesoría de crédito</h3>' +
      '<p><strong>Fecha:</strong> ' + ctx.date + '<br>' +
      '<strong>Empresa:</strong> ' + ctx.entity + ', ' + ctx.address + ' ("nosotros")<br>' +
      '<strong>Cliente:</strong> ' + ctx.clientName + ', ' + ctx.clientAddress + ', ' + ctx.clientEmail + ', ' + ctx.clientPhone + ' ("usted")</p>' + co +
      '<h4>1. Servicios</h4><p>Le daremos un programa de asesoría y educación de crédito de ' + ctx.sessions + ' sesiones individuales:</p>' + D.sessions('es', ctx) +
      '<h4>2. Lo que no hacemos</h4><p>No presentamos disputas ni nos comunicamos con burós de crédito, acreedores o cobradores en su nombre. No somos prestamistas, ni un buró de crédito, ni un despacho de abogados, y no damos asesoría legal ni de impuestos. Nunca le aconsejaremos hacer una declaración falsa o engañosa sobre su crédito, ni usar otro número de identificación (como un "CPN" o un EIN) para ocultar su historial de crédito.</p>' +
      '<h4>3. Garantías y reembolsos</h4><p>No ofrecemos garantías de desempeño. No garantizamos ningún resultado, aumento de puntaje, eliminación de información ni aprobación de crédito o de un préstamo. No prometemos reembolsos totales ni parciales, más allá de su derecho de cancelación descrito abajo y de que nunca paga por una sesión que no ha recibido.</p>' +
      '<h4>4. Tiempos</h4><p>No se prestará ningún servicio hasta que termine su periodo de cancelación. Su primera sesión puede agendarse a partir del ' + ctx.earliest + '. Estimamos completar todos los servicios a más tardar ' + ctx.programDays + ' días después de la fecha de este contrato (a más tardar el ' + ctx.completeBy + ').</p>' +
      '<h4>5. Términos de pago</h4><p>Precio: <strong>' + ctx.price + ' por sesión</strong>. <strong>Total de todos los pagos: ' + ctx.total + '</strong> por ' + ctx.sessions + ' sesiones. Usted no paga nada por adelantado. Después de realizar cada sesión le enviaremos una factura por esa sesión, pagadera dentro de ' + ctx.dueDays + ' días. No cobraremos ni recibiremos dinero por una sesión antes de realizarla, y no cobramos por sesiones a las que no asista o que se cancelen. No hay cuotas de inscripción, otros cargos ni pagos a terceros requeridos por este contrato. Si usted deja el programa, solo paga las sesiones ya realizadas.</p>' +
      '<h4>6. Terminación del programa</h4><p>Usted puede dejar el programa en cualquier momento avisándonos por escrito. Nosotros podemos terminarlo con aviso por escrito. En ambos casos, usted solo debe las sesiones ya realizadas.</p>' +
      '<h4>7. Sus derechos</h4><p>Usted tiene derecho a cancelar este contrato como se explica abajo y en los formularios de Aviso de Cancelación adjuntos. Puede disputar información inexacta directamente con los burós de crédito sin costo. Cualquier renuncia a sus derechos bajo la Ley federal de Organizaciones de Reparación de Crédito o el Capítulo 393 del Código de Finanzas de Texas es nula.</p>' +
      '<h4>8. Información de la empresa</h4><p>Domicilio principal del negocio: ' + ctx.address + '.<br>Agente en Texas autorizado para recibir notificaciones judiciales: ' + ctx.agentName + ', ' + ctx.agentAddress + '.<br>Registro de Organización de Servicios de Crédito de Texas núm. ' + ctx.cso + '.<br>' + ctx.surety + '</p>' +
      '<h4>9. Firma electrónica y copias</h4><p>Usted aceptó recibir y firmar estos documentos electrónicamente. Al firmar recibirá una copia completa de este contrato, de las declaraciones de divulgación y de los avisos de cancelación. Puede pedir copias en papel sin costo.</p>' +
      '<h4>10. Disposiciones generales</h4><p>Este contrato, junto con el Documento 1 (Derechos sobre su archivo de crédito), el Documento 2 (Declaración de divulgación) y los formularios de Aviso de Cancelación adjuntos, es el acuerdo completo. Cualquier cambio debe hacerse por escrito y firmarse por ambas partes. Este contrato se rige por las leyes de Texas y las leyes federales aplicables. Nuestra política de privacidad está en mycrystalscore.com/legal.html.</p>';
  };
})();
