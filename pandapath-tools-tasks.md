# PandaPath Tools — Engineering Tasks
> Full implementation plan for `pandapath.com/tools`  
> Derived from: PandaPath Tools Blueprint v1.0  
> Total tools: 52 | Pages: 4 | Phases: 5

---

## How to use this file
- Each **Epic** is a major product area
- Each **Task** is a self-contained unit of work (1–2 days max)
- Each **Subtask** is a specific implementation step
- Work top to bottom — later tasks depend on earlier ones
- Mark done with `[x]` instead of `[ ]`

---

## EPIC 1 — Project Setup & Infrastructure

### TASK 1.1 — Initialize Next.js project
- [ ] Create Next.js 14+ app with App Router: `npx create-next-app@latest pandapath-tools --typescript --tailwind --app`
- [ ] Configure base URL to serve from `/tools` path (set `basePath: '/tools'` in `next.config.js`)
- [ ] Set up ESLint + Prettier with project config
- [ ] Create `.env.local` with placeholder env vars (for network tools proxy if needed later)
- [ ] Set up `src/` directory structure:
  ```
  src/
    app/
      tools/
        page.tsx
        layout.tsx
        [slug]/page.tsx
        favorites/page.tsx
        about/page.tsx
    components/
    lib/
    data/
    styles/
  ```
- [ ] Verify dev server runs at `localhost:3000/tools`

### TASK 1.2 — Create the tool registry (`tools.ts`)
- [ ] Create `src/data/tools.ts` with the `Tool` TypeScript interface:
  ```ts
  interface Tool {
    slug: string
    name: string
    description: string
    category: 'developer' | 'text' | 'network' | 'image' | 'math' | 'color' | 'file' | 'date'
    icon: string        // 2-letter abbreviation e.g. '{}'
    tags: string[]      // for search matching
    related: string[]   // slugs of related tools
  }
  ```
- [ ] Add all 52 tools to the registry (copy from Appendix A of blueprint):

  **Developer (22 tools):**
  - [ ] `json-formatter` — JSON Formatter — `{}`
  - [ ] `json-to-csharp` — JSON to C# Class — `C#`
  - [ ] `json-to-typescript` — JSON to TypeScript — `TS`
  - [ ] `json-to-python` — JSON to Python Class — `PY`
  - [ ] `json-to-java` — JSON to Java Class — `JV`
  - [ ] `json-yaml` — JSON ↔ YAML — `YM`
  - [ ] `json-csv` — JSON ↔ CSV — `CV`
  - [ ] `json-xml` — JSON ↔ XML — `XM`
  - [ ] `xml-formatter` — XML Formatter — `XML`
  - [ ] `yaml-validator` — YAML Validator — `YL`
  - [ ] `guid-generator` — GUID / UUID Generator — `ID`
  - [ ] `jwt-decoder` — JWT Decoder — `JW`
  - [ ] `regex-tester` — Regex Tester — `RX`
  - [ ] `url-encoder` — URL Encoder / Decoder — `UR`
  - [ ] `base64` — Base64 Encoder / Decoder — `64`
  - [ ] `html-entities` — HTML Entity Encoder — `HE`
  - [ ] `hash-generator` — Hash Generator — `##`
  - [ ] `cron-parser` — Cron Expression Parser — `CR`
  - [ ] `sql-formatter` — SQL Formatter — `SQ`
  - [ ] `markdown-preview` — Markdown Previewer — `MD`
  - [ ] `diff-checker` — Diff Checker — `DF`
  - [ ] `lorem-ipsum` — Lorem Ipsum Generator — `LI`

  **Text (12 tools):**
  - [ ] `word-counter` — Word & Character Counter — `WC`
  - [ ] `case-converter` — Case Converter — `CC`
  - [ ] `slug-generator` — Slug Generator — `SG`
  - [ ] `text-diff` — Text Diff — `TD`
  - [ ] `duplicate-remover` — Duplicate Line Remover — `DL`
  - [ ] `sort-lines` — Sort Lines — `SL`
  - [ ] `reverse-text` — Reverse Text — `RT`
  - [ ] `find-replace` — Find & Replace — `FR`
  - [ ] `text-to-binary` — Text ↔ Binary — `TB`
  - [ ] `rot13` — ROT13 Cipher — `13`
  - [ ] `whitespace-cleaner` — Whitespace Cleaner — `WS`
  - [ ] `text-encrypt` — Text Encryptor (AES) — `AE`

  **Network (8 tools):**
  - [ ] `ip-lookup` — IP Lookup — `IP`
  - [ ] `dns-lookup` — DNS Lookup — `DN`
  - [ ] `http-headers` — HTTP Headers Viewer — `HH`
  - [ ] `ssl-checker` — SSL Certificate Checker — `SS`
  - [ ] `whois-lookup` — Whois Lookup — `WH`
  - [ ] `og-preview` — Open Graph Previewer — `OG`
  - [ ] `robots-tester` — Robots.txt Tester — `RB`
  - [ ] `url-expander` — URL Expander — `UX`

  **Image (5 tools):**
  - [ ] `image-to-base64` — Image to Base64 — `I6`
  - [ ] `svg-optimizer` — SVG Optimizer — `SV`
  - [ ] `favicon-generator` — Favicon Generator — `FV`
  - [ ] `qr-generator` — QR Code Generator — `QR`
  - [ ] `placeholder-image` — Placeholder Image — `PH`

  **Color (5 tools):**
  - [ ] `color-converter` — Color Converter — `CL`
  - [ ] `color-palette` — Color Palette Generator — `CP`
  - [ ] `gradient-generator` — CSS Gradient Generator — `GR`
  - [ ] `contrast-checker` — Contrast Checker (WCAG) — `AA`
  - [ ] `tailwind-colors` — Tailwind Color Picker — `TW`

  **Math (5 tools):**
  - [ ] `base-converter` — Number Base Converter — `NB`
  - [ ] `percentage-calc` — Percentage Calculator — `PC`
  - [ ] `scientific-calc` — Scientific Calculator — `SC`
  - [ ] `roman-numerals` — Roman Numeral Converter — `RN`
  - [ ] `random-number` — Random Number Generator — `RNG`

  **File (4 tools):**
  - [ ] `csv-to-json` — CSV to JSON — `CJ`
  - [ ] `csv-to-table` — CSV Table Viewer — `CT`
  - [ ] `file-hash` — File Hash Calculator — `FH`
  - [ ] `file-size` — File Size Converter — `FS`

  **Date/Misc (5 tools):**
  - [ ] `timestamp` — Unix Timestamp Converter — `TS`
  - [ ] `timezone` — Timezone Converter — `TZ`
  - [ ] `date-diff` — Date Difference Calculator — `DD`
  - [ ] `password-gen` — Password Generator — `PG`
  - [ ] `password-strength` — Password Strength Checker — `PS`

