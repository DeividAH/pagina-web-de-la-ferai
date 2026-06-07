// ============================================================
// BOTS.JS v4 — 50+ mensajes por tipo, máxima variedad
// ============================================================

const BOT_COLORS = ['#7c5cfc','#ff4b6e','#fbbf24','#22d3a0','#f97316','#06b6d4','#ec4899','#a855f7','#14b8a6'];

const BOTS = {
  phish: {
    id: 'phish', name: 'PhishBot', label: 'Phishing', emoji: '🎣',
    description: 'Envía links falsos que imitan páginas reales',
    clues: ['URL sospechosa', 'Urgencia exagerada', 'Promesa imposible'],
    damage: 20,
    messages: [
      { sender: 'insta_seguridad_oficial', name: 'Instagram Seguridad', text: '⚠️ Tu cuenta fue reportada. Verificá tu identidad en las próximas 2 horas o será eliminada: insta-gram-verify.co/cuenta', type: 'dm', isBad: true, clue: '🔍 El dominio real es instagram.com, no insta-gram-verify.co' },
      { sender: 'sorteo_oficial_2024', name: 'Sorteos Oficiales', text: '🎉 ¡GANASTE un iPhone 16 Pro! Reclamá antes de medianoche: sorteo-ganaste.net/premio?id=98271', type: 'dm', isBad: true, clue: '🔍 Nadie regala iPhones a desconocidos por DM' },
      { sender: 'soporte_tecnico_app', name: 'Soporte Técnico', text: 'Detectamos accesos desde Rusia. Confirmá tu contraseña actual: account-help-insta.tk/verify', type: 'dm', isBad: true, clue: '🔍 Instagram NUNCA pide contraseña por DM' },
      { sender: 'meta_support_official', name: 'Meta Support', text: 'Your account has been flagged. Restore access in 24 hours: meta-login-restore.net/verify', type: 'dm', isBad: true, clue: '🔍 Meta no te escribe en inglés si tu cuenta está en español' },
      { sender: 'verificacion_azul_cr', name: 'Verificación Oficial', text: '✅ Tu cuenta fue seleccionada para verificación azul gratis. Completá el proceso: insta-verificar-cuenta.com/azul', type: 'notif', isBad: true, clue: '🔍 La verificación azul no se da por link externo' },
      { sender: 'netflix_cr_gratis', name: 'Netflix Gratis CR', text: '📺 Netflix regala 6 meses premium por su aniversario. Activá aquí: netflix-cr-aniversario.net/gratis', type: 'feed', isBad: true, clue: '🔍 Netflix nunca regala meses por Instagram' },
      { sender: 'copyright_alert_meta', name: 'Copyright Alert', text: '⚠️ Tu post tiene contenido con derechos de autor. Tu cuenta será suspendida en 12h si no apelás: copyright-appeal-meta.com/appeal', type: 'notif', isBad: true, clue: '🔍 Las apelaciones reales van dentro de la app, no por link externo' },
      { sender: 'descubre_quien_visita', name: 'Qui3n te visita', text: '👀 47 personas vieron tu perfil esta semana en secreto. Descubrí quiénes: ver-visitantes-ig.xyz/perfil', type: 'notif', isBad: true, clue: '🔍 Instagram no permite ver visitantes del perfil' },
      { sender: 'banco_nacional_cr_alerta', name: 'Banco Nacional CR', text: 'ALERTA: Intento de acceso a tu cuenta bancaria desde dispositivo desconocido. Confirmá tus datos: banconal-cr-seguro.com/verificar', type: 'dm', isBad: true, clue: '🔍 Los bancos NO mandan alertas por Instagram' },
      { sender: 'tiktok_creadores_cr', name: 'TikTok Creadores CR', text: '🎁 Tus videos fueron seleccionados para el programa de creadores. Recibirás ₡500,000 mensuales. Activá: tiktok-creadores-cr.xyz/activar', type: 'feed', isBad: true, clue: '🔍 El dominio oficial es tiktok.com, no tiktok-creadores-cr.xyz' },
      { sender: 'paypal_cr_reembolso', name: 'PayPal Costa Rica', text: '💰 Tenés un reembolso pendiente de $85.00. Reclamálo antes de 48h o expira: paypal-reembolso-cr.com/claim', type: 'notif', isBad: true, clue: '🔍 PayPal no notifica reembolsos por Instagram' },
      { sender: 'amazon_cr_premio', name: 'Amazon Costa Rica', text: '🛒 ¡Fuiste seleccionado como cliente del mes! Premio: $200 en créditos. Reclamá: amazon-cr-premios.net', type: 'notif', isBad: true, clue: '🔍 Amazon no da premios por Instagram' },
      { sender: 'spotify_cr_premium', name: 'Spotify Premium CR', text: '🎵 Tu cuenta Spotify fue seleccionada para 12 meses gratis. Activá antes que expire: spotify-premium-gratis.co', type: 'dm', isBad: true, clue: '🔍 Spotify no regala meses por DM de Instagram' },
      { sender: 'ig_copyright_notice', name: 'Instagram Legal', text: '📋 Aviso legal: tu foto del 15 de enero viola derechos de autor. Disputá el caso aquí antes de 24h: ig-legal-dispute.com', type: 'notif', isBad: true, clue: '🔍 Los avisos legales reales llegan por correo, no por Instagram' },
      { sender: 'winner_selection_2024', name: 'Global Giveaway', text: '🌍 You have been selected as a global winner! Claim your $1000 prize before it expires: global-winners-2024.net/claim', type: 'dm', isBad: true, clue: '🔍 Nunca ganás premios de sorteos en los que no participaste' },
      { sender: 'cr_gobierno_beneficio', name: 'Gobierno CR Beneficios', text: '🏛️ El gobierno de Costa Rica habilitó un bono de ₡75,000 para jóvenes. Registrate antes del viernes: cr-gobierno-bonos.com', type: 'feed', isBad: true, clue: '🔍 Los beneficios del gobierno se tramitan en bccr.fi.cr o sede.go.cr' },
      { sender: 'whatsapp_upgrade_cr', name: 'WhatsApp Upgrade', text: '📱 Tu versión de WhatsApp expira hoy. Actualizá por este link oficial para no perder tu cuenta: whatsapp-upgrade-cr.net', type: 'notif', isBad: true, clue: '🔍 WhatsApp se actualiza por la App Store o Play Store, nunca por link' },
      { sender: 'tarjeta_regalo_ig', name: 'Tarjeta Regalo IG', text: '🎁 Recibiste una tarjeta regalo de ₡50,000 de un seguidor anónimo. Canjeala antes de que expire: ig-gift-cards-cr.com', type: 'dm', isBad: true, clue: '🔍 Instagram no tiene sistema de tarjetas regalo' },
    ]
  },

  social: {
    id: 'social', name: 'SocialBot', label: 'Ingeniería Social', emoji: '🎭',
    description: 'Manipula psicológicamente para obtener información',
    clues: ['Pide datos personales', 'Historia de emergencia', 'Urgencia artificial'],
    damage: 25,
    messages: [
      { sender: 'carlos_amigo123', name: 'Carlos (amigo?)', text: 'Hola! Soy Carlos de química. Olvidé mi contraseña urgente. ¿Me confirmás tu número para que el técnico verifique que somos del mismo grupo?', type: 'dm', isBad: true, clue: '🔍 Un amigo no necesita TU número para recuperar SU contraseña' },
      { sender: 'profe_martinez_oficial', name: 'Profe Martínez', text: 'Hola, hay un problema con el sistema. Escribime al +506 8xxx xxxx por WhatsApp para enviarte el examen del viernes. Urgente.', type: 'dm', isBad: true, clue: '🔍 Los profesores usan canales oficiales, no números personales por DM' },
      { sender: 'mamá_nueva_cuenta', name: 'Mamá (nueva cuenta)', text: 'Hijx, me hackearon la cuenta. Necesito que me enviés el código de 6 dígitos que te llegó al cel. Es para verificar que sos mi contacto.', type: 'dm', isBad: true, clue: '🔍 Ese código de 6 dígitos da acceso a TU cuenta, nunca lo compartas' },
      { sender: 'director_colegio_cr', name: 'Director del Colegio', text: 'Estimado estudiante, necesito verificar tu matrícula para la feria. Enviame tu cédula y nombre completo antes de las 5pm.', type: 'dm', isBad: true, clue: '🔍 Ninguna institución pide cédulas por Instagram' },
      { sender: 'amigo_diego_nuevo', name: 'Diego (nuevo cel)', text: 'Bro cambié de número. Guárdame: +506 7xxx xxxx. Oye, ¿me podés prestar ₡5,000 por SINPE? Te lo devuelvo mañana.', type: 'dm', isBad: true, clue: '🔍 Pedidos urgentes de dinero por redes son estafa clásica' },
      { sender: 'influencer_colaboracion', name: 'AgenciaDigitalCR', text: 'Queremos trabajar con vos. Para enviarte el contrato necesitamos tu DUI, dirección y número de cuenta. Cierra mañana.', type: 'dm', isBad: true, clue: '🔍 Ninguna agencia legítima pide datos bancarios por Instagram DM' },
      { sender: 'prima_andrea_2024', name: 'Andrea (prima)', text: 'Estoy en el hospital con mamá, se nos olvidó la cartera. Necesito ₡15,000 a este SINPE: 8xxx-xxxx. Te explico después.', type: 'dm', isBad: true, clue: '🔍 Verificá siempre emergencias llamando directamente a la persona' },
      { sender: 'valeria_cr2005', name: 'Valeria', text: 'Te vi en el concierto! Votá por mi foto en este concurso, solo ingresá con tu cuenta: foto-concurso.online/votar', type: 'dm', isBad: true, clue: '🔍 Ingresar con tu cuenta en sitios externos = robo de credenciales' },
      { sender: 'tecnico_internet_cr', name: 'Técnico Internet CR', text: 'Señor/a, su conexión está siendo usada para actividades ilegales. Para no ser reportado llame al 8xxx-xxxx en las próximas 2 horas.', type: 'notif', isBad: true, clue: '🔍 Los ISP nunca contactan por Instagram para avisos de seguridad' },
      { sender: 'reclutador_trabajo_cr', name: 'ReclutaCR Jobs', text: 'Encontramos tu perfil y queremos ofrecerte trabajo de ₡800,000/mes desde casa. Solo necesitamos tu cédula para iniciar el proceso hoy.', type: 'dm', isBad: true, clue: '🔍 Ofertas laborales que piden cédula por DM son estafas de empleo' },
      { sender: 'nuevo_amigo_ig', name: 'Alejandro M.', text: 'Hola! Vi que seguimos a los mismos artistas. Soy nuevo en la ciudad, ¿podrías ayudarme? Solo necesito que guardes este número y me llames.', type: 'dm', isBad: true, clue: '🔍 Desconocidos que piden números personales desde el inicio son sospechosos' },
      { sender: 'compañero_proyecto', name: 'Sebastián (proyecto)', text: 'Profe pidió que te contara: el proyecto cambió de tema. Para mandarte los nuevos lineamientos necesito que confirmes tu correo y contraseña institucional.', type: 'dm', isBad: true, clue: '🔍 Nadie legítimo necesita tu contraseña institucional por Instagram' },
      { sender: 'hermana_emergencia', name: 'Hermana', text: 'Se me cayó el cel al agua y usé el de una amiga. Mamá está en el hospital, necesito ₡30,000 urgente SINPE: 6xxx-xxxx. Después explico todo.', type: 'dm', isBad: true, clue: '🔍 Llamá directamente a tu familia para verificar emergencias' },
      { sender: 'encuesta_cr_pagada', name: 'Encuestas Pagadas CR', text: '📊 Ganate ₡20,000 respondiendo una encuesta de 5 min. Solo necesitamos verificar tu identidad con cédula y foto. ¡Pago inmediato!', type: 'notif', isBad: true, clue: '🔍 Las encuestas pagadas legítimas no piden fotos de cédula por Instagram' },
      { sender: 'admin_grupo_whatsapp', name: 'Admin Grupo Escolar', text: 'Por favor confirmá tu número de cel para agregarte al grupo nuevo de la clase. El anterior fue hackeado y perdimos todos los contactos.', type: 'dm', isBad: true, clue: '🔍 Pedidos de número de teléfono por Instagram son sospechosos' },
    ]
  },

  spam: {
    id: 'spam', name: 'SpamBot', label: 'Desinformación', emoji: '📢',
    description: 'Difunde noticias falsas y cadenas de mensajes',
    clues: ['Sin fuente oficial', 'Lenguaje alarmista', 'Pide que lo compartas'],
    damage: 10,
    messages: [
      { sender: 'noticias_cr_urgente', name: 'Noticias CR Urgente', text: '🚨 URGENTE: El gobierno anunció que el WiFi público transmitirá virus a celulares desde mañana. COMPARTE antes de que borren esto.', type: 'feed', isBad: true, clue: '🔍 El WiFi no transmite virus así. "Comparte antes que lo borren" = desinformación' },
      { sender: 'salud_tips_virales', name: 'SaludTips', text: '⚠️ CADENA: Si recibes mensaje de "+506 7xxx" NO LO ABRAS, formatea tu teléfono al instante. Reenvía a todos tus contactos.', type: 'feed', isBad: true, clue: '🔍 Abrir un mensaje no puede formatear un teléfono' },
      { sender: 'politica_cr_viral', name: 'Política CR Viral', text: '🚨 CONFIRMADO: El gobierno cobrará impuesto del 30% a mensajes de WhatsApp desde enero. Comparte para que todos se enteren.', type: 'feed', isBad: true, clue: '🔍 No existe ningún impuesto a mensajes de WhatsApp' },
      { sender: 'salud_natural_cr', name: 'Salud Natural CR', text: 'CIENTÍFICOS confirman: agua tibia con limón en ayunas ELIMINA cáncer y diabetes en 30 días. Los médicos no quieren que sepas esto.', type: 'feed', isBad: true, clue: '🔍 Ninguna bebida cura el cáncer. "Médicos no quieren que sepas" = pseudociencia' },
      { sender: 'alerta_viral_2025', name: 'Alerta Viral 2025', text: '⚠️ La nueva actualización de Instagram roba tus fotos para IA. Para evitarlo pegá este texto en tu bio: "No autorizo el uso de mis fotos - Ley 2025".', type: 'notif', isBad: true, clue: '🔍 Pegar texto en tu bio no protege nada. Esta cadena circula hace años' },
      { sender: 'tips_tecnologia_cr', name: 'TipsTecnología', text: '💡 TRUCO: Si marcás este número al revés podés llamar gratis a cualquier país por 24h. Solo funciona hoy. Compartí antes que lo bloqueen.', type: 'feed', isBad: true, clue: '🔍 No existe ningún número mágico para llamadas gratis' },
      { sender: 'cr_noticias_falsas1', name: 'CR Noticias Hoy', text: '🔴 BREAKING: Encontraron sustancia química peligrosa en el agua potable de San José. Autoridades piden no tomar agua del grifo HOY.', type: 'feed', isBad: true, clue: '🔍 Noticias de emergencia así se publican en medios oficiales como AyA o MINAE' },
      { sender: 'viral_salud_2025', name: 'Salud y Bienestar CR', text: 'CIENTÍFICOS descubrieron que cargar el cel de 0% a 100% destruye la batería en 3 meses. Siempre cargá de 20% a 80%.', type: 'feed', isBad: true, clue: '🔍 Aunque hay algo de verdad en cuidar baterías, el alarmismo exagerado es señal de spam' },
      { sender: 'dolar_cr_rumor', name: 'Economía CR', text: '💸 RUMOR CONFIRMADO: El Banco Central devaluará el colón 40% esta semana. Comprá dólares HOY antes que sea tarde. Comparte urgente.', type: 'feed', isBad: true, clue: '🔍 Noticias económicas verificá en el BCCR: bccr.fi.cr' },
      { sender: 'cadena_suerte_2025', name: 'Cadena de la Suerte', text: '🍀 Esta cadena tiene 15 años circulando. Enviala a 10 personas en 10 min y recibirás buenas noticias. Si la rompes tendrás mala suerte 7 años.', type: 'dm', isBad: true, clue: '🔍 Las cadenas de la suerte son spam clásico, no traen ni buena ni mala suerte' },
      { sender: 'app_gratis_hoy', name: 'Apps Gratis Hoy', text: '🎮 HOY SOLO: Minecraft, Among Us y Pokémon GO Premium son GRATIS en la App Store. Solo por 24 horas. ¡Descargalos ya!', type: 'feed', isBad: true, clue: '🔍 Verificá ofertas de apps directamente en la App Store o Google Play' },
      { sender: 'cr_coronavirus_nuevo', name: 'Salud CR Alertas', text: '🦠 ALERTA: Nueva variante de COVID-19 más mortal detectada en Costa Rica. El gobierno ocultó la información. Vacunas no funcionan.', type: 'feed', isBad: true, clue: '🔍 Información de salud verificá en el Ministerio de Salud: ministeriodesalud.go.cr' },
      { sender: 'whatsapp_desactivado', name: 'WhatsApp Costa Rica', text: '📵 WhatsApp desactivará cuentas inactivas este viernes. Para mantener tu cuenta activa reenviá este mensaje a 10 contactos hoy.', type: 'notif', isBad: true, clue: '🔍 WhatsApp no desactiva cuentas por no reenviar mensajes' },
    ]
  },

  clone: {
    id: 'clone', name: 'CloneBot', label: 'Suplantación', emoji: '👥',
    description: 'Crea perfiles falsos idénticos a personas reales',
    clues: ['Cuenta recién creada', 'Pocas publicaciones', 'Pide reconectar'],
    damage: 20,
    messages: [
      { sender: 'mariana.cr.oficial2', name: 'Mariana García', text: 'Hola! Me hackearon la cuenta @mariana.cr.oficial y tuve que crear esta. Por favor sígueme de nuevo y avisales a nuestros amigos.', type: 'dm', isBad: true, clue: '🔍 Verificá por otro medio (WhatsApp, en persona) antes de reconectar' },
      { sender: 'influencer.cr.page', name: 'InstaFamosa CR ✓', text: 'Sorteo EXCLUSIVO para seguidores. Para participar necesito verificar que me seguís. Mandame tu usuario y contraseña.', type: 'notif', isBad: true, clue: '🔍 Ningún influencer necesita tu contraseña para un sorteo' },
      { sender: 'bcr_banco_cr_oficial', name: 'BCR Banco Costa Rica', text: 'Detectamos cargo no autorizado de ₡85.000. Para disputarlo respondé con número de tarjeta y código de seguridad.', type: 'dm', isBad: true, clue: '🔍 Los bancos NUNCA piden datos de tarjeta por Instagram' },
      { sender: 'mep_costa_rica_oficial2', name: 'MEP Costa Rica', text: 'Comunicado oficial: todos los estudiantes deben confirmar su matrícula 2025 antes del viernes: mep-matricula-cr.net/confirmar', type: 'notif', isBad: true, clue: '🔍 El MEP no gestiona matrículas por Instagram. Dominio oficial: mep.go.cr' },
      { sender: 'papa_nueva_cuenta_ig', name: 'Papá (nueva cuenta)', text: 'Hijo/a, perdí acceso a mi cuenta anterior. Desde este perfil me pueden contactar. Necesito que me ayudés con algo urgente urgente.', type: 'dm', isBad: true, clue: '🔍 Verificá llamando al número que ya conocés de esa persona' },
      { sender: 'cruz_roja_cr_ayuda', name: 'Cruz Roja CR', text: 'Campaña urgente por víctimas de inundaciones. Dona via SINPE al 8xxx-xxxx. Cada colón ayuda. Por favor comparte.', type: 'feed', isBad: true, clue: '🔍 Verificá donaciones en el sitio oficial: cruzroja.or.cr' },
      { sender: 'google_cr_premios', name: 'Google Costa Rica', text: '🎉 Fuiste seleccionado como usuario destacado de Google CR. Tu premio de $500 está listo: google-premios-latam.com/cr', type: 'notif', isBad: true, clue: '🔍 Google no da premios por Instagram. El dominio no es google.com' },
      { sender: 'policia_cr_denuncia', name: 'OIJ Costa Rica', text: 'Ciudadano/a, tiene una denuncia activa en su contra. Preséntese o contáctenos al 8xxx-xxxx para aclarar la situación.', type: 'dm', isBad: true, clue: '🔍 El OIJ no hace citaciones por Instagram. Verificá en oij.go.cr' },
      { sender: 'amigo_hackeado_2', name: 'Kevin (nueva cuenta)', text: 'Bro me hackearon y perdí todo. Esta es mi nueva cuenta. Necesito que me prestés ₡10,000 urgente, mañana te los devuelvo.', type: 'dm', isBad: true, clue: '🔍 Llamá directamente a tu amigo para verificar antes de enviar dinero' },
      { sender: 'ccss_cr_cita', name: 'CCSS Costa Rica', text: '🏥 Tiene una cita médica pendiente de confirmar. Confirme su asistencia y datos personales en: ccss-citas-cr.com/confirmar', type: 'notif', isBad: true, clue: '🔍 La CCSS gestiona citas en edus.ccss.sa.cr, no por Instagram' },
      { sender: 'empresa_famous_cr', name: 'Famous CR Oficial', text: 'Hola! Representamos a Famous CR y queremos regalarte productos. Para coordinarte necesitamos tu dirección exacta y número de cédula.', type: 'dm', isBad: true, clue: '🔍 Las marcas reales coordinan colaboraciones por correo oficial, no por DM' },
      { sender: 'vecino_nuevo_ig', name: 'Comunidad Los Robles', text: '📢 Comunicado urgente de la comunidad: hay un delincuente suelto en el barrio. Comparte la foto y datos: [link sospechoso]', type: 'feed', isBad: true, clue: '🔍 Compartir fotos y datos de personas sin verificar puede ser ilegal y peligroso' },
    ]
  },

  perm: {
    id: 'perm', name: 'PermBot', label: 'Permisos excesivos', emoji: '🔑',
    description: 'Apps que piden acceso innecesario a tus datos',
    clues: ['Permisos innecesarios', 'App desconocida', 'Promesa extravagante'],
    damage: 15,
    messages: [
      { sender: 'filtros_pro_app', name: 'FiltrosPro App', text: '✨ 50 filtros premium GRATIS. Para activarlos conectá tu Instagram y dale acceso completo: publicar, ver mensajes, acceder a seguidores.', type: 'notif', isBad: true, clue: '🔍 Una app de filtros NO necesita leer tus mensajes' },
      { sender: 'gana_seguidores_app', name: 'GanaSeguidores+', text: '📈 1000 seguidores reales en 24h garantizados. Solo conectá tu cuenta con nuestra app con acceso total de administrador.', type: 'dm', isBad: true, clue: '🔍 Acceso total = control completo de tu cuenta por terceros' },
      { sender: 'horoscopo_app_gratis', name: 'HoróscOpo Digital', text: '⭐ Horóscopo personalizado gratis. Para calcularlo necesitamos acceso a tu lista de contactos, fotos y mensajes privados.', type: 'feed', isBad: true, clue: '🔍 Un horóscopo no necesita tus mensajes ni fotos' },
      { sender: 'edita_fotos_ia_gratis', name: 'EditaIA Pro', text: '🎨 Editor con IA, gratis para siempre. Para sincronizar necesita acceso a cámara, galería, contactos, micrófono y ubicación en tiempo real.', type: 'notif', isBad: true, clue: '🔍 Un editor de fotos no necesita tus contactos ni ubicación' },
      { sender: 'musica_gratis_app', name: 'MúsicaFree CR', text: '🎵 Música sin anuncios gratis. Conectá con tu cuenta de Instagram para activar. También necesita acceso a tus mensajes para personalizar listas.', type: 'dm', isBad: true, clue: '🔍 Una app de música no necesita leer tus mensajes de Instagram' },
      { sender: 'calcula_iq_gratis', name: 'Test de IQ Gratis', text: '🧩 Calculá tu IQ real en 5 min. Para guardar el resultado necesitás registrarte con acceso completo a tu cuenta de Instagram o Facebook.', type: 'notif', isBad: true, clue: '🔍 Guardar un resultado no requiere acceso completo a tu cuenta' },
      { sender: 'test_personalidad_ig', name: 'Test Personalidad', text: '🧠 ¿Cuál es tu superpoder? Descubrilo con nuestro test. Solo necesita acceso completo a tu perfil de Instagram para analizar tu personalidad.', type: 'feed', isBad: true, clue: '🔍 Un test de personalidad no necesita acceso completo a tu perfil' },
      { sender: 'traductor_ia_app', name: 'TraductorIA CR', text: '🌐 Traductor con IA, gratis. Para funcionar correctamente necesita acceso a tu galería, micrófono, cámara, ubicación y contactos de Instagram.', type: 'notif', isBad: true, clue: '🔍 Un traductor no necesita acceso a tus contactos de Instagram' },
      { sender: 'app_dieta_gratis', name: 'DietaIA Gratis', text: '🥗 Plan de dieta personalizado con IA. Para calcularlo necesita tu historial de mensajes de Instagram para analizar tus hábitos alimenticios.', type: 'dm', isBad: true, clue: '🔍 Una app de dieta no necesita leer tus mensajes privados' },
      { sender: 'alarma_inteligente', name: 'AlarmaIA Pro', text: '⏰ Alarma con IA que aprende tus hábitos. Para configurarse necesita acceso 24/7 a tu ubicación, micrófono y cámara en segundo plano.', type: 'notif', isBad: true, clue: '🔍 Una alarma no necesita acceso continuo a cámara y micrófono' },
      { sender: 'wallpapers_premium', name: 'Wallpapers 4K CR', text: '🖼️ Miles de wallpapers gratis. Para personalizar tu experiencia necesita acceso a tus fotos, contactos y mensajes para sugerir los mejores.', type: 'feed', isBad: true, clue: '🔍 Una app de fondos de pantalla no necesita tus contactos ni mensajes' },
    ]
  }
};

