# SocialSurvivor 🎮
### Experimento de Ciberseguridad — Feria Científica Nacional

---

## ¿Qué es?
Plataforma web multijugador donde los participantes deben sobrevivir 2 minutos en una red social simulada llena de bots maliciosos. Diseñada como experimento científico para medir el aprendizaje en ciberseguridad.

---

## Archivos del proyecto
```
index.html   — Estructura y pantallas del juego
style.css    — Diseño visual (tema oscuro tipo Instagram)
bots.js      — Los 5 tipos de bots y sus mensajes
quiz.js      — Cuestionario pre y post (mide aprendizaje)
game.js      — Lógica del juego, lobby y panel admin
```

---

## Cómo publicar gratis (paso a paso)

### Opción 1: GitHub Pages (recomendado)
1. Crea una cuenta en github.com
2. Crea un repositorio nuevo (público)
3. Sube todos los archivos
4. Ve a Settings → Pages → Source: main branch
5. Tu link será: https://TU_USUARIO.github.io/NOMBRE_REPO

### Opción 2: Netlify (más fácil)
1. Ve a netlify.com
2. Arrastra la carpeta del proyecto al área de deploy
3. Obtienes un link público instantáneo

### Opción 3: Vercel
1. Ve a vercel.com
2. Conecta tu GitHub
3. Deploy automático

---

## Activar modo multijugador real (Firebase)

El juego funciona sin Firebase (modo demo), pero para el experimento
grupal necesitas Firebase para sincronizar jugadores en tiempo real.

### Pasos:
1. Ve a console.firebase.google.com
2. Crea un proyecto nuevo (gratis)
3. Ve a Realtime Database → Crear base de datos
4. Copia tu configuración
5. En game.js, reemplaza el objeto `firebaseConfig` con tus datos:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  databaseURL: "https://TU_PROYECTO-default-rtdb.firebaseio.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_ID",
  appId: "TU_APP_ID"
};
```

6. Cambia `useDemoMode: true` a `useDemoMode: false` en el estado inicial

### Reglas de seguridad en Firebase:
Pega estas reglas en Realtime Database → Rules:
```json
{
  "rules": {
    "lobbies": { ".read": true, ".write": true },
    "results": { ".read": true, ".write": true }
  }
}
```

---

## Contraseña del investigador
Por defecto: `feria2025`
Cámbiala en game.js: `const ADMIN_PASSWORD = 'TU_CONTRASEÑA';`

---

## Cómo usar en la feria

### Experimento individual:
1. Comparte el link público
2. Los participantes responden quiz → juegan → quiz post
3. Compara las respuestas antes vs después

### Experimento grupal (salón completo):
1. Tú entras por "Panel del investigador"
2. Comparte el link con el código de sala en el proyector
3. Todos se unen a la sala de espera
4. Cuando todos estén listos, presiona "Iniciar juego para todos"
5. Todos juegan al mismo tiempo
6. Exporta resultados en CSV para análisis

---

## Metodología científica

**Pregunta de investigación:**
¿Puede un entorno gamificado de simulación de ciberataques mejorar la capacidad de estudiantes de secundaria para identificar amenazas en redes sociales?

**Variables:**
- Independiente: Exposición al juego SocialSurvivor
- Dependiente: Puntaje en cuestionario de identificación de amenazas
- Control: Conocimiento previo medido en quiz pre

**Análisis:**
Compara las respuestas correctas del quiz PRE vs POST.
Un aumento significativo confirma la hipótesis.

---

Desarrollado con HTML + CSS + JavaScript vanilla + Firebase
No requiere instalación, corre en cualquier navegador.