- [ ] Export helper functions: `getToolBySlug(slug)`, `getToolsByCategory(category)`, `getAllSlugs()`, `searchTools(query)`
- [ ] Verify TypeScript compiles with no errors

### TASK 1.3 — CSS design system & tokens
- [ ] Create `src/styles/globals.css` with CSS custom properties:
  ```css
  :root {
    --bg-primary: #FFFFFF;
    --bg-secondary: #F8FAFC;
    --bg-tertiary: #F3F4F6;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --text-tertiary: #9CA3AF;
    --border-color: #E5E7EB;
    --border-focus: #1A56DB;
    --blue-primary: #1A56DB;
    --blue-dark: #0C3A8A;
    --blue-light: #E6F1FB;
    --card-bg: #FFFFFF;
    --input-bg: #FFFFFF;
    --green: #166534;
    --green-light: #DCFCE7;
    --red: #991B1B;
    --red-light: #FEE2E2;
  }
  .dark {
    --bg-primary: #0F1117;
    --bg-secondary: #1A1D27;
    --bg-tertiary: #252836;
    --text-primary: #F9FAFB;
    --text-secondary: #9CA3AF;
    --text-tertiary: #6B7280;
    --border-color: #374151;
    --card-bg: #1E2130;
    --input-bg: #141620;
  }
  ```
- [ ] Set font stack: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- [ ] Set monospace font: `'Fira Code', 'Consolas', 'Courier New', monospace`
- [ ] Define typography scale as CSS vars (h1: 32px/700, h2: 22px/600, body: 15px/400, etc.)
- [ ] Define spacing scale (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 48px)
- [ ] Add base resets and box-sizing

### TASK 1.4 — localStorage utility library
- [ ] Create `src/lib/storage.ts` with safe localStorage wrapper (handles private mode gracefully):
  ```ts
  export function getStorage<T>(key: string, fallback: T): T
  export function setStorage<T>(key: string, value: T): void
  ```
- [ ] Implement `getFavorites(): string[]` — reads `pp_favorites`
- [ ] Implement `toggleFavorite(slug: string): boolean` — adds/removes slug, returns new state
- [ ] Implement `isFavorite(slug: string): boolean`
- [ ] Implement `getRecentTools(): string[]` — reads `pp_recent_tools` (last 10)
- [ ] Implement `addRecentTool(slug: string): void` — prepends slug, deduplicates, trims to 10
- [ ] Implement `getTheme(): 'light' | 'dark'` — reads `pp_theme`, falls back to `prefers-color-scheme`
- [ ] Implement `setTheme(theme: 'light' | 'dark'): void`
- [ ] Write unit tests for all storage functions

---

## EPIC 2 — Shared Layout Components

### TASK 2.1 — Root layout & dark mode initialization
- [ ] Create `src/app/tools/layout.tsx` as the root layout wrapper
- [ ] Add inline `<script>` in `<head>` that reads `pp_theme` from localStorage and applies `.dark` class to `<html>` **before** page renders (prevents flash of wrong theme)
- [ ] Wrap children with a `ThemeProvider` context if using React context for theme state
- [ ] Import global CSS

### TASK 2.2 — Navbar component
- [ ] Create `src/components/Navbar.tsx`
- [ ] Layout: flex row, height 56px, `position: sticky`, `top: 0`, `z-index: 100`, white bg, 1px bottom border
- [ ] **Logo** (left): text "PandaPath Tools", font-weight 600, 16px, links to `/tools`
- [ ] **Nav links** (right): Tools | Favorites | About — 14px, `var(--text-secondary)`
- [ ] **Dark mode toggle** (far right): sun/moon SVG icon button — calls `setTheme()` + toggles `.dark` on `<html>`
- [ ] **Mobile hamburger** (< 640px): replace nav links with hamburger icon. Clicking opens a dropdown with the same links
- [ ] **No sign-in button** — intentionally omitted, do not add
- [ ] Active link: highlight current route link in blue
- [ ] Test sticky behavior on long-scroll pages

### TASK 2.3 — Footer component
- [ ] Create `src/components/Footer.tsx`
- [ ] Single row: border-top 1px `var(--border-color)`, padding 16px 24px
- [ ] Left: "PandaPath Tools — 100% free, no sign-up required" — 13px, `var(--text-tertiary)`
- [ ] Right: links — About | Privacy — 13px, `var(--text-tertiary)`
- [ ] Responsive: stack vertically on mobile

### TASK 2.4 — Tool card component
- [ ] Create `src/components/ToolCard.tsx` — accepts `tool: Tool` prop
- [ ] Card container: white bg, `border-radius: 12px`, border 1px `var(--border-color)`, padding 16px
- [ ] Hover: `border-color: var(--blue-primary)`, `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- [ ] **Icon**: 40×40px rounded square (`border-radius: 10px`), blue bg, white 2-char text, 12px bold
- [ ] **Tool name**: 15px, font-weight 600, `var(--text-primary)`, single line
- [ ] **Description**: 13px, `var(--text-secondary)`, max 2 lines, `line-height: 1.4`
- [ ] **Star button**: top-right, outline star SVG = not favorited, filled = favorited. Calls `toggleFavorite()`. Stops click propagation (doesn't navigate)
- [ ] **"Open tool" button**: bottom, blue bg, white text, `border-radius: 8px`, `padding: 10px 16px`
- [ ] Entire card is clickable — `<Link href={/tools/${tool.slug}}>` wraps the card
- [ ] Star state initialized from `isFavorite(slug)` on mount
- [ ] Dark mode: card bg uses `var(--card-bg)`

### TASK 2.5 — Category sidebar component
- [ ] Create `src/components/CategorySidebar.tsx`
- [ ] Width: 180px, `position: sticky`, `top: 56px` (below navbar), `border-right: 1px solid var(--border-color)`
- [ ] Each item: colored dot (6px circle) + category name + tool count badge
- [ ] Category colors: Developer=blue, Text=green, Colors=pink, Network=teal, Math=purple, Image=orange, File=coral, Date=gray
- [ ] Active item: `border-left: 2px solid var(--blue-primary)`, blue text, `background: var(--blue-light)`
- [ ] Click: emit `onCategorySelect(category)` callback OR scroll to section
- [ ] Hidden on mobile (< 768px): `display: none`

---

## EPIC 3 — Home Page (`/tools`)

### TASK 3.1 — Hero section
- [ ] Create `src/components/Hero.tsx`
- [ ] Background: `var(--bg-secondary)`, padding 48px top / 32px bottom, full width
- [ ] **Eyebrow label**: "100% CLIENT-SIDE  •  NO SIGN-UP  •  NO DATA LEAVES YOUR BROWSER" — 10px, uppercase, letter-spacing 1.5px, `var(--blue-primary)`
- [ ] **Headline**: "Fast browser tools for everyday dev work" — 32px, font-weight 700, `var(--text-primary)`. Mobile: 24px
- [ ] **Subheadline**: 15px, `var(--text-secondary)`, max-width 560px, line-height 1.6
- [ ] **Search bar**: 48px height, full width, border-radius 10px, border 1px `#D1D5DB`, white bg. Left: search SVG icon. Right: tool count badge (e.g. "52 tools") in blue pill. Placeholder: "Search tools... e.g. JSON, regex, base64"
- [ ] Search input: `onChange` fires `onSearch(query)` prop callback — no submit button needed
- [ ] **Category filter pills**: horizontal row — All | Developer | Text | Colors | Network | Math | Image | File | Date. Active pill: blue bg. Inactive: white bg, gray border. `onClick` fires `onCategoryFilter(category)` prop callback
- [ ] **Recently used strip**: reads `getRecentTools()`, maps slugs to tool names. Shows label + up to 5 chips. Each chip: blue dot + tool name, links to `/tools/[slug]`. Hidden if array is empty

