# Journal del Challenge — FX Replay Growth Engineer

Log de decisiones, trade-offs y rationale. Sirve como material para la defensa técnica de 60 min donde nos van a preguntar el "por qué" de cada decisión. Cada entry: qué se decidió, por qué, qué alternativas consideramos, qué descartamos.

Actualizar cada vez que tomamos una decisión no trivial. No documentar acciones triviales (typos, refactors chicos).

---

## 2026-08-30 · Sesión 1 · Discovery y setup

### Contexto inicial y foco del challenge

**Decidido:** foco explícito en growth. Delegación de implementación a Claude. Agustina toma decisiones de arquitectura, tooling, marketing, copy, y trade-offs.

**Por qué:** el challenge dice explícitamente "smaller thoughtfully executed solution is more valuable than a large implementation with unnecessary complexity". Evalúa trade-offs, no completeness. Además el rol es Growth Engineer — el diferenciador es el pensamiento de growth, no la calidad del CSS.

**Alternativas descartadas:** intentar cubrir todos los deliverables al mismo nivel de profundidad → riesgo de que ninguno quede sobresaliente en las 6h.

---

### Auditoría del producto actual de FX Replay

**Hecho:** revisamos el signup flow actual de fxreplay.com (vía screenshots en Figma que ya tenía Agustina + navegación mental del producto). Identificamos 10 fricciones críticas y las anotamos como post-its en el Figma con lenguaje accionable para poder mostrar al equipo de FX Replay durante la defensa.

**Findings clave (ordenados por impacto en drop-off):**
1. Landing sin outcome claro, sin CTA above the fold, sin trust signals.
2. Hero sin producto, copy genérico.
3. Pricing gate inmediato después del signup + números rotos (bug de conversión ARS→USD).
4. 🚨 **Mayor leak:** el "free" dispara un modal de Chargebee con lenguaje 100% de cobro ("Complete your order", "Subscribe", billing address obligatoria).
5. Bug de moneda confirmado en la subscribe page.
6. Post-signup: 3 overlays simultáneos + modal de compromiso antes de dar valor = cognitive overload.
7. Bug de interacción en carousel de features.
8. CTA no persistente + exceso de texto.
9. Language switcher en sign-in cambia moneda, no idioma.
10. Pricing sin plan recomendado — jerarquía visual plana.

**Por qué esto importa para el challenge:** el business objective es aumentar la conversión de marketing → cuenta creada. La auditoría nos permite armar una narrativa concreta ("estas son las fricciones reales que atacamos") en lugar de un pitch genérico de landing.

---

### Norte narrativo del challenge

**Decidido:** "Try FX Replay Free" es una experiencia de marketing que convierte tráfico → cuenta gratuita **eliminando la fricción que hoy sabotea el free actual**. Tres pilares:
1. Copy orientado a **outcome** (qué gana el usuario), no a features.
2. El "free" **se siente free**: no menciona precio ni tarjeta, no dispara Chargebee, no pide billing.
3. Signup en el mínimo número de pasos posibles con confirmación clara de qué se desbloqueó.

**Por qué:** los 10 findings del audit convergen en tres causas raíz (copy genérico, Chargebee en free path, retención antes de valor). Atacar esas tres es más medible y defendible que "una landing más linda".

---

### Stack técnico

**Decidido:**
- **Framework:** Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- **Deploy:** Vercel.
- **Persistencia:** Notion vía MCP (setup) + SDK oficial (runtime) con storage adapter pattern. Fallback in-memory si no hay `NOTION_TOKEN`.
- **Analytics:** PostHog con wrapper thin (fallback a `console.log` si no hay key).
- **Feature flags:** PostHog para el A/B.

**Por qué Next.js:** SSR/SSG nativo (bueno para SEO y CWV), API routes para el backend, Vercel deploy en 1 click, match natural con lo que probablemente usa FX Replay.

**Por qué Notion + MCP:** el challenge menciona Notion explícitamente como opción y pide "MCP con valor real". Usar MCP para gestión de la DB (crear schema, inspeccionar durante debugging) + SDK para runtime es un uso maduro y honesto. Además el reviewer puede ver los signups en tiempo real en Notion — evidencia end-to-end del flujo funcionando.

**Por qué PostHog:** una sola herramienta para eventos + funnels + feature flags. Menos setup que GA4 + GTM + GrowthBook. Free tier suficiente.

**Por qué storage adapter (Notion + in-memory):** el reviewer puede clonar y correr `npm run dev` sin credenciales — el adapter cae a in-memory. En Vercel con `NOTION_TOKEN`, usa Notion. Muestra pensamiento en swappability y testeo local — que es lo que evalúan.

**Trade-off asumido:** no usamos Postgres/Supabase. Con más tiempo y prod real, moveríamos a Postgres — Notion no escala a millones de rows y tiene rate limits. Documentado en trade-offs.md.

---

### Scope del challenge