// ============================================================
// MENSAJES LEGÍTIMOS — 25+ variados y realistas
// ============================================================
const LEGIT_MESSAGES = [
  { sender: 'sofia_valverde', name: 'Sofía Valverde', text: 'Oye! Viste el partido de ayer? Qué gol el del minuto 89 jaja', type: 'dm', isBad: false },
  { sender: 'david.m.cr', name: 'David M.', text: 'Cuándo es la tarea de ciencias? No la anoté 😅', type: 'dm', isBad: false },
  { sender: 'foto.momentos.cr', name: 'Momentos CR', text: '📸 Amanecer desde el Irazú hoy. Qué belleza de país 🌋 #CostaRica', type: 'feed', isBad: false },
  { sender: 'recetas.ticas', name: 'Recetas Ticas', text: 'Gallo pinto con natilla, huevo y plátano maduro. El desayuno perfecto ☀️', type: 'feed', isBad: false },
  { sender: 'amiga_laura', name: 'Laura F.', text: 'Jajaja me acordé del chiste que contaste el viernes. Todavía me río 😂', type: 'dm', isBad: false },
  { sender: 'club_lectura_cr', name: 'Club de Lectura CR', text: '📚 Recordatorio: reunión del club este sábado 3pm en la biblioteca!', type: 'notif', isBad: false },
  { sender: 'futbol_barrio', name: 'Fútbol del Barrio', text: '⚽ Confirmados para el partido del domingo? Necesito saber cuántos van.', type: 'dm', isBad: false },
  { sender: 'jorge_clase', name: 'Jorge (clase)', text: 'Bro me prestás el apunte de historia? Es que falté el martes', type: 'dm', isBad: false },
  { sender: 'mama_real', name: 'Mamá', text: '¿A qué hora llegás hoy? Hice arroz con leche 😊', type: 'dm', isBad: false },
  { sender: 'fotografia_cr', name: 'Fotografía CR', text: '🌅 La lluvia dejó este arcoíris doble en San José. Increíble!', type: 'feed', isBad: false },
  { sender: 'biblioteca_nacional', name: 'Biblioteca Nacional CR', text: '📖 Taller gratuito de escritura creativa este sábado 10am. Inscripción: sinabi.go.cr', type: 'notif', isBad: false },
  { sender: 'compañero_pablo', name: 'Pablo R.', text: 'Llegaste a ver el capítulo de anoche? No le cuentes el final a nadie jajaja', type: 'dm', isBad: false },
  { sender: 'ciencia_tica', name: 'Ciencia Tica', text: '🔬 Investigadores de la UCR publicaron nuevo estudio sobre biodiversidad costarricense. ucr.ac.cr/noticias', type: 'feed', isBad: false },
  { sender: 'municipalidad_sj', name: 'Municipalidad SJ', text: '🛣️ Cierre temporal de Av. Central mañana 8am-12pm por mantenimiento. Use rutas alternas.', type: 'notif', isBad: false },
  { sender: 'prima_ana_real', name: 'Ana (prima)', text: 'Para las vacaciones de diciembre ¿vienen a Liberia? Mi mamá ya empezó a planear el asado jaja', type: 'dm', isBad: false },
  { sender: 'noticias_ucr', name: 'UCR Noticias', text: '🎓 La UCR abre 200 nuevas becas para estudiantes de secundaria. Más info: becas.ucr.ac.cr', type: 'feed', isBad: false },
  { sender: 'amigo_kevin', name: 'Kevin S.', text: 'Bro te veo en el recreo? Tengo que contarte algo del proyecto', type: 'dm', isBad: false },
  { sender: 'noticias_deportes_cr', name: 'Deportes CR', text: '⚽ La Sele clasificó a cuartos! El partido de vuelta es el próximo martes.', type: 'feed', isBad: false },
  { sender: 'vecino_mario', name: 'Mario (vecino)', text: 'Profe, dejó la luz encendida del carro esta mañana. Ya la apagué yo.', type: 'dm', isBad: false },
  { sender: 'grupo_proyecto_bio', name: 'Proyecto Biología', text: 'Recuerden que la presentación es el jueves. Andrea trae el cartel, yo llevo la laptop.', type: 'notif', isBad: false },
  { sender: 'tienda_libros_ucr', name: 'Librería UCR', text: '📚 Llegaron los libros de texto del segundo semestre. Pasen a recoger los que reservaron.', type: 'notif', isBad: false },
  { sender: 'museo_jade_cr', name: 'Museo del Jade CR', text: '🏛️ Este fin de semana entrada gratis para estudiantes con carné. No se lo pierdan!', type: 'feed', isBad: false },
  { sender: 'hermano_menor', name: 'Hermano', text: 'Cuando llegás a casa? Mamá dice que la cena está lista', type: 'dm', isBad: false },
  { sender: 'parques_nacionales_cr', name: 'SINAC Costa Rica', text: '🌿 Aviso: el sendero Crestones en el Chirripó estará cerrado del 15 al 20 de este mes por mantenimiento.', type: 'feed', isBad: false },
  { sender: 'amiga_valeria_real', name: 'Valeria M.', text: 'Oye viste que pusieron una nueva heladería en el centro? Dicen que está buenísima', type: 'dm', isBad: false },
  { sender: 'radio_nacional_cr', name: 'Radio Nacional CR', text: '🎙️ Esta noche en el programa especial: entrevista con jóvenes emprendedores de Costa Rica. 7pm en vivo.', type: 'feed', isBad: false },
  { sender: 'amigo_jose_real', name: 'José A.', text: 'Bro te presto el cargador mañana. Lo dejé en casa hoy', type: 'dm', isBad: false },
];

function getAvatarColor(name) {
  let hash = 0;
  for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return BOT_COLORS[Math.abs(hash) % BOT_COLORS.length];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateMessageQueue() {
  const botMessages = [];
  Object.values(BOTS).forEach(bot => {
    bot.messages.forEach(msg => {
      botMessages.push({ ...msg, botType: bot.id, botLabel: bot.label, damage: bot.damage });
    });
  });
  const legitMessages = LEGIT_MESSAGES.map(m => ({ ...m, botType: null, damage: 0, clue: null }));
  return shuffle([...botMessages, ...legitMessages]);
}
