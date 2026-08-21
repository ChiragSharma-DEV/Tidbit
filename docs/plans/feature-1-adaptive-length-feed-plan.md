# Feature 1: The Adaptive Length Feed (Stamina Axis)
## Detailed Implementation Plan

---

## 📋 Feature Overview

**Feature Name:** Feature 1: The Adaptive Length Feed (Stamina Axis)  
**Objective:** Transition learners from quick micro-learning attention spans (~8–10 seconds) to deep reading stamina by starting with bite-sized content cards and dynamically expanding content length (paragraphs -> mini-articles) as active session time increases.

---

## 🎯 Core User Experience Flow

1. **Initial Hook (Gate 1 - Short)**:
   - When the user opens the feed screen, initial cards are byte-sized (tweet/quote style, 15–30 words).
   - Zero friction and minimal reading effort required.
2. **Progressive Expansion (Gate 2 - Medium)**:
   - As the user scrolls for 5–7 minutes (or 30s in Hackathon Demo Mode), cards seamlessly expand into paragraph-length content (80–150 words) with added context and real-world examples.
3. **Deep Focus (Gate 3 - Long)**:
   - At 15+ minutes (or 90s in Hackathon Demo Mode), cards turn into mini-articles / detailed case studies (300–500 words).
   - Content flow remains continuous; user reading stamina is built organically without interrupting scroll physics.

---

## 🏗️ Technical Requirements & Architecture

### Requirement A: The Silent Timer (`src/hooks/useStaminaTimer.ts`)
* **Invisible Tracking**: Tracks active reading time only when the user is actively viewing the feed screen.
* **Visibility Pause**: Automatically pauses timer on window `blur`, tab switch, or device screen lock using the HTML5 `visibilitychange` API and `focus`/`blur` event listeners.
* **State Persistence**: Retains active session time in client state / `sessionStorage` across soft component re-renders.

### Requirement B: Threshold Gates (`src/lib/stamina/thresholdEngine.ts`)
* **Standard Threshold Rules**:
  - **Gate 1 (`short`)**: `0 <= activeSeconds < 300` (0 – 5 mins)
  - **Gate 2 (`medium`)**: `300 <= activeSeconds < 900` (5 – 15 mins)
  - **Gate 3 (`long`)**: `activeSeconds >= 900` (15+ mins)
* **Hackathon Fast Demo Mode**:
  - **Gate 1 (`short`)**: `0 <= activeSeconds < 30` (0 – 30 seconds)
  - **Gate 2 (`medium`)**: `30 <= activeSeconds < 90` (30 – 90 seconds)
  - **Gate 3 (`long`)**: `activeSeconds >= 90` (90+ seconds)
* **Demo HUD Control**: Embedded floating developer controller (`src/components/feed/DemoHUD.tsx`) permitting instant gate overrides and speed toggles for live judges.

### Requirement C: Dynamic Content Selection & Schema (`src/lib/db/models/FeedCard.ts` & `/api/feed/adaptive`)
* **Topic Continuity**: Cards maintain sequential curriculum order; only content length expands.
* **Tri-Variant Data Model**: Each feed card stores 3 content variants:
  - `short`: Headline + 1-2 line quote/tweet style summary + key takeaway.
  - `medium`: Summary + full explanation paragraph + bullet points + practical example.
  - `long`: Article title + introduction + detailed case study / code breakdown + key takeaways.
* **Dynamic API Projection**: Backend API checks `currentGate` parameter and projects only the target variant into the payload sent to the client.

### Requirement D: UI Adaptability & Scroll Isolation (`src/components/feed/StaminaCard.tsx`)
* **Adaptive Card Design**:
  - `short`: Centered large typography (24px–32px), quote layout, zero clutter.
  - `medium`: Formatted paragraphs, concept pills, bullet points.
  - `long`: Article card design, estimated reading time, reading progress bar.
* **Inner Gesture Scroll Isolation**:
  - Vertical feed uses snap scrolling (`snap-y snap-mandatory overflow-y-scroll`).
  - `long` cards feature an isolated internal scroll container (`overflow-y-auto`, `overscroll-behavior-contain`, `touch-action: pan-y`).
  - Prevents outer feed swipe gestures from triggering while the user is scrolling internally through long text.

---

## 📂 Codebase File Changes & Implementation Plan

| Action | File Path | Purpose |
| :--- | :--- | :--- |
| **Modify** | `src/types/index.ts` | Define `StaminaGate`, `FeedCardContent`, `IFeedCard` interfaces |
| **Create** | `src/lib/db/models/FeedCard.ts` | Database schema storing tri-variant concept cards |
| **Create** | `src/hooks/useStaminaTimer.ts` | React hook for silent active session timer with visibility listener |
| **Create** | `src/lib/stamina/thresholdEngine.ts` | Gate evaluation engine (Standard & Hackathon fast demo thresholds) |
| **Create** | `src/lib/ai/feedGenerator.ts` | Anthropic Claude service generating short/medium/long card variants |
| **Create** | `src/app/api/feed/adaptive/route.ts` | API route serving topic-sequenced cards filtered by active gate |
| **Create** | `src/components/feed/StaminaCard.tsx` | UI card component with isolated inner scroll behavior |
| **Create** | `src/components/feed/AdaptiveFeed.tsx` | Vertical TikTok-style snap-scroll feed interface |
| **Create** | `src/components/feed/DemoHUD.tsx` | Live hackathon demo control panel for judges |
| **Create** | `src/app/(dashboard)/student/feed/page.tsx` | Student Feed route |
| **Modify** | `src/app/(dashboard)/student/page.tsx` | Add entry link to "Stamina Feed" on Student Dashboard |

---

## 🛠️ Step-by-Step Task Breakdown

### Step 1: Types & Data Model
- [ ] Extend `src/types/index.ts` with `StaminaGate` (`'short' | 'medium' | 'long'`) and card variant interfaces.
- [ ] Create `FeedCard` model in `src/lib/db/models/FeedCard.ts`.

### Step 2: Timer & Gate Engine
- [ ] Build `useStaminaTimer` hook handling active time accumulation and `visibilitychange`/`blur`/`focus` pause events.
- [ ] Build `thresholdEngine.ts` evaluating active seconds into Gate 1, Gate 2, or Gate 3 based on normal vs demo mode.

### Step 3: Backend API & AI Tri-Variant Generation
- [ ] Build `src/lib/ai/feedGenerator.ts` to call Anthropic API and generate all 3 variants (`short`, `medium`, `long`) for any concept topic.
- [ ] Create API route `src/app/api/feed/adaptive/route.ts` accepting course ID and user's current gate.

### Step 4: UI Components & Touch Gesture Isolation
- [ ] Build `StaminaCard.tsx` with dynamic layout per variant and isolated internal scroll container for long cards.
- [ ] Build `AdaptiveFeed.tsx` with vertical snap scroll and timer integration.
- [ ] Build `DemoHUD.tsx` widget allowing demo speed toggles and instant gate override.

### Step 5: Dashboard Integration & Verification
- [ ] Add "Adaptive Feed" access card / navbar action in `src/app/(dashboard)/student/page.tsx`.
- [ ] Test timer auto-pause on tab change and verify scroll isolation on long cards.
