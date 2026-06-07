// ============================================================
// QUIZ.JS v2 — Banco de preguntas ampliado, 5 aleatorias cada vez
// ============================================================

const QUESTION_BANK_PRE = [
  {
    id: 'p1',
    text: '¿Qué harías si recibes un DM de "Instagram Soporte" pidiendo verificar tu contraseña?',
    options: ['La ingreso si parece oficial', 'Nunca doy mi contraseña a nadie por DM', 'La doy solo si tiene verificación azul', 'Depende de la urgencia del mensaje'],
    correct: 1
  },
  {
    id: 'p2',
    text: '¿Cuál de estas URLs es claramente sospechosa?',
    options: ['instagram.com/login', 'insta-gram-verify.co/cuenta', 'support.instagram.com', 'help.meta.com'],
    correct: 1
  },
  {
    id: 'p3',
    text: 'Una app pide acceso a tus mensajes privados para darte filtros gratis. ¿Qué haces?',
    options: ['Acepto, si son gratis vale la pena', 'Rechazo — los filtros no necesitan leer mis mensajes', 'Acepto solo si tiene buenas reseñas', 'Lo pienso y tal vez acepto'],
    correct: 1
  },
  {
    id: 'p4',
    text: '¿Con qué frecuencia recibes mensajes sospechosos en redes sociales?',
    options: ['Nunca', 'Raramente (1 vez al mes)', 'A veces (1 por semana)', 'Casi todos los días'],
    correct: -1
  },
  {
    id: 'p5',
    text: '¿Alguna vez hiciste clic en un link que resultó ser falso?',
    options: ['No, nunca', 'Sí, una vez', 'Sí, varias veces', 'No estoy seguro/a'],
    correct: -1
  },
  {
    id: 'p6',
    text: 'Alguien que dice ser tu amigo/a te pide el código de 6 dígitos que llegó a tu celular. ¿Qué haces?',
    options: ['Lo envío si confío en esa persona', 'NUNCA — ese código controla mi cuenta', 'Lo envío si me explica bien para qué', 'Depende de la persona'],
    correct: 1
  },
  {
    id: 'p7',
    text: '¿Qué es el "phishing"?',
    options: ['Un deporte acuático', 'Engaño mediante links o mensajes falsos para robar datos', 'Un tipo de virus informático', 'Una técnica de programación'],
    correct: 1
  },
  {
    id: 'p8',
    text: 'Recibes un post viral que dice "comparte antes de que lo borren". ¿Qué haces?',
    options: ['Lo comparto de inmediato, podría ser importante', 'Busco la fuente oficial antes de compartir', 'Lo comparto solo con familia', 'Depende del tema'],
    correct: 1
  },
  {
    id: 'p9',
    text: '¿Cuál es una señal de que una cuenta de Instagram es falsa?',
    options: ['Tiene muchas fotos', 'Fue creada hace poco y tiene pocas publicaciones', 'Publica todos los días', 'Tiene seguidores de otros países'],
    correct: 1
  },
  {
    id: 'p10',
    text: '¿Los bancos pueden pedirte el número de tarjeta por Instagram?',
    options: ['Sí, si hay una emergencia', 'No, los bancos NUNCA hacen eso', 'Sí, si el mensaje parece oficial', 'Solo si el banco tiene cuenta verificada'],
    correct: 1
  },
  {
    id: 'p11',
    text: 'Una "influencer" te ofrece participar en su sorteo si le das tu contraseña para "verificar". ¿Qué haces?',
    options: ['Se la doy, quiero ganar', 'Me niego — ningún sorteo legítimo necesita tu contraseña', 'Se la doy si tiene muchos seguidores', 'Depende del premio'],
    correct: 1
  },
  {
    id: 'p12',
    text: '¿Qué significa "ingeniería social" en ciberseguridad?',
    options: ['Construir redes sociales desde cero', 'Manipular psicológicamente a personas para obtener información', 'Programar algoritmos para redes sociales', 'Diseñar interfaces de usuario'],
    correct: 1
  },
  {
    id: 'p13',
    text: 'Recibes un aviso de que ganaste un iPhone. ¿Qué probabilidad le das de que sea real?',
    options: ['Alta — podría ser mi suerte', 'Muy baja — casi siempre es phishing', 'Depende de si el mensaje es bonito', 'Alta si llega por DM oficial'],
    correct: 1
  },
  {
    id: 'p14',
    text: '¿Qué deberías hacer si recibes un mensaje de emergencia de un familiar desde una cuenta desconocida?',
    options: ['Responder de inmediato y ayudar', 'Llamar directamente a ese familiar para verificar', 'Ignorar el mensaje completamente', 'Enviar la ayuda y luego verificar'],
    correct: 1
  },
  {
    id: 'p15',
    text: '¿Cuál es el método más seguro para reportar contenido falso en una red social?',
    options: ['Publicar sobre ello para advertir a otros', 'Usar el botón de reporte dentro de la plataforma', 'Enviar un DM al autor del contenido', 'Compartir con familiares para que ellos reporten'],
    correct: 1
  }
];