### TASK 3.2 — Home page layout & tool grid
- [ ] Create `src/app/tools/page.tsx`
- [ ] State: `searchQuery`, `activeCategory` — both start empty/`'all'`
- [ ] Layout: sidebar (180px) + main content area, `display: flex`
- [ ] Render `<CategorySidebar>` on left, tool grid on right
- [ ] Filter logic: `displayedTools = tools.filter(t => matchesSearch(t, query) && matchesCategory(t, category))`
- [ ] `matchesSearch`: checks `tool.name`, `tool.description`, `tool.tags` — case-insensitive includes
- [ ] Group displayed tools by category for section headers
- [ ] **Section headers**: for each category group, show a sticky bar — category name (18px bold) + colored dot + count (e.g. "22 tools"). Background: `var(--bg-tertiary)`, full width, padding 12px 24px
- [ ] **Tool grid**: `display: grid`, `grid-template-columns: repeat(2, 1fr)`, `gap: 16px`, `padding: 24px`. Mobile: `grid-template-columns: 1fr`
- [ ] Render `<ToolCard>` for each filtered tool
- [ ] Empty state: if no tools match search, show "No tools found for '[query]'" centered message

### TASK 3.3 — Cmd+K search overlay
- [ ] Create `src/components/SearchOverlay.tsx`
- [ ] Full-viewport backdrop: `position: fixed`, `inset: 0`, `background: rgba(0,0,0,0.5)`, `z-index: 200`
- [ ] Modal: centered, white bg, `border-radius: 16px`, max-width 600px, shadow
- [ ] Auto-focus search input on open
- [ ] Input: 48px height, placeholder "Search tools..."
- [ ] Results list below input: each result shows icon abbreviation + tool name + one-line description + category badge
- [ ] Highlight active result with light blue background
- [ ] **Keyboard navigation**: `ArrowUp`/`ArrowDown` moves selection. `Enter` navigates to selected tool. `Escape` closes overlay
- [ ] Fuzzy search: use simple string includes across name + description + tags
- [ ] Global keyboard listener in layout: `Cmd+K` / `Ctrl+K` opens overlay
- [ ] Clicking backdrop closes overlay
- [ ] Show max 8 results at a time

---

## EPIC 4 — Individual Tool Page (`/tools/[slug]`)

### TASK 4.1 — Tool page shell & layout
- [ ] Create `src/app/tools/[slug]/page.tsx`
- [ ] Use `generateStaticParams()` to statically generate pages for all 52 slugs at build time
- [ ] Use `generateMetadata()` to generate unique `<title>` and `<meta name="description">` per tool:
  - Title: `"{Tool Name} — PandaPath Tools"`
  - Description: `"{tool.description} Free, online, no signup required."`
  - OG tags: `og:title`, `og:description`, `og:url`
- [ ] Call `addRecentTool(slug)` on page mount (client component)
- [ ] **Breadcrumb**: "Home > [Category] > [Tool Name]" — 12px, `var(--text-tertiary)`. Last item blue, not a link. Padding 12px 24px, border-bottom
- [ ] **Tool header section**: icon + title (22px/700) + description (14px) + trust badge + star button + share button. Background `var(--bg-secondary)`, padding 24px, border-bottom
- [ ] **Trust badge**: pill — "🔒 Runs in browser only" — green bg `var(--green-light)`, green text `var(--green)`, 12px
- [ ] **Share button**: "Share" — on click copies `window.location.href` to clipboard. Shows "Copied!" tooltip for 2s. Fallback: show URL in a text input
- [ ] **Star button**: same behavior as on tool cards — reads/writes `pp_favorites`
- [ ] **Tool interface area**: full width, `max-width: 900px`, centered, padding 24px
- [ ] **Related tools row**: at bottom, above footer. "Related tools:" label + 3–5 chips. Border-top, padding 16px 24px. Each chip links to `/tools/[related-slug]`

### TASK 4.2 — Reusable tool interface components
- [ ] Create `src/components/tool/ToolInput.tsx` — reusable textarea input block:
  - Toolbar: "Input" label + Paste button + Clear button + Sample button + optional line count badge
  - Textarea: monospace font, 14px, min-height 200px, resizable vertically, padding 16px, white bg
  - Border: 1px `var(--border-color)`, border-radius 8px wrapping entire block
  - Paste button: reads from `navigator.clipboard.readText()`
  - Sample button: calls `onSample()` prop to load example input
  - Clear button: calls `onClear()` prop

- [ ] Create `src/components/tool/ToolOutput.tsx` — reusable output block:
  - Label: "OUTPUT" — 11px, uppercase, letter-spacing 0.8px, `var(--text-tertiary)`
  - Copy button: `navigator.clipboard.writeText(output)` → shows "✓ Copied!" for 2s
  - Download button (optional): creates blob URL + `<a download>` click
  - Textarea: read-only, monospace, min-height 160px, `var(--bg-tertiary)` background
  - Error state: red border + red error message text when `error` prop is set

- [ ] Create `src/components/tool/ActionBar.tsx` — row of action buttons:
  - Primary button: blue bg, white text, height 40px, border-radius 8px
  - Secondary buttons: white bg, 1px border, gray text
  - Keyboard shortcut: `Cmd+Enter` / `Ctrl+Enter` triggers `onPrimaryAction()`
  - Gap between buttons: 8px

- [ ] Create `src/components/tool/ToolShortcuts.tsx` — keyboard shortcut hint bar:
  - Shows: `⌘↵ Run` | `⌘⇧C Copy` | `Esc Clear` — 11px, gray, in a row below the action bar
  - Desktop only (hidden on mobile)

