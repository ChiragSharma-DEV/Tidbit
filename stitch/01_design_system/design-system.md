## Brand & Style

The design system is rooted in the "Quiet Print" aesthetic—a modern editorial approach that prioritizes cognitive ease and deep focus. It targets readers looking to reclaim their attention span from the chaotic, high-stimulus digital landscape. 

The style is a disciplined **Minimalism** with a tactile, paper-like quality. It avoids the "glassy" or "vibrant" trends of mobile software, opting instead for the permanence and weight of physical broadsheets and literary journals. There are no shadows, gradients, or glows; depth is communicated solely through hairline borders and subtle shifts in surface tone. The emotional response is one of calm, authority, and intellectual focus.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop (centered reading column) and a **Fluid Margin** on mobile.

The defining characteristic is the **28px Left Gutter** on content cards. This space is reserved for a vertical "ink blue" ruler. The length of this ruler is a direct visualization of the article's length—as the user reads, the ruler fills or a marker moves to indicate depth.

Margins are generous (24px on mobile) to create a sense of "whitespace luxury," emphasizing that the content is worth the reader's time. Avoid dense clusters of information; if two elements can be separated by an extra 8px of whitespace, choose the separation.

## Elevation & Depth

This system intentionally rejects 3D depth. There are no z-axis shadows. 

Depth is achieved through **Tonal Layering**:
- **Level 0**: Paper stock background (#F4F4F0).
- **Level 1**: White surface inserts (#FFFFFF) with a 1px hairline border (#DFDFD7).

Interaction states (hover/active) should be signaled by color changes (text turning Ink Blue) or the appearance of a 1px border, rather than a "lift" effect.

## Components

### Content Cards
The signature component. Must feature the 28px left gutter. The word count (e.g., "450 WORDS") must be placed at the top right in `label-mono`. Use a hairline border to separate the card from the background if the card is white.

### Buttons
Buttons are rectangular with a 4px radius. 
- **Primary**: Transparent background, 1px border (#16171B), text in `ui-button`. On hover, the border and text turn Ink Blue.
- **Ghost**: No border, Ink Blue text, used for secondary navigation.

### Progress Ruler
A vertical stroke in the card's left gutter. The stroke weight is 2px. Background of the ruler is a faint #DFDFD7, and the "fill" (representing reading progress) is Ink Blue (#2F2BC4).

### Input Fields
Simple underlines (1px) rather than boxes. The label should sit above the underline in `label-mono`. 

### Markers
When a user "saves" or "highlights" text, use the `highlight_marker` color as a background block behind the serif text, mimicking a felt-tip highlighter. The edges of this highlight should be slightly irregular or have a 2px radius to feel manual.