**IN (construimos):**
- Landing `/` con hero + features + trust signals + sticky CTA.
- Signup `/signup` con Google + email/password, one-step, sin billing.
- Welcome `/welcome` — confirmación de lo desbloqueado, sin commitment device.
- Users API (POST, PATCH, GET) con storage adapter.
- Analytics instrumentado + funnel + taxonomy tipada.
- 1 experimento A/B implementado con feature flag.
- Docs: architecture, analytics, experiment, performance, ai-workflow, trade-offs.

**OUT (documentamos pero no construimos):**
- Auth real (sessions, email verification, password reset).
- Chargebee integration en el free path — decisión de producto explícita: Chargebee solo entra si el usuario opta a un plan pago desde el app.
- Rediseño de la landing actual de fxreplay.com — construimos una **nueva** landing dedicada al free tier.
- Producto core (backtesting engine, sessions, etc.).
- Tests automatizados (excepto quizás 1 smoke test del adapter).

**Por qué el scope OUT es explícito:** el challenge evalúa prioritización y trade-offs. Escribir qué NO hacemos es tan importante como qué sí — deja claro que fue decisión consciente, no olvido.

---

### Fuente de verdad del producto

**Decidido:** cuando dude qué hace el producto o cómo describir una feature, la fuente es **fxreplay.com**. No inventar features ni claims.

**Por qué:** construimos una landing para un producto real. Si mentimos sobre features, la landing es literatura, no growth. Además el reviewer conoce su producto — cualquier claim inventado se cae en la defensa.

---

### Arquitectura AI-native

**Decidido:** 3 agents + 1 skill + 1 command + 3 MCPs.

**Agents (`.claude/agents/`):**
- `copy-critic` — evalúa copy user-visible contra criterios growth informados por el audit.
- `a11y-reviewer` — revisa WCAG 2.1 AA.
- `analytics-guardian` — verifica que doc/tipo/código de analytics no drifteen.

**Skill (`.claude/commands/add-tracked-event.md`):** dado nombre + trigger + props, actualiza `lib/analytics/events.ts` + `docs/analytics.md` + muestra snippet de `track()`. Verifica que compile.

**Command (`.claude/commands/audit-experience.md`):** fan-out en paralelo de los 3 agents sobre una surface (landing/signup/welcome), consolida el reporte por severidad.

**MCPs activos:**
- Figma (leer brand kit + post-its del audit).
- Notion (crear DB de signups + inspeccionar rows).
- Chrome (testear deploy en vivo, screenshots para docs).

**Por qué no más agents:** propuse 3 en vez de 6 para evitar overhead. Perf y SEO se cubren con Lighthouse en docs, no necesitan agent dedicado. Trade-off explícito: menos coverage automatizada, más consistencia por agent.

**Por qué esta skill y no otra:** el bug #1 de analytics en producto real es drift entre doc y código. `add-tracked-event` fuerza que ambos se muevan juntos. Ejemplo real de "sistema alrededor de AI" — no es AI escribiendo código, es AI aplicando una regla de calidad.

---

### Repo structure

**Decidido:** todo en la raíz de `/Users/agustinacassi/Documents/FX-REPLAY-CHALLENGE/`. `challenge-instructions/` queda como referencia. `.claude/`, `brand-kit/`, `docs/`, código Next.js, todo junto.

**Por qué:** un solo repo, un solo deploy, menos fricción. La subcarpeta separada agrega complejidad sin valor.

---

### Notion database

**Decidido:** creamos una página top-level "FX Replay Challenge" en el workspace de Agustina, con una database "Signups" adentro. Columnas: `email`, `name`, `provider`, `variant`, `created_at`, `signup_source`.

**Por qué:** agrupa todo el contexto en un lugar. La database "Signups" es lo que la Users API escribe. Cada row = un signup real (o de test) capturado end-to-end.

---

## 2026-08-30 · Sesión 2 · Scaffold, storage y API

### Scaffold Next.js hecho manual

**Decidido:** scaffold manual de Next.js (package.json + tsconfig + tailwind + postcss + globals) en lugar de `create-next-app`.

**Por qué:** `create-next-app` rechazó el nombre `FX-REPLAY-CHALLENGE` por tener mayúsculas (restricción npm). En vez de renombrar la carpeta o crear una subcarpeta (rompía "todo en la raíz"), pusimos un `name: "fx-replay-growth-challenge"` válido en package.json y armamos el resto de la config a mano. Ventaja lateral: control total, sin flags/prompts sorpresivos de la CLI, menos artefactos de placeholder que borrar.

### tokens.css inexistente en el brand kit — reconstruido

**Encontrado:** el `brand-kit/README.md` referencia `tokens/tokens.css` y `tokens/tokens.json` como "for engineers", pero esos archivos NO están en el hand-off del challenge — solo hay `brand-kit.html`, `README.md` y `/logos/`.

**Decidido:** reconstruimos `brand-kit/tokens/tokens.css` extrayendo los valores del CSS inline del `brand-kit.html` y siguiendo el naming convention semántico que menciona el README (`--bg-primary`, `--text-primary`, `--border-brand`, etc.). Doble tier: 44 primitives (raw hex) + semantic aliases.

**Por qué:** cero hex literales es constraint duro; sin `tokens.css` no podíamos cumplirlo. Reconstruirlo es más honesto que hardcodear valores en Tailwind.