---

## EPIC 5 — Developer Tools Implementation

### TASK 5.1 — JSON Formatter
- [ ] Route: `/tools/json-formatter`
- [ ] Input: raw JSON textarea with Sample (loads `{"id":1,"name":"Tool","tags":["json","dev"]}`)
- [ ] Actions: **Format** (primary) | Minify | Validate
- [ ] Format: `JSON.stringify(JSON.parse(input), null, 2)`
- [ ] Minify: `JSON.stringify(JSON.parse(input))`
- [ ] Validate: parse and show "Valid JSON ✓" or error message with line number
- [ ] Error: show red border + parse error message in output area
- [ ] Related: `json-yaml`, `xml-formatter`, `json-to-typescript`

### TASK 5.2 — JSON to C# Class
- [ ] Route: `/tools/json-to-csharp`
- [ ] Input: JSON object textarea
- [ ] Action: **Generate Class** (primary)
- [ ] Logic: parse JSON, recursively generate C# class with typed properties (string, int, bool, List<T>, nested class)
- [ ] Output: C# code in monospace output area
- [ ] Related: `json-to-typescript`, `json-to-java`, `json-to-python`

### TASK 5.3 — JSON to TypeScript
- [ ] Route: `/tools/json-to-typescript`
- [ ] Input: JSON object
- [ ] Action: **Generate Interface** | Generate Type
- [ ] Logic: infer TypeScript types from JSON values (string, number, boolean, null, array, nested object)
- [ ] Output: TypeScript interface or type definition
- [ ] Related: `json-to-csharp`, `json-to-python`, `json-formatter`

### TASK 5.4 — JSON to Python Class
- [ ] Route: `/tools/json-to-python`
- [ ] Input: JSON object
- [ ] Action: **Generate Dataclass**
- [ ] Output: Python `@dataclass` with type hints
- [ ] Related: `json-to-typescript`, `json-to-java`

### TASK 5.5 — JSON to Java Class
- [ ] Route: `/tools/json-to-java`
- [ ] Input: JSON object
- [ ] Action: **Generate Class**
- [ ] Output: Java POJO with private fields + getters/setters
- [ ] Related: `json-to-csharp`, `json-to-python`

### TASK 5.6 — JSON ↔ YAML
- [ ] Route: `/tools/json-yaml`
- [ ] Install: `npm install js-yaml`
- [ ] Input: JSON or YAML textarea
- [ ] Actions: **JSON → YAML** | **YAML → JSON**
- [ ] Logic: `js-yaml` for parsing/stringifying
- [ ] Auto-detect input format on paste
- [ ] Related: `json-formatter`, `yaml-validator`, `json-xml`

### TASK 5.7 — JSON ↔ CSV
- [ ] Route: `/tools/json-csv`
- [ ] Input: JSON array OR CSV text
- [ ] Actions: **JSON → CSV** | **CSV → JSON**
- [ ] JSON→CSV: flatten JSON array to CSV using first object's keys as headers
- [ ] CSV→JSON: parse CSV to array of objects using first row as keys
- [ ] Related: `csv-to-json`, `csv-to-table`, `json-formatter`

### TASK 5.8 — JSON ↔ XML
- [ ] Route: `/tools/json-xml`
- [ ] Install: `npm install fast-xml-parser`
- [ ] Actions: **JSON → XML** | **XML → JSON**
- [ ] Related: `xml-formatter`, `json-formatter`, `json-yaml`

### TASK 5.9 — XML Formatter
- [ ] Route: `/tools/xml-formatter`
- [ ] Actions: **Format** | Minify | Validate
- [ ] Use `fast-xml-parser` for parse validation, custom indenting for format
- [ ] Related: `json-xml`, `json-formatter`, `yaml-validator`

### TASK 5.10 — YAML Validator
- [ ] Route: `/tools/yaml-validator`
- [ ] Install: `npm install js-yaml` (if not already)
- [ ] Action: **Validate** — shows "Valid YAML ✓" with parsed key count, or error with line number
- [ ] Secondary: **Format** — pretty-prints YAML
- [ ] Related: `json-yaml`, `json-formatter`

### TASK 5.11 — GUID / UUID Generator
- [ ] Route: `/tools/guid-generator`
- [ ] Controls: count input (1–100), version selector (v4, v7), uppercase toggle, hyphens toggle
- [ ] Action: **Generate** (primary) — uses `crypto.randomUUID()` for v4
- [ ] Output: list of generated UUIDs, one per line
- [ ] Copy all button
- [ ] Related: `hash-generator`, `password-gen`

### TASK 5.12 — JWT Decoder
- [ ] Route: `/tools/jwt-decoder`
- [ ] Input: JWT string
- [ ] Action: **Decode** — auto-fires on input change
- [ ] Display: three panels — Header (JSON) | Payload (JSON) | Signature (raw)
- [ ] Show decoded expiry date (`exp` claim) in human-readable format with "Expired" / "Valid" badge
- [ ] No signature verification (client-side only)
- [ ] Related: `base64`, `json-formatter`, `hash-generator`

### TASK 5.13 — Regex Tester
- [ ] Route: `/tools/regex-tester`
- [ ] Two inputs: Pattern input + Flags input (g, i, m, s checkboxes) + Test string textarea
- [ ] Live matching: highlight all matches in the test string as user types
- [ ] Show: match count + list of matches + capture groups
- [ ] Error: invalid regex shows red border on pattern input
- [ ] Related: `diff-checker`, `find-replace`

### TASK 5.14 — URL Encoder / Decoder
- [ ] Route: `/tools/url-encoder`
- [ ] Actions: **Encode** | **Decode**
- [ ] Use `encodeURIComponent` / `decodeURIComponent`
- [ ] Also offer full URL encode (`encodeURI`)
- [ ] Related: `base64`, `html-entities`

### TASK 5.15 — Base64 Encoder / Decoder
- [ ] Route: `/tools/base64`
- [ ] Actions: **Encode** | **Decode**
- [ ] Text mode: `btoa()` / `atob()` with UTF-8 handling
- [ ] File mode: drag-drop or file input → convert image/file to base64 data URL
- [ ] Related: `url-encoder`, `image-to-base64`, `html-entities`

### TASK 5.16 — HTML Entity Encoder
- [ ] Route: `/tools/html-entities`
- [ ] Actions: **Encode** | **Decode**
- [ ] Encode: convert `<`, `>`, `&`, `"`, `'` and extended chars to HTML entities
- [ ] Decode: reverse
- [ ] Related: `url-encoder`, `base64`

