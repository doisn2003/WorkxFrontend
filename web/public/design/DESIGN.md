# Design System Document: The Fluid Workspace

## 1. Overview & Creative North Star
### The Creative North Star: "The Digital Atrium"
Most internal communication platforms feel like a digital warehouse—cluttered, loud, and utilitarian. This design system reimagines the workspace as a **Digital Atrium**: a high-end, editorial environment defined by architectural clarity, breathing room, and a stark, modernist palette.

To move beyond the "standard SaaS" look, we reject the rigid, bordered grid. Instead, we utilize **Intentional Asymmetry** and **Tonal Depth**. By overlapping layers and using aggressive whitespace, we create an experience that feels curated and calm. The goal is to make "internal work" feel as premium as a gallery catalog through a monochrome, "brutalist-lite" aesthetic.

---

## 2. Colors & Surface Logic
Our palette is rooted in a sophisticated range of industrial grays and architectural whites, punctuated by a deep, authoritative Black and Mid-Tone Gray.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to section off major UI components. Traditional lines create visual "noise" that traps the eye.
- **Boundaries are defined by background shifts.** A sidebar should sit on a neutral surface, while the main feed uses the lowest container surface to maximize brightness.
- **Secondary sections** use subtle shifts in the neutral scale to create a natural, soft-edge transition.

### Surface Hierarchy & Nesting
Think of the UI as layers of fine paper stacked atop one another. 
- **Base Layer:** Standard neutral surface.
- **Primary Content Area:** Maximum white surface for focus.
- **Nested Elements:** Use elevated surface containers for internal modules (like a search bar or a pinned message) to create depth without borders.

### The "Glass & Gradient" Rule
To add soul to the interface:
- **Floating Elements:** Modals and dropdowns must use a semi-transparent surface with a `backdrop-blur` (20px-40px). This allows the grayscale tones beneath to bleed through, softening the UI.
- **Signature Textures:** Main Action buttons should not be flat gray. Use a subtle linear gradient from `primary` (#777777) to a slightly deeper tone at a 135-degree angle to create a sense of tactile depth and metallic sheen.

---

## 3. Typography: Editorial Precision
We use **Inter** as our typographic backbone across all layers (Headlines, Body, and Labels). The hierarchy is designed to feel like a high-end magazine—high contrast between titles and body text.

- **Display & Headlines:** Use `display-md` or `headline-lg` for dashboard welcomes and major headers. These should have a slight negative letter-spacing (-0.02em) to look "tight" and professional.
- **Body Text:** Use `body-md` (0.875rem) for general communication. It provides a balance of density and readability.
- **Labels:** `label-sm` (0.6875rem) is reserved for metadata and priority badges. These must always be in All Caps with +0.05em letter-spacing to ensure legibility at small scales.

---

## 4. Elevation & Depth
In this system, depth is "felt," not "seen."

### The Layering Principle
Achieve hierarchy through **Tonal Layering**. Instead of a shadow, place a lighter card on a slightly darker neutral background. This creates a "lift" that is easier on the eyes during long work hours.

### Ambient Shadows
If an element must float (e.g., a notification popover), use an **Ambient Shadow**:
- **Shadow Color:** 4% opacity of the neutral base.
- **Blur:** 32px to 64px.
- **Spread:** -4px.
This mimics natural light and avoids the "muddy" look of standard CSS shadows.

### The "Ghost Border" Fallback
If a boundary is absolutely necessary for accessibility, use a **Ghost Border**:
- **Rule:** Use the `outline_variant` at **15% opacity**. Never use 100% opaque borders for containers.

---

## 5. Components

### Navigation (The "Discord-Style" Rail)
The far-left workspace rail uses the inverse neutral surface.
- **Active State:** A vertical pill (Roundedness: `1` / Subtle) using the tertiary accent (#000000).
- **Hover State:** A subtle shift to a 10% opacity overlay.

### Priority Badges (The "Priority Signal")
Badges should not use heavy fills. Use the "Tinted Ghost" style:
- **Urgent:** Use the error container background with high-contrast text.
- **High/Medium/Low:** Use neutral and secondary container backgrounds with varying typographic weights.
- **Shape:** Use `1` (subtle) roundedness—never fully round for badges, to maintain a professional, architectural feel.

### Buttons
- **Primary:** Gradient fill (`primary` #777777 to its container variant), `on_primary` text. Roundedness: `1`.
- **Secondary:** Transparent background with a "Ghost Border" (15% opacity).
- **Tertiary:** Text-only using `primary` (#777777) or `tertiary` (#000000) with no background, used for low-emphasis actions.

### Cards & Lists
- **The Divider Ban:** Do not use line dividers between list items. Use **Vertical Space** (16px or 24px) or a subtle background shift on hover to separate content.
- **Padding:** Be aggressive. Use `1.5rem` (24px) padding as your default for card containers to allow the layout to breathe.

### Inputs
- **Field:** Surface container with a `Ghost Border`.
- **Focus State:** Border opacity increases to 100% `primary` (#777777) with a 2px outer "glow" using 10% `primary`.

---

## 6. Do's and Don'ts

### Do:
- **Use "Space as Structure":** Rely on the Spacing Scale (Level 2) to define groups.
- **Layer Vertically:** Place lighter surfaces on top of darker ones to signify "upward" movement toward the user.
- **Maintain Crispness:** Use the deep neutral or black for primary text to maintain high legibility against white backgrounds.

### Don't:
- **No Heavy Dividers:** Never use a dark or high-contrast 1px line to separate messages or navigation items.
- **No Pure Black Shadows:** Shadows must always be tinted with the surface color to feel integrated into the "Digital Atrium."
- **Avoid "Boxiness":** Don't feel forced to fill every corner of the screen. The subtle roundedness (`1`) and intentional asymmetry create a premium, architectural look.