**Trade-off:** los valores exactos y los nombres de semantic tokens son inferidos, no oficiales de FX Replay. Si en la revisión nos dicen que su tokens.css real usa otros nombres, el remap es de 1 archivo. Anotado como riesgo en `docs/trade-offs.md` (a escribir).

### Fonts vía next/font

**Decidido:** `next/font/google` para Lato + Nunito Sans con `variable: '--font-heading'` y `--font-body`, expuestas como CSS custom props para que el resto del sistema (tokens.css, Tailwind) las use sin acoplarse a next/font.

**Por qué:** self-host automático, elimina layout shift (FOUT/FOIT), no cuenta como third-party script. Combinado con tokens hace que la switch de font sea 1 línea.

### Storage adapter pattern

**Decidido:** interfaz `UserStorage` en `lib/storage/types.ts`, dos implementaciones (`InMemoryStorage`, `NotionStorage`), factory `getStorage()` que elige según `NOTION_TOKEN + NOTION_SIGNUPS_DB_ID`. Cache singleton por proceso.

**Por qué:**
- El reviewer puede `git clone && npm run dev` sin credenciales — cae a in-memory. Cero fricción.
- En Vercel con env vars, va a Notion real. Rows visibles en el workspace del challenge.
- Testeable — la interfaz permite mock trivial si en algún momento agregamos tests.

**Errores tipados:** `EmailAlreadyExistsError`, `UserNotFoundError` — el handler central los mapea a 409/404 con envelope consistente. Fail fast cuando el email ya existe, no upsert silencioso.

### API contract y validación

**Decidido:** Zod para validar body y query. Envelope de error único: `{ error: { code, message, details? } }`. Mapping:
- 400 `validation_error` (Zod)
- 409 `email_already_exists`
- 404 `user_not_found`
- 500 `internal_error`

Endpoints:
- `POST /api/users` — crea. Devuelve `{ user }`, 201.
- `GET /api/users?limit=&cursor=` — lista, newest first, cursor-based (compatible con paginación de Notion).
- `PATCH /api/users/[id]` — update parcial. Rechaza body vacío.

**Por qué envelope consistente:** el frontend siempre puede parsear el error con la misma shape. Los `code` machine-readable permiten distinguir "email duplicado" (mostrar mensaje amigable) de "error del servidor" (retry).

**Por qué no rate limiting ahora:** en scope del challenge no tiene sentido — no hay tráfico real. Documentar en trade-offs que en prod agregaríamos limiter en Vercel Middleware por IP + Cloudflare o Vercel WAF.

---

## 2026-08-30 · Sesión 2 · Git + hooks + checkpoint

### Repo git

**Decidido:** repo GitHub **privado** con nombre `fx-replay-growth-challenge`. Al submit se invitan los reviewers como collaborators.

**Por qué privado:** evita que el trabajo circule antes de la defensa técnica. El challenge no tiene NDA visible pero sí es material sobre auditoría de un producto real de FX Replay.

### Hook de typecheck automático

**Decidido:** `.claude/settings.json` con `PostToolUse` que corre `npx tsc --noEmit --incremental` después de cada `Edit`/`Write`/`MultiEdit` sobre archivos `.ts`/`.tsx`/`.mts`/`.cts`. Si hay errores, salen inline en el turno de Claude para arreglar antes de seguir.

**Por qué:** atrapa errores en el momento en que los generamos, no al final. Con `--incremental` usa cache y no penaliza mucho (~2-5s por edición).

**Trade-off:** el hook no corre linter en cada edición (solo typecheck). El lint queda en `/checkpoint` para no acumular ruido en cada save. Si aparece necesidad, se agrega.

### Skill `/checkpoint`

**Decidido:** `.claude/commands/checkpoint.md` — comando que:
1. Corre typecheck + lint. Si falla, aborta.
2. Muestra diff-stat + status.
3. Genera mensaje conventional-commit basado en el diff.
4. Pide OK al usuario.
5. Commit (sin push automático).

**Por qué:** enforce que no se commitea código roto, mensajes consistentes, deja audit trail limpio (útil para la defensa: "acá está el orden en que decidí construir"). Además el reviewer puede leer git log y entender el progreso.

**Trade-off:** no hace push automático — decisión explícita. Push es reversible menos veces que commit; que sea deliberado.

### Estructura de settings

- `.claude/settings.json` — **committed**, hooks + config compartida.
- `.claude/settings.local.json` — **gitignored**, permissions personales de Agustina en su máquina.

Convención estándar de Claude Code — evita meter el "allow list" personal en el repo público de deliverables.

---

## Filosofía de trabajo (recordatorio permanente)

- **No sobreingeniería.** Cumplir lo que pide el challenge, con foco. Cero "por las dudas".
- **Explicar antes de decidir arquitectura/tooling/producto.** Delegar la implementación.
- **Trade-offs son parte del deliverable.** Cada decisión no obvia va documentada acá o en `docs/trade-offs.md`.
- **Brand kit es constraint dura.** Cero hex literales, cero fonts que no sean Lato/Nunito Sans.
- **Comunicación en español.** Código y docs en inglés (reviewers son English-speaking).
