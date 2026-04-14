# HQ Kids — Prompt para Design (Google Stitch)

## Diretrizes Gerais de Design

Design a complete mobile app called **HQ Kids — Tarefas em Família**. Premium Apple-style design — clean, light, spacious, with a **vibrant neon green (#39FF14) as the dominant accent color** on bright white/light surfaces. The aesthetic is modern, energetic, and playful — like an Apple Health or Fitness app redesigned for kids with electric green energy throughout. Think **crisp white backgrounds, soft shadows, glass cards, and neon green pops that feel alive and pulsating**.

The app has two modes: **Parent Mode** (administrative, clean with cyan accents) and **Child Mode** (gamified, vibrant neon green playground). Design all screens for iPhone 15 Pro (393x852).

### Visual Identity
- **Light, airy, Apple-clean base** with electric neon green accents that pop
- Soft white/light gray cards with subtle shadows and gentle neon green tinted borders on active elements
- Neon green glow effects ONLY on interactive/active elements (buttons, progress bars, badges) — subtle, not overwhelming
- Clean white space, generous padding, premium feel
- SF Pro typography, crisp and readable
- The neon green should feel energetic against the light background — like a highlight marker on white paper

### Color Palette
- Background primary: clean white `#FFFFFF`
- Background secondary: soft warm gray `#F8FAF9` (very subtle green undertone)
- Cards: white `#FFFFFF` with soft shadow `(0, 2, 12, rgba(0,0,0,0.06))` and optional `1px border rgba(57,255,20,0.12)` on active cards
- **Neon Green (PRIMARY)**: `#39FF14` — the hero accent color. Used for CTAs, XP bars, active states, key highlights, progress fills
- Neon Green soft: `#34D399` — for less intense green UI (secondary buttons, text links, labels)
- Neon Green tint: `rgba(57, 255, 20, 0.08)` — for subtle card/badge backgrounds
- Neon Green glow (on buttons): `0 0 16px rgba(57, 255, 20, 0.3)` — subtle green aura on primary CTAs
- Cyan (parent accent): `#06B6D4` — for parent mode highlights, links
- Purple (rewards): `#A855F7` — for reward-related UI
- Pink (young kids): `#F472B6` — for young kids mode accent
- Gold (coins): `#F59E0B` — warm amber/gold for coins and currency
- Red (streaks/errors): `#EF4444` — for errors and streak fire
- Text primary: `#111827` (near-black)
- Text secondary: `#6B7280` (medium gray)
- Text on neon green buttons: `#FFFFFF` (white, bold)
- Borders default: `#E5E7EB`, active/highlighted: `rgba(57, 255, 20, 0.3)`

### Design Principles
- Border radius: 16px for cards, 12px for inputs, 20px for pills/badges, 24px for large feature cards
- Generous padding (16-24px), lots of white space — Apple-clean
- Icons: SF Symbols style, rounded, filled — in neon green or dark gray depending on context
- Badges are pill-shaped with light tinted backgrounds (green tint, gold tint, etc.) and colored text
- Accent left borders on cards: `3px solid #39FF14` with very subtle green shadow
- No tab bar — navigation is stack-based with back arrows and action buttons
- **Interactive feel**: primary buttons have subtle neon green glow/shadow, progress bars have smooth animated fills, badges can pulse softly
- **Pulsating elements**: streak badges, XP gains, coin counts — soft breathing animation on key metrics
- Everything should feel like a premium Apple app with an energetic neon green personality

---

## SCREEN 1: Welcome / Splash

Clean, bright, inviting welcome screen. White background. Feels premium and fun.

- White background with very subtle radial gradient (center slightly warm, edges pure white)
- Large superhero emoji 🦸‍♂️ or a clean illustrated mascot with a soft neon green shadow/aura behind it
- App name **"HQ Kids"** in large bold (42px), dark text (#111827) with a subtle neon green drop shadow (`0 4px 20px rgba(57,255,20,0.15)`)
- Subtitle "Missões em família!" in gray (#6B7280)
- Two full-width rounded buttons (max 300px):
  - **"Entrar como Pai/Mãe"** — white background with cyan (#06B6D4) border, cyan text, shield icon. Clean outline style.
  - **"Entrar como Filho(a)"** — solid neon green (#39FF14) fill, white bold text, person icon, soft green glow shadow
- Both buttons have 16px border radius, bold text, icon on the left

---

## SCREEN 2: Parent Login

Clean Apple-style login form. White background.

- Title "🦸‍♂️ HQ Kids" centered, 36px bold, dark text
- Subtitle "Entrar como Pai/Mãe" in gray
- Two inputs with white background, light gray border (#E5E7EB), rounded (12px), dark text:
  - Email input with placeholder "Email" in light gray
  - Password input with placeholder "Senha" in light gray
  - Inputs get cyan border (#06B6D4) on focus
- Large solid cyan button "Entrar" — full width, rounded, white text, subtle shadow
- Toggle link below: "Não tem conta? Criar" in cyan

---

## SCREEN 3: Child Login

Same clean structure as parent login but with **neon green accent** instead of cyan.

- Back arrow top-left in neon green (#39FF14)
- Child emoji 🧒 large centered
- Title "Entrar" bold, dark text
- Subtitle "Use o email que seu pai/mãe cadastrou" in gray
- Same clean white inputs, neon green border on focus
- Solid neon green button "Entrar" — white text, green glow shadow
- Toggle link in neon green soft (#34D399)

---

## SCREEN 4: PIN Entry (Parent Security Gate)

Minimal, clean, focused. White background.

- White background
- Title "🔒 Modo Pai" centered, 28px bold, dark text
- Subtitle "Digite o PIN de 4 dígitos" in gray
- **4 dot indicators** in a row — empty circles with light gray border (#E5E7EB), filled circles in solid neon green (#39FF14). Red (#EF4444) when error.
- **Numeric keypad**: 3x4 grid of circular buttons (72px diameter), soft white background with very light shadow. Dark numbers. Each key gets subtle green tint background on press. Clean Apple calculator-style.
- Error state: dots turn red, text "PIN incorreto" in red below dots

---

## SCREEN 5: Child Dashboard (Main — ages 6+)

The hero screen. Light, energetic, gamified. White background (#FFFFFF) with pull-to-refresh.

- **Header bar**: back arrow (neon green) left + coin badge on the right (pill with warm gold tint background rgba(245,158,11,0.1), gold coin icon + number "125" in amber #92400E)
- **Profile section**: Large circular avatar (70px, neon green ring border 3px with subtle glow) + greeting "Olá, Otávio! 👋" in bold neon green (#39FF14) + XP progress bar below (light gray track #E5E7EB with neon green animated fill #39FF14, "Nível 3 — Explorador" in dark text, "450 XP / 600" in gray)
- **Streak badge**: pill with soft red tint background (rgba(239,68,68,0.08)), fire emoji 🔥 + "5 dias seguidos!" in red #DC2626
- **Tasks grouped by category** with section headers in dark bold with colored emoji:
  - "🏠 Casa" — task cards below
  - "📚 Escola" — task cards below
  - "⚡ Desafios" — task cards below
- **Task Card design**: white card with soft shadow, 16px border radius, left neon green border (3px solid #39FF14). Row layout: task icon in soft green tint square (44px, rgba(57,255,20,0.1), rounded 12px) + task name bold dark + XP (green text + star icon) and coins (gold text + coin icon) on the right. Completed tasks: soft green tint background (#F0FDF4), green check icon, name muted/strikethrough.
- **Mini Ranking section**: "🏆 Ranking" header bold. White card with shadow listing siblings — position medal (🥇🥈🥉), small avatar with colored ring, name, XP in green. Button "Ver ranking completo" in neon green text + arrow.
- **Store button** at bottom: full-width white card with purple left accent border and soft shadow, gift icon in purple + "Loja de Recompensas" bold, chevron right in gray

---

## SCREEN 6: Child Dashboard (Young Kids Mode — under 6)

Same clean light screen but adapted for very young children who can't read. More colorful, bigger touch targets.

- White background
- Larger elements, no text labels on tasks
- **Task cards are large rounded squares** in a 2-column grid. Each square: 47% width, aspect ratio 1:1, 24px border radius, 3px neon pink (#F472B6) border. White background with soft shadow. Giant icon centered (64px). No text. Completed cards: soft green background (#F0FDF4), green border, big green check icon.
- Greeting shows just emoji 👋
- XP bar still visible (neon green fill on light track)
- No ranking section
- Simplified — visual-only, touch-friendly, all cards have generous tap areas

---

## SCREEN 7: Task Detail (Completing a Mission)

Clean screen where the child completes a task. White background, focused layout.

- White background
- Back arrow header in neon green
- **Large icon circle** (100x100) white with soft shadow and neon green ring border, task icon inside in neon green
- Task name in large bold (24px), dark text
- **Rewards row**: green star icon + "25 XP" in green | gold coin icon + "10 moedas" in amber — clean typography
- **Photo capture area**: Large rectangle (200px tall) with dashed neon green border (3px dashed #39FF14), 20px radius, white interior. Camera icon centered in neon green + "Tirar Foto" in gray.
- **After photo taken**: Photo preview (250px, rounded 16px) with thin light border. "Refazer" pill button top-right with white background + green text
- **AI verification states**:
  - Analyzing: green spinner + "Verificando sua missão... 🔍" in green text
  - Approved: soft green box (#F0FDF4) with green border + success message in green
  - Rejected: soft red box (#FEF2F2) with red border + feedback in red + "Tentar novamente (2 restantes)" button in red outline
- **Submit button**: full-width, solid neon green (#39FF14), white bold text, soft green glow shadow, "Enviar para verificação" with send icon

---

## SCREEN 8: Celebration Overlay

Joyful victory modal. Clean Apple style with green energy.

- Light backdrop (white 70% opacity with blur)
- Centered white card (80% width, 24px radius, 32px padding) with soft shadow and neon green border (2px solid #39FF14) with subtle green glow
- Large 🎉 emoji (64px)
- "Muito bem!" in bold (28px), neon green text
- Rewards earned: "+25 XP" with green star + "+10 moedas" with gold coin — clean, bold typography
- Card animates in with a bounce scale effect
- Auto-dismisses after 2.5 seconds

---

## SCREEN 9: Rewards Store (Child)

Where children spend coins. White background, purple-accented.

- White background
- Header: neon green back arrow + "Loja de Recompensas" bold dark + coin badge (gold tint pill with balance)
- **Reward cards** in a list: white card, 14px radius, soft shadow, purple left border (3px solid #A855F7). Each card:
  - Left: reward icon in soft purple tint square (rgba(168,85,247,0.1))
  - Center: reward name bold dark
  - Right: gold coin icon + price in amber (#92400E), large bold
  - Cards with insufficient coins: 50% opacity
- Empty state: "Nenhuma recompensa disponível" in gray

---

## SCREEN 10: Rewards Store (Young Kids Mode)

Same store with large visual cards on white background.

- White background, 2-column grid of white square cards (47% width, aspect ratio 1:1)
- 20px border radius, 3px pink border (#F472B6), soft shadow (or gray border if can't afford)
- Giant icon centered (48px)
- Price below icon with small gold coin icon
- No text names — purely visual, big touch targets

---

## SCREEN 11: Ranking (Full)

Full leaderboard. Clean, competitive.

- White background
- Header: neon green back arrow + "🏆 Ranking" bold dark
- **Ranking cards** for each child, ordered by XP:
  - White card, 16px radius, soft shadow, left border in child's theme color (3px)
  - #1 card has slightly larger styling with green tint background (#F0FDF4) — champion highlight
  - Medal: 🥇🥈🥉 for positions 1-3, then "4º", "5º" etc (28px) in gray
  - Circular avatar (48px) with colored ring border
  - Child's name (18px bold) dark
  - XP progress bar (light track, neon green fill)
  - Row: streak badge (red tint pill) + "X XP total" in gray

---

## SCREEN 12: Parent Dashboard

Clean command center for parents. White, professional, cyan-accented.

- White background
- **Header**: "Dashboard Pai" large bold (26px) dark + subtitle "12 tarefas criadas" in gray. Logout button: light gray circle with dark logout icon.
- **Children overview cards** in a scrollable list:
  - White card, 16px radius, soft shadow, left border in child's theme color
  - Avatar (44px) with colored ring + child name (bold dark) + "Nível 3 — Explorador" in gray
  - Stats row: green star + XP text | gold coin badge | red streak badge — clean colored text
- **Action buttons row** (2 buttons side by side):
  - "Nova Tarefa" — solid cyan (#06B6D4) fill, white text, plus icon, soft shadow
  - "Nova Recompensa" — solid purple (#A855F7) fill, white text, gift icon, soft shadow
- **Navigation menu**: white cards with soft shadow, colored icon + dark label + gray chevron-right:
  - 👥 "Gerenciar Filhos" — green icon
  - 📋 "Ver Todas as Tarefas" — cyan icon
  - 🎁 "Ver Recompensas" — purple icon
  - 🕐 "Histórico de Fotos" — gray icon
  - ⚙️ "Trocar PIN" — amber icon

---

## SCREEN 13: Create Task (Parent)

Clean form screen. White background, well-structured.

- White background
- **Header**: "Cancelar" in red (#EF4444) left + "Nova Tarefa" centered bold dark + "Salvar" in cyan (#06B6D4) right
- **Form fields** (scrollable):
  - **Task Name**: white input with light gray border, cyan border on focus, rounded 12px. Placeholder "Ex: Arrumar a cama" in light gray
  - **Icon Selector**: horizontal scroll of icon options in light rounded squares (48px). Selected: cyan border + soft cyan tint background. Unselected: light gray border
  - **Type chips**: horizontal pills — "🏠 Casa", "📚 Escola", "⚡ Desafio". Selected: solid cyan fill, white text. Unselected: white with gray border
  - **Recurrence chips**: "Diária", "Semanal", "Única". Same pill style
  - **Weekday selector** (if weekly): 7 small circles (Mon-Sun), selected in cyan, unselected light gray
  - **Assign to chips**: "Todos" + each child's name. Selected child uses their theme color as fill
  - **XP slider** (1-100): label "XP: 25" in green + light gray minus/plus buttons with neon green progress bar fill between
  - **Coins slider** (1-50): same style with gold/amber progress bar
  - **Photo required toggle**: iOS-style switch, neon green track when active
  - **AI criteria textarea** (if photo required): white multiline input with light border, cyan on focus. Placeholder "Ex: A cama deve estar com lençol esticado..."

---

## SCREEN 14: Create Reward (Parent)

Clean form, purple-accented.

- White background
- **Header**: "Cancelar" red + "Nova Recompensa" centered bold dark + "Salvar" purple (#A855F7)
- **Form fields**:
  - **Reward Name**: white input, purple border on focus. Placeholder "Ex: 1h de videogame"
  - **Icon Selector**: horizontal scroll with reward icons in light squares. Selected: purple border + soft purple tint. Icons: gamepad, TV, ice cream, pizza, movie, shopping bag, bike, phone, candy, gift, star
  - **Cost slider** (1-200): label "Custo: 50 moedas" with gold coin icon + light minus/plus buttons with gold/amber progress bar
  - **Available for chips**: "Todos" (purple when selected) + child names in their theme colors

---

## SCREEN 15: Manage Children (Parent)

Clean CRUD screen.

- White background
- Header: neon green back arrow + "Gerenciar Filhos" bold dark + cyan plus icon
- **Add child form** (expandable white card at top):
  - White card with soft shadow, 16px radius
  - Title "Adicionar Filho(a)" bold
  - White inputs with light borders, cyan on focus
  - **Color picker**: row of 7 vibrant colored circles (32px). Selected one has thick dark ring border + slightly larger scale. Colors: blue, purple, pink, red, amber, green, indigo
  - Cyan "Adicionar" button, white text
- **Children list**: white cards with left color border + soft shadow
  - Avatar (44px) with colored ring + small camera icon overlay (cyan, bottom-right)
  - Name bold dark + age in gray
  - Linked status: green check + email (if linked) OR amber alert + "Sem conta vinculada"
  - Action buttons: "Vincular Email" cyan outline pill (if unlinked) + red trash icon

---

## SCREEN 16: Task List (Parent)

Clean list view with cyan accents.

- White background
- Header: neon green back arrow + "Tarefas" bold dark + cyan plus icon
- **Task cards** in a list: white card, 14px radius, soft shadow
  - Task icon in soft cyan tint square (42px, 12px radius)
  - Task name bold dark
  - Meta info: "🏠 Casa · Diária · Otávio" in small gray
  - XP in green + coins in gold on the right
- Long press to delete (confirmation alert)
- Empty state: "Nenhuma tarefa criada ainda." in gray

---

## SCREEN 17: Rewards List (Parent)

Same clean layout as task list but purple-accented.

- White background
- Header: neon green back arrow + "Recompensas" bold dark + purple plus icon
- **Reward cards**: white cards with soft shadow, same structure but:
  - Icon in soft purple tint square
  - "Para: Otávio" or "Para: Todos" in gray
  - Price in gold with coin icon
- Empty state: "Nenhuma recompensa criada." in gray

---

## SCREEN 18: Photo History (Parent)

Clean timeline with colored status indicators.

- White background
- Header: neon green back arrow + "Histórico" bold dark
- **History cards** in chronological list (newest first), white cards with soft shadow:
  - **Status dot** (10px circle): green (approved), red (rejected), amber (pending)
  - Child name bold dark + task name in gray
  - **Photo** if present: full-width image, 160px height, 10px radius, thin light border
  - **AI feedback** if present: italic gray text below photo
  - **Date**: light gray text, formatted in Portuguese (ex: "13 de abril de 2026, 14:30")
  - **Manual approve button** (if rejected): neon green pill with white check icon + "Aprovar" white text, green glow

---

## SCREEN 19: Settings / Change PIN (Parent)

Multi-step PIN change flow. Same clean style as Screen 4.

- White background
- Title "🔑 Trocar PIN" bold dark
- Three steps:
  1. "Digite o PIN atual" — validate current PIN
  2. "Novo PIN" — enter new PIN
  3. "Confirme o novo PIN" — confirm
- Same clean dot indicators (green fill) and white numeric keypad
- Error states: red dots + red text
- Success: green check animation, auto-navigates back

---

## Additional Design Notes

- All screens use clean white (#FFFFFF) or soft light gray (#F8FAF9) backgrounds — Apple-clean, never dark
- Cards are white with consistent soft shadows for depth — floating on the light background
- Typography hierarchy: titles 22-28px bold in dark (#111827), body 16px in dark, meta 12-14px in gray (#6B7280)
- **Neon Green (#39FF14) is the hero accent color** — it pops vibrantly against the white backgrounds. Used for primary CTAs, progress bars, active borders, key highlights. It's the app's signature color.
- Color accents match context: cyan for parent actions, green for child/XP/success/primary CTA, purple for rewards, gold/amber for coins, red for streaks/errors, pink for young kids
- The app should feel like a **premium Apple app with electric green energy** — think Apple Fitness meets a kids gamification app. Clean, white, spacious, with neon green accents that feel alive.
- Interactive elements: primary buttons have subtle neon green glow shadow, progress bars have smooth fills, badges use soft colored tint backgrounds
- Generous white space everywhere — never cramped, always breathable
- Young kids mode (under 6) uses bigger icons, bigger touch targets, more color, no text — but still clean and light
- Transitions: smooth iOS-style slide animations