### TASK 5.17 — Hash Generator
- [ ] Route: `/tools/hash-generator`
- [ ] Input: text area
- [ ] Algorithms: MD5 (use `crypto-js`), SHA-1, SHA-256, SHA-512 (use native `crypto.subtle`)
- [ ] Action: **Generate All** — shows all hash outputs simultaneously
- [ ] Related: `file-hash`, `guid-generator`, `password-gen`

### TASK 5.18 — Cron Expression Parser
- [ ] Route: `/tools/cron-parser`
- [ ] Install: `npm install cronstrue`
- [ ] Input: cron expression (e.g. `*/5 * * * *`)
- [ ] Output: plain English description + next 10 run times
- [ ] Live update on input change
- [ ] Related: `timestamp`, `timezone`

### TASK 5.19 — SQL Formatter
- [ ] Route: `/tools/sql-formatter`
- [ ] Install: `npm install sql-formatter`
- [ ] Dialect selector: Generic | MySQL | PostgreSQL | SQLite | MSSQL
- [ ] Action: **Format** — uses `sql-formatter` library
- [ ] Related: `json-formatter`, `xml-formatter`

### TASK 5.20 — Markdown Previewer
- [ ] Route: `/tools/markdown-preview`
- [ ] Install: `npm install marked`
- [ ] Split-pane layout: input (left) + rendered preview (right)
- [ ] Live preview updates as user types
- [ ] Sanitize rendered HTML (use `DOMPurify` on client)
- [ ] Related: `diff-checker`, `word-counter`

### TASK 5.21 — Diff Checker
- [ ] Route: `/tools/diff-checker`
- [ ] Two textareas: Original | Modified
- [ ] Action: **Compare** — shows line-by-line diff
- [ ] Highlight: green for added lines, red for removed lines, gray for unchanged
- [ ] Show summary: X lines added, Y lines removed
- [ ] Related: `text-diff`, `markdown-preview`

### TASK 5.22 — Lorem Ipsum Generator
- [ ] Route: `/tools/lorem-ipsum`
- [ ] Controls: count input + type selector (Words | Sentences | Paragraphs)
- [ ] Action: **Generate** — uses hardcoded Lorem Ipsum corpus
- [ ] Copy button
- [ ] Related: `word-counter`, `slug-generator`

---

## EPIC 6 — Text Tools Implementation

### TASK 6.1 — Word & Character Counter
- [ ] Route: `/tools/word-counter`
- [ ] Input: large textarea
- [ ] Live stats: Words | Characters | Characters (no spaces) | Sentences | Paragraphs | Reading time
- [ ] Display stats as metric cards above/below the input
- [ ] Related: `case-converter`, `whitespace-cleaner`, `lorem-ipsum`

### TASK 6.2 — Case Converter
- [ ] Route: `/tools/case-converter`
- [ ] Input: textarea
- [ ] Actions (all buttons): UPPERCASE | lowercase | Title Case | Sentence case | camelCase | PascalCase | snake_case | kebab-case
- [ ] All conversions happen instantly on button click
- [ ] Related: `slug-generator`, `word-counter`

### TASK 6.3 — Slug Generator
- [ ] Route: `/tools/slug-generator`
- [ ] Input: text (e.g. "My Blog Post Title!")
- [ ] Live output: `my-blog-post-title`
- [ ] Options: separator (- or _), lowercase toggle, remove numbers toggle
- [ ] Related: `case-converter`, `url-encoder`

### TASK 6.4 — Text Diff (inline)
- [ ] Route: `/tools/text-diff`
- [ ] Two textareas: Text A | Text B
- [ ] Shows character-level or word-level diff with inline highlighting
- [ ] Note: different from `diff-checker` (line-level) — this is word/char level
- [ ] Related: `diff-checker`, `duplicate-remover`

### TASK 6.5 — Duplicate Line Remover
- [ ] Route: `/tools/duplicate-remover`
- [ ] Input: textarea (one item per line)
- [ ] Action: **Remove Duplicates**
- [ ] Options: case-sensitive toggle, trim whitespace toggle, sort result toggle
- [ ] Shows: X duplicates removed
- [ ] Related: `sort-lines`, `whitespace-cleaner`

### TASK 6.6 — Sort Lines
- [ ] Route: `/tools/sort-lines`
- [ ] Input: textarea
- [ ] Actions: **A→Z** | **Z→A** | **Shortest first** | **Longest first** | **Numeric**
- [ ] Options: case-sensitive toggle, trim toggle
- [ ] Related: `duplicate-remover`, `word-counter`

### TASK 6.7 — Reverse Text
- [ ] Route: `/tools/reverse-text`
- [ ] Actions: **Reverse all** (entire string) | **Reverse lines** (each line reversed) | **Reverse line order**
- [ ] Related: `case-converter`, `sort-lines`

### TASK 6.8 — Find & Replace
- [ ] Route: `/tools/find-replace`
- [ ] Inputs: Find field + Replace field + text textarea
- [ ] Options: case-sensitive toggle, regex mode toggle, whole word toggle
- [ ] Action: **Replace All** | **Replace Next**
- [ ] Highlights matches in input before replacing
- [ ] Related: `regex-tester`, `diff-checker`

### TASK 6.9 — Text ↔ Binary
- [ ] Route: `/tools/text-to-binary`
- [ ] Actions: **Text → Binary** | **Binary → Text**
- [ ] Shows each character's 8-bit binary representation separated by spaces
- [ ] Related: `base64`, `rot13`

### TASK 6.10 — ROT13 Cipher
- [ ] Route: `/tools/rot13`
- [ ] Single action: **Apply ROT13** (same button encodes and decodes — ROT13 is symmetric)
- [ ] Live conversion as user types
- [ ] Related: `text-encrypt`, `base64`

### TASK 6.11 — Whitespace Cleaner
- [ ] Route: `/tools/whitespace-cleaner`
- [ ] Actions: **Trim all lines** | **Remove blank lines** | **Normalize spaces** (collapse multiple spaces to one) | **Remove all whitespace**
- [ ] Related: `duplicate-remover`, `word-counter`

### TASK 6.12 — Text Encryptor (AES)
- [ ] Route: `/tools/text-encrypt`
- [ ] Install: `npm install crypto-js`
- [ ] Inputs: text textarea + passphrase input (masked)
- [ ] Actions: **Encrypt** | **Decrypt**
- [ ] Uses AES-256 via `CryptoJS.AES`
- [ ] Warning notice: "Encrypted output can only be decrypted with the same passphrase. We do not store your data or passphrase."
- [ ] Related: `hash-generator`, `base64`, `password-gen`

---

## EPIC 7 — Network Tools Implementation

> ⚠️ Network tools require external API calls. Use a lightweight serverless proxy (Next.js API routes) for CORS-blocked endpoints. All other tools remain client-side only.