const QUESTION_BANK_POST = [
  {
    id: 'post1',
    text: 'Después de jugar, ¿cuál es la señal MÁS importante para identificar un mensaje falso?',
    options: ['Si el usuario tiene foto de perfil', 'URLs sospechosas, urgencia exagerada, petición de datos', 'Si el mensaje está en mayúsculas', 'Si llegó de noche'],
    correct: 1
  },
  {
    id: 'post2',
    text: '¿Qué tipo de ataque te pareció MÁS difícil de identificar en el juego?',
    options: ['Phishing (links falsos)', 'Ingeniería social (hacerse pasar por conocido)', 'Desinformación (noticias falsas)', 'Permisos excesivos de apps'],
    correct: -1
  },
  {
    id: 'post3',
    text: '¿Qué tan seguro/a te sientes ahora para identificar ataques en redes sociales reales?',
    options: ['Igual que antes del juego', 'Un poco más seguro/a', 'Bastante más seguro/a', 'Muy seguro/a — sé exactamente qué buscar'],
    correct: -1
  },
  {
    id: 'post4',
    text: 'Si ahora mismo recibes un DM pidiendo tu contraseña, ¿qué harías?',
    options: ['Dependería del contexto', 'Nunca la daría, sin importar quién pregunte', 'La daría si la cuenta parece oficial', 'Primero preguntaría por qué la necesitan'],
    correct: 1
  },
  {
    id: 'post5',
    text: '¿Aprendiste algo nuevo sobre ciberseguridad jugando?',
    options: ['No, ya sabía todo', 'Sí, aprendí 1-2 cosas nuevas', 'Sí, aprendí bastante', 'Sí, aprendí muchísimo — no sabía nada'],
    correct: -1
  },
  {
    id: 'post6',
    text: '¿Le contarías a alguien sobre lo que aprendiste hoy?',
    options: ['No', 'Tal vez a 1 persona', 'Sí, a amigos o familia', 'Sí, a muchas personas'],
    correct: -1
  },
  {
    id: 'post7',
    text: 'Un bot de ingeniería social se hace pasar por tu mamá. ¿Cómo lo detectas?',
    options: ['Por la foto de perfil', 'Llamando directamente a tu mamá para verificar', 'Por la forma de escribir', 'Preguntando algo solo ella sabría'],
    correct: 1
  },
  {
    id: 'post8',
    text: '¿Qué harías si ves una noticia viral sin fuente oficial?',
    options: ['La comparto si me parece importante', 'Busco en medios confiables antes de creer o compartir', 'La comparto solo con familia', 'La ignoro siempre'],
    correct: 1
  }
];

// Estado del quiz
const quizAnswers = { pre: {}, post: {} };
let selectedPreQuestions = [];
let selectedPostQuestions = [];

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function renderQuiz(questions, containerId, phase) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = questions.map((q, i) => `
    <div class="quiz-question" id="qq-${phase}-${q.id}">
      <p><strong>${i + 1}.</strong> ${q.text}</p>
      <div class="quiz-options">
        ${q.options.map((opt, j) => `
          <button class="quiz-option"
            onclick="selectOption('${phase}','${q.id}',${j},${q.correct},this)"
            data-index="${j}">${opt}</button>
        `).join('')}
      </div>
    </div>
  `).join('');
  checkQuizComplete(phase, questions);
}

function selectOption(phase, qId, index, correct, btn) {
  const qqEl = document.getElementById(`qq-${phase}-${qId}`);
  qqEl.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  quizAnswers[phase][qId] = { selected: index, correct };
  checkQuizComplete(phase, phase === 'pre' ? selectedPreQuestions : selectedPostQuestions);
}

function checkQuizComplete(phase, questions) {
  const answered = Object.keys(quizAnswers[phase]).length;
  if (phase === 'pre') {
    const btn = document.getElementById('btn-start-game');
    if (btn) btn.style.display = answered >= questions.length ? 'block' : 'none';
  }
}

function initPreQuiz() {
  selectedPreQuestions = pickRandom(QUESTION_BANK_PRE, 5);
  renderQuiz(selectedPreQuestions, 'quiz-pre-questions', 'pre');
  if (typeof preloadAllImages === 'function') preloadAllImages();
}

function initPostQuiz() {
  selectedPostQuestions = pickRandom(QUESTION_BANK_POST, 5);
  renderQuiz(selectedPostQuestions, 'quiz-post-questions', 'post');
}

function getQuizScore(phase) {
  const questions = phase === 'pre' ? selectedPreQuestions : selectedPostQuestions;
  let correct = 0, total = 0;
  questions.forEach(q => {
    if (q.correct >= 0 && quizAnswers[phase][q.id] !== undefined) {
      total++;
      if (quizAnswers[phase][q.id].selected === q.correct) correct++;
    }
  });
  return { correct, total };
}