### TASK 7.1 — IP Lookup
- [ ] Route: `/tools/ip-lookup`
- [ ] On load: auto-fetch user's own IP + details (use `https://ipapi.co/json/`)
- [ ] Input: IP address field for looking up other IPs
- [ ] Action: **Look Up**
- [ ] Show: IP, country, city, ISP, timezone, coordinates on a simple card
- [ ] Related: `dns-lookup`, `whois-lookup`

### TASK 7.2 — DNS Lookup
- [ ] Route: `/tools/dns-lookup`
- [ ] Input: domain name
- [ ] Record type selector: A | AAAA | MX | TXT | CNAME | NS | ALL
- [ ] Use Cloudflare DNS-over-HTTPS: `https://cloudflare-dns.com/dns-query`
- [ ] Display results in a clean table: type | name | value | TTL
- [ ] Related: `ip-lookup`, `whois-lookup`, `ssl-checker`

### TASK 7.3 — HTTP Headers Viewer
- [ ] Route: `/tools/http-headers`
- [ ] Create Next.js API route: `app/api/headers/route.ts` — fetches target URL server-side and returns response headers
- [ ] Input: URL field
- [ ] Action: **Fetch Headers**
- [ ] Display: each header as key-value row in a clean table
- [ ] Related: `ssl-checker`, `og-preview`

### TASK 7.4 — SSL Certificate Checker
- [ ] Route: `/tools/ssl-checker`
- [ ] Create Next.js API route to check SSL cert details (use Node's `tls.connect`)
- [ ] Input: domain name
- [ ] Show: issuer, subject, valid from, valid to, days remaining, SANs
- [ ] Color code: green = valid, red = expired/expiring soon (< 30 days)
- [ ] Related: `http-headers`, `dns-lookup`, `whois-lookup`

### TASK 7.5 — Whois Lookup
- [ ] Route: `/tools/whois-lookup`
- [ ] Use a public Whois API (e.g. `https://who-dat.as93.net/[domain]`)
- [ ] Show: registrar, creation date, expiry date, name servers, status
- [ ] Related: `dns-lookup`, `ip-lookup`

### TASK 7.6 — Open Graph Previewer
- [ ] Route: `/tools/og-preview`
- [ ] Create Next.js API route to fetch and parse OG meta tags from a URL
- [ ] Input: URL
- [ ] Show: previews of how the URL looks on Twitter, Facebook, LinkedIn (mocked card layouts)
- [ ] Display: og:title, og:description, og:image, og:url
- [ ] Related: `http-headers`, `robots-tester`

### TASK 7.7 — Robots.txt Tester
- [ ] Route: `/tools/robots-tester`
- [ ] Inputs: domain + path to test (e.g. `/admin/secret`)
- [ ] Fetch robots.txt via API route, parse rules, check if path is allowed/disallowed
- [ ] Show: "Allowed ✓" or "Blocked ✗" + which rule matched
- [ ] Related: `og-preview`, `http-headers`

### TASK 7.8 — URL Expander
- [ ] Route: `/tools/url-expander`
- [ ] Input: shortened URL (bit.ly, tinyurl, etc.)
- [ ] API route: follow redirects and return final destination URL
- [ ] Show: original → final URL with all intermediate redirect steps
- [ ] Related: `url-encoder`, `http-headers`

---

## EPIC 8 — Image Tools Implementation

### TASK 8.1 — Image to Base64
- [ ] Route: `/tools/image-to-base64`
- [ ] Input: file drop zone + file picker — accept images and any file
- [ ] On file select: use `FileReader.readAsDataURL()` to convert
- [ ] Output: data URL string in output textarea
- [ ] Also show: image preview + file size + base64 size
- [ ] Decode mode: paste base64, preview the image
- [ ] Related: `base64`, `favicon-generator`

### TASK 8.2 — SVG Optimizer
- [ ] Route: `/tools/svg-optimizer`
- [ ] Install: `npm install svgo` (runs in browser via WASM or use pure JS port)
- [ ] Input: SVG code textarea or file upload
- [ ] Action: **Optimize** — removes unnecessary attributes, comments, whitespace
- [ ] Show: original size → optimized size → % reduction
- [ ] Related: `image-to-base64`, `placeholder-image`

### TASK 8.3 — Favicon Generator
- [ ] Route: `/tools/favicon-generator`
- [ ] Input: image file upload (PNG/SVG recommended)
- [ ] Generate: 16×16, 32×32, 48×48, 180×180 (apple-touch), 192×192 PNG sizes using Canvas API
- [ ] Download each size individually or as a zip
- [ ] Related: `image-to-base64`, `svg-optimizer`

### TASK 8.4 — QR Code Generator
- [ ] Route: `/tools/qr-generator`
- [ ] Install: `npm install qrcode`
- [ ] Input: text / URL field
- [ ] Live preview: QR code updates as user types
- [ ] Options: size selector, error correction level, foreground/background color
- [ ] Download: PNG button
- [ ] Related: `placeholder-image`, `url-encoder`

### TASK 8.5 — Placeholder Image
- [ ] Route: `/tools/placeholder-image`
- [ ] Controls: width input + height input + background color picker + text color picker + label text
- [ ] Live preview: generates placeholder using Canvas API
- [ ] Output: data URL + `<img>` tag code + CSS background code
- [ ] Download: PNG button
- [ ] Related: `image-to-base64`, `qr-generator`

---

## EPIC 9 — Color Tools Implementation

### TASK 9.1 — Color Converter
- [ ] Route: `/tools/color-converter`
- [ ] Input: color value in any format (HEX, RGB, HSL, HSV, CMYK)
- [ ] Auto-detect input format
- [ ] Live output: all 5 formats simultaneously
- [ ] Large color preview swatch
- [ ] Copy each format individually
- [ ] Related: `color-palette`, `contrast-checker`, `gradient-generator`

### TASK 9.2 — Color Palette Generator
- [ ] Route: `/tools/color-palette`
- [ ] Input: base color picker
- [ ] Generate: Complementary | Analogous | Triadic | Tetradic | Monochromatic palettes
- [ ] Show 5 swatches per palette, each with HEX code + copy button
- [ ] Related: `color-converter`, `gradient-generator`, `contrast-checker`

### TASK 9.3 — CSS Gradient Generator
- [ ] Route: `/tools/gradient-generator`
- [ ] Visual builder: add/remove color stops, drag to reorder
- [ ] Controls: direction selector (linear) + angle slider + radial option
- [ ] Live preview: full-width gradient swatch
- [ ] Output: CSS `background` property code — copy button
- [ ] Related: `color-converter`, `color-palette`

### TASK 9.4 — Contrast Checker (WCAG)
- [ ] Route: `/tools/contrast-checker`
- [ ] Inputs: two color pickers (foreground + background)
- [ ] Calculate: contrast ratio per WCAG 2.1
- [ ] Show: ratio (e.g. 4.5:1) + AA pass/fail + AAA pass/fail for normal and large text
- [ ] Live preview: sample text rendered in the chosen colors
- [ ] Related: `color-converter`, `color-palette`

### TASK 9.5 — Tailwind Color Picker
- [ ] Route: `/tools/tailwind-colors`
- [ ] Display: full Tailwind CSS v3 color palette grid (all colors, all shades 50–950)
- [ ] Click any swatch: copies the class name (e.g. `blue-500`) or hex value to clipboard
- [ ] Toggle: copy class name vs copy hex
- [ ] Search: filter by color name
- [ ] Related: `color-converter`, `gradient-generator`

---

## EPIC 10 — Math Tools Implementation

### TASK 10.1 — Number Base Converter
- [ ] Route: `/tools/base-converter`
- [ ] Input: number + source base selector (2, 8, 10, 16)
- [ ] Live output: all four bases simultaneously (Binary | Octal | Decimal | Hexadecimal)
- [ ] Related: `roman-numerals`, `percentage-calc`

### TASK 10.2 — Percentage Calculator
- [ ] Route: `/tools/percentage-calc`
- [ ] Three calculator modes:
  - "X is what % of Y?"
  - "What is X% of Y?"
  - "% change from X to Y?"
- [ ] Live calculation as inputs change
- [ ] Related: `scientific-calc`, `base-converter`

### TASK 10.3 — Scientific Calculator
- [ ] Route: `/tools/scientific-calc`
- [ ] Full calculator UI with keyboard support
- [ ] Operations: +, -, ×, ÷, ^, √, log, ln, sin, cos, tan, π, e, factorial
- [ ] History: last 10 calculations shown below
- [ ] Related: `percentage-calc`, `random-number`

### TASK 10.4 — Roman Numeral Converter
- [ ] Route: `/tools/roman-numerals`
- [ ] Actions: **Arabic → Roman** | **Roman → Arabic**
- [ ] Input validation: Arabic must be 1–3999. Roman must be valid numeral string
- [ ] Related: `base-converter`, `percentage-calc`

### TASK 10.5 — Random Number Generator
- [ ] Route: `/tools/random-number`
- [ ] Controls: min input + max input + count input + decimal places input
- [ ] Options: unique numbers toggle, sorted toggle
- [ ] Action: **Generate**
- [ ] Uses `crypto.getRandomValues()` for cryptographically secure randomness
- [ ] Related: `guid-generator`, `password-gen`

---

## EPIC 11 — File Tools Implementation

### TASK 11.1 — CSV to JSON
- [ ] Route: `/tools/csv-to-json`
- [ ] Input: textarea (paste CSV) or file upload
- [ ] Options: has header row toggle, delimiter selector (, ; tab)
- [ ] Action: **Convert**
- [ ] Output: JSON array with keys from header row
- [ ] Related: `json-csv`, `csv-to-table`, `json-formatter`

### TASK 11.2 — CSV Table Viewer
- [ ] Route: `/tools/csv-to-table`
- [ ] Input: textarea (paste CSV) or file upload
- [ ] Render: HTML table with sortable columns (click header to sort A→Z or Z→A)
- [ ] Show: row count, column count
- [ ] Related: `csv-to-json`, `json-csv`

### TASK 11.3 — File Hash Calculator
- [ ] Route: `/tools/file-hash`
- [ ] Input: file drop zone / file picker — any file type, no size limit warning (large files may be slow)
- [ ] Algorithms: MD5, SHA-1, SHA-256, SHA-512
- [ ] Process entirely client-side: use `FileReader.readAsArrayBuffer()` + `crypto.subtle.digest()`
- [ ] Show all four hashes simultaneously after processing
- [ ] Progress bar for large files
- [ ] Related: `hash-generator`, `image-to-base64`

### TASK 11.4 — File Size Converter
- [ ] Route: `/tools/file-size`
- [ ] Input: number + unit selector (bytes, KB, MB, GB, TB, KiB, MiB, GiB)
- [ ] Live output: all units simultaneously, both decimal (SI) and binary (IEC)
- [ ] Related: `file-hash`, `base-converter`

---

## EPIC 12 — Date / Time / Misc Tools

### TASK 12.1 — Unix Timestamp Converter
- [ ] Route: `/tools/timestamp`
- [ ] Input: Unix timestamp (seconds or milliseconds — auto-detect)
- [ ] Live output: UTC datetime + local datetime + relative time ("3 hours ago")
- [ ] Reverse: input a date → output Unix timestamp
- [ ] Current time button: loads current timestamp
- [ ] Related: `timezone`, `date-diff`

### TASK 12.2 — Timezone Converter
- [ ] Route: `/tools/timezone`
- [ ] Inputs: datetime + source timezone + target timezone (searchable select with all IANA zones)
- [ ] Action: **Convert** — shows converted time
- [ ] World clock mode: show current time in 5 user-selectable cities simultaneously
- [ ] Related: `timestamp`, `date-diff`

### TASK 12.3 — Date Difference Calculator
- [ ] Route: `/tools/date-diff`
- [ ] Inputs: Start date + End date (date pickers)
- [ ] Output: difference in years, months, weeks, days, hours, minutes, seconds (all simultaneously)
- [ ] "From today" shortcut button
- [ ] Related: `timestamp`, `timezone`

### TASK 12.4 — Password Generator
- [ ] Route: `/tools/password-gen`
- [ ] Controls: length slider (8–128) + character set checkboxes (uppercase, lowercase, numbers, symbols)
- [ ] Generate on load + on change
- [ ] Copy button
- [ ] Uses `crypto.getRandomValues()` — never `Math.random()`
- [ ] Strength indicator shown alongside output
- [ ] Related: `password-strength`, `random-number`, `hash-generator`

### TASK 12.5 — Password Strength Checker
- [ ] Route: `/tools/password-strength`
- [ ] Input: password field (shown by default, toggle to hide)
- [ ] Live output: strength score (Weak / Fair / Good / Strong / Very Strong)
- [ ] Install: `npm install zxcvbn`
- [ ] Show: estimated crack time, pattern matches found, suggestions to improve
- [ ] Related: `password-gen`, `hash-generator`

---

## EPIC 13 — Static Pages

### TASK 13.1 — Favorites page
- [ ] Route: `/tools/favorites`
- [ ] Reads `getFavorites()` from localStorage
- [ ] Renders same `<ToolCard>` grid as home page
- [ ] Empty state: "No favorites yet. Star any tool to save it here." with a link back to `/tools`
- [ ] Client component (needs localStorage)

### TASK 13.2 — About page
- [ ] Route: `/tools/about`
- [ ] Content sections (see blueprint Section 10):
  - Mission statement
  - Privacy policy ("We collect no data...")
  - Tech stack
  - Dynamic tool count
- [ ] Static page — no client interactivity needed
- [ ] Link back to tool listing

---

## EPIC 14 — SEO & Performance

### TASK 14.1 — Meta tags & Open Graph
- [ ] Home page `generateMetadata()`:
  - `title`: "PandaPath Tools — Free Browser Tools for Developers"
  - `description`: "52+ free developer tools that run entirely in your browser. JSON formatter, regex tester, base64, UUID generator and more. No sign-up."
  - OG tags: title, description, url (`https://pandapath.com/tools`), type (`website`)
- [ ] Tool page `generateMetadata({ params })`:
  - `title`: `"{Tool Name} — PandaPath Tools"`
  - `description`: `"{tool.description} Free, online, runs in your browser."`
  - OG tags per tool
- [ ] Add `<link rel="canonical">` to all pages
- [ ] Add `robots` meta: `index, follow`

### TASK 14.2 — Sitemap
- [ ] Create `src/app/sitemap.ts` — Next.js auto-generates `sitemap.xml`
- [ ] Include: home page + all 52 tool pages + about + favorites
- [ ] `changeFrequency`: "monthly" for tool pages, "weekly" for home

### TASK 14.3 — robots.txt
- [ ] Create `src/app/robots.ts`
- [ ] Allow all: `User-agent: * / Allow: /`
- [ ] Point to sitemap URL

### TASK 14.4 — Performance
- [ ] Audit: each tool page bundle should not include other tools' libraries (verify code splitting)
- [ ] `dynamic(() => import('./tools/JsonFormatter'), { ssr: false })` pattern for heavy tool components
- [ ] Test: Lighthouse score target ≥ 90 on performance, SEO, accessibility
- [ ] Verify: no tool operation takes > 100ms on M1 Macbook (benchmark 10k char inputs)
- [ ] Image optimization: all images use Next.js `<Image>` component

### TASK 14.5 — Accessibility
- [ ] All form inputs have `<label>` elements
- [ ] All icon buttons have `aria-label` attributes
- [ ] Color contrast: all text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Keyboard navigation: all interactive elements reachable by Tab
- [ ] Focus rings: visible on all focusable elements
- [ ] Screen reader: `aria-live` regions for dynamic output changes

---

## EPIC 15 — Testing & QA

### TASK 15.1 — Tool correctness testing
- [ ] JSON Formatter: test with valid JSON, invalid JSON, nested JSON, arrays
- [ ] Base64: test round-trip encode → decode, Unicode characters, empty string
- [ ] Regex Tester: test with valid regex, invalid regex, global flag, groups
- [ ] Hash Generator: verify MD5/SHA outputs match known test vectors
- [ ] Timestamp: test epoch 0, negative timestamps, milliseconds vs seconds detection
- [ ] Password Generator: verify all character sets appear when selected, verify `crypto.getRandomValues` usage

### TASK 15.2 — Responsive testing
- [ ] Test home page at 375px (iPhone SE), 768px (iPad), 1280px (laptop), 1920px (desktop)
- [ ] Verify sidebar hides on mobile, category pills work as filter replacement
- [ ] Verify tool page inputs/outputs stack correctly on mobile
- [ ] Test hamburger menu on mobile

### TASK 15.3 — Dark mode testing
- [ ] Verify no flash of wrong theme on page load
- [ ] Verify all cards, inputs, outputs, and text are readable in dark mode
- [ ] Verify dark mode persists across page navigation and browser refresh
- [ ] Test system preference detection on first visit

### TASK 15.4 — localStorage edge cases
- [ ] Test in private/incognito mode (localStorage blocked) — verify graceful fallback, no errors
- [ ] Test favorites: add, remove, persist across refresh
- [ ] Test recently used: 10-item limit, deduplication, order preservation
- [ ] Test theme toggle persists

### TASK 15.5 — Cross-browser testing
- [ ] Chrome 90+: full regression
- [ ] Firefox 88+: full regression
- [ ] Safari 14+: pay special attention to `crypto.subtle`, clipboard API
- [ ] Mobile Chrome (Android): verify touch targets, layout
- [ ] Mobile Safari (iOS): verify file upload, clipboard

---

## EPIC 16 — Deployment

### TASK 16.1 — Production build
- [ ] Run `npm run build` — verify 0 errors
- [ ] Check that all 52 tool pages are statically generated (see `/.next/server/app/tools/` directory)
- [ ] Verify `sitemap.xml` and `robots.txt` are generated
- [ ] Check bundle sizes: no tool page should add > 50KB to the total bundle

### TASK 16.2 — Deploy to PandaPath domain
- [ ] Configure hosting (Vercel recommended for Next.js) to serve from `pandapath.com/tools`
- [ ] Set `basePath` and `assetPrefix` in `next.config.js` if needed
- [ ] Test production deployment: visit `pandapath.com/tools` and verify all routes work
- [ ] Verify `pandapath.com/tools/json-formatter` returns 200, not 404
- [ ] Verify sitemap at `pandapath.com/tools/sitemap.xml`

### TASK 16.3 — Post-deploy verification
- [ ] Submit sitemap to Google Search Console
- [ ] Test Cmd+K overlay in production
- [ ] Test all localStorage features in production
- [ ] Run Lighthouse on production URL, record baseline scores
- [ ] Verify no console errors on any tool page

---

## Summary

| Epic | Description | Est. Tasks |
|------|-------------|-----------|
| 1 | Setup & Infrastructure | 4 |
| 2 | Shared Layout Components | 5 |
| 3 | Home Page | 3 |
| 4 | Tool Page Shell | 2 |
| 5 | Developer Tools (22) | 22 |
| 6 | Text Tools (12) | 12 |
| 7 | Network Tools (8) | 8 |
| 8 | Image Tools (5) | 5 |
| 9 | Color Tools (5) | 5 |
| 10 | Math Tools (5) | 5 |
| 11 | File Tools (4) | 4 |
| 12 | Date / Misc Tools (5) | 5 |
| 13 | Static Pages | 2 |
| 14 | SEO & Performance | 5 |
| 15 | Testing & QA | 5 |
| 16 | Deployment | 3 |
| **Total** | | **100 tasks** |

---

## Critical constraints (never break these)

- ❌ NO sign-in, auth, or user accounts of any kind
- ❌ NO server-side processing of tool inputs (network tools are the only exception, and only for CORS proxying)
- ❌ NO ads or tracking scripts
- ✅ EVERY tool must have its own URL `/tools/[slug]`
- ✅ localStorage must fail silently in private mode — never throw
- ✅ Dark mode must apply before first paint (inline script in `<head>`)
- ✅ All 52 tool pages must be statically generated at build time
