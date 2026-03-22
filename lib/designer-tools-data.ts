/** 52 designer-focused tools from designer_tools_audit.html — category `designer` */
export const designerToolsData: {
  slug: string;
  name: string;
  description: string;
  category: "designer";
  icon: string;
  tags: string[];
  related: string[];
}[] = [
  // Color (12)
  {
    slug: "tint-shade-generator",
    name: "Tint & Shade Generator",
    description: "Generate a 10-step tint/shade scale from any base color (HSL).",
    category: "designer",
    icon: "TS",
    tags: ["color", "palette", "hsl"],
    related: ["color-harmonies", "brand-palette-builder", "tailwind-config-generator"]
  },
  {
    slug: "color-harmonies",
    name: "Color Harmonies",
    description: "Complementary, split-complement, analogous, triadic — hex codes from one base.",
    category: "designer",
    icon: "CH",
    tags: ["color", "wheel", "harmony"],
    related: ["tint-shade-generator", "color-converter", "gradient-generator"]
  },
  {
    slug: "design-token-exporter",
    name: "Design Token Exporter",
    description: "Export colors as CSS variables, Tailwind config snippets, SCSS, or JSON tokens.",
    category: "designer",
    icon: "DT",
    tags: ["tokens", "css", "tailwind"],
    related: ["tailwind-config-generator", "css-color-variables", "figma-variable-importer"]
  },
  {
    slug: "brand-palette-builder",
    name: "Brand Palette Builder",
    description: "Build a brand palette — primary, secondary, neutral, semantic swatches.",
    category: "designer",
    icon: "BP",
    tags: ["brand", "palette", "design system"],
    related: ["tint-shade-generator", "design-token-exporter", "color-palette"]
  },
  {
    slug: "color-name-finder",
    name: "Color Name Finder",
    description: "Map any hex to the nearest common color name for documentation.",
    category: "designer",
    icon: "CN",
    tags: ["hex", "naming", "accessibility"],
    related: ["color-converter", "tailwind-colors", "accessible-color-pairs"]
  },
  {
    slug: "palette-from-image",
    name: "Palette from Image",
    description: "Upload an image and extract a dominant color palette (5–10 swatches).",
    category: "designer",
    icon: "PI",
    tags: ["image", "palette", "canvas"],
    related: ["image-to-base64", "color-palette", "placeholder-image"]
  },
  {
    slug: "accessible-color-pairs",
    name: "Accessible Color Pairs",
    description: "Suggest foreground colors for a background that pass WCAG AA/AAA.",
    category: "designer",
    icon: "AP",
    tags: ["wcag", "contrast", "a11y"],
    related: ["contrast-checker", "dark-mode-color-generator", "color-converter"]
  },
  {
    slug: "dark-mode-color-generator",
    name: "Dark Mode Color Generator",
    description: "Generate dark-mode-friendly equivalents from a light palette (HSL).",
    category: "designer",
    icon: "DM",
    tags: ["dark mode", "theme", "hsl"],
    related: ["accessible-color-pairs", "tint-shade-generator", "contrast-checker"]
  },
  {
    slug: "opacity-alpha-calculator",
    name: "Opacity / Alpha Calculator",
    description: "Preview a color at different opacities on white and dark backgrounds.",
    category: "designer",
    icon: "OA",
    tags: ["alpha", "opacity", "rgba"],
    related: ["color-converter", "gradient-generator", "css-filter-generator"]
  },
  {
    slug: "css-color-variables",
    name: "CSS Color Variables",
    description: "Turn a list of colors into ready-to-paste CSS custom property declarations.",
    category: "designer",
    icon: "CV",
    tags: ["css", "variables", "tokens"],
    related: ["design-token-exporter", "css-variable-converter", "tailwind-config-generator"]
  },
  {
    slug: "figma-variable-importer",
    name: "Figma Variable Importer",
    description: "Paste Figma variables JSON and convert to CSS / Tailwind / SCSS.",
    category: "designer",
    icon: "FV",
    tags: ["figma", "json", "tokens"],
    related: ["design-token-exporter", "figma-to-css", "tailwind-config-generator"]
  },
  {
    slug: "color-blindness-simulator",
    name: "Color Blindness Simulator",
    description: "Preview an image with Deuteranopia / Protanopia / Tritanopia filters (canvas).",
    category: "designer",
    icon: "CB",
    tags: ["a11y", "vision", "image"],
    related: ["accessible-color-pairs", "palette-from-image", "image-to-base64"]
  },
  // Typography (10)
  {
    slug: "type-scale-generator",
    name: "Type Scale Generator",
    description: "Modular type scales (Major Third, Perfect Fourth, …) with CSS output.",
    category: "designer",
    icon: "TY",
    tags: ["typography", "scale", "css"],
    related: ["fluid-typography", "px-rem-em-converter", "line-height-calculator"]
  },
  {
    slug: "line-height-calculator",
    name: "Line Height Calculator",
    description: "Compute line-height from font size and measure for readable body text.",
    category: "designer",
    icon: "LH",
    tags: ["line-height", "typography", "readability"],
    related: ["type-scale-generator", "px-rem-em-converter", "responsive-font-previewer"]
  },
  {
    slug: "font-pairing-preview",
    name: "Font Pairing Preview",
    description: "Preview heading + body Google Font pairings with live sample text.",
    category: "designer",
    icon: "FP",
    tags: ["fonts", "google fonts", "pairing"],
    related: ["google-fonts-css-generator", "css-font-stack-generator", "variable-font-tester"]
  },
  {
    slug: "letter-spacing-converter",
    name: "Letter Spacing Converter",
    description: "Convert tracking (pt) to CSS letter-spacing (em/px).",
    category: "designer",
    icon: "LS",
    tags: ["tracking", "letter-spacing", "figma"],
    related: ["px-rem-em-converter", "fluid-typography", "type-scale-generator"]
  },
  {
    slug: "px-rem-em-converter",
    name: "px / rem / em Converter",
    description: "Convert font sizes between px, rem, em, and pt with a custom root size.",
    category: "designer",
    icon: "PX",
    tags: ["px", "rem", "em", "units"],
    related: ["css-units-converter", "fluid-typography", "letter-spacing-converter"]
  },
  {
    slug: "fluid-typography",
    name: "Fluid Typography",
    description: "Generate CSS clamp() for fluid font sizes between two breakpoints.",
    category: "designer",
    icon: "FL",
    tags: ["clamp", "responsive", "css"],
    related: ["type-scale-generator", "responsive-font-previewer", "px-rem-em-converter"]
  },
  {
    slug: "google-fonts-css-generator",
    name: "Google Fonts CSS Generator",
    description: "Pick families and weights; copy optimized @import or link tags.",
    category: "designer",
    icon: "GF",
    tags: ["google fonts", "css", "webfonts"],
    related: ["font-pairing-preview", "css-font-stack-generator", "variable-font-tester"]
  },
  {
    slug: "css-font-stack-generator",
    name: "CSS Font Stack Generator",
    description: "Build safe font-family stacks with system fallbacks.",
    category: "designer",
    icon: "FS",
    tags: ["font-stack", "system fonts", "css"],
    related: ["google-fonts-css-generator", "font-pairing-preview", "variable-font-tester"]
  },
  {
    slug: "variable-font-tester",
    name: "Variable Font Tester",
    description: "Adjust variable font axes (weight, width, optical size) with sliders.",
    category: "designer",
    icon: "VF",
    tags: ["variable font", "css", "sliders"],
    related: ["google-fonts-css-generator", "font-pairing-preview", "css-font-stack-generator"]
  },
  {
    slug: "responsive-font-previewer",
    name: "Responsive Font Previewer",
    description: "Preview the same text at mobile, tablet, and desktop sizes side by side.",
    category: "designer",
    icon: "RF",
    tags: ["responsive", "preview", "typography"],
    related: ["fluid-typography", "type-scale-generator", "google-fonts-css-generator"]
  },
  // Layout & spacing (9)
  {
    slug: "spacing-scale-generator",
    name: "Spacing Scale Generator",
    description: "4px or 8px base spacing scales — export CSS vars or Tailwind-style keys.",
    category: "designer",
    icon: "SP",
    tags: ["spacing", "scale", "design tokens"],
    related: ["tailwind-config-generator", "border-radius-generator", "css-grid-generator"]
  },
  {
    slug: "css-grid-generator",
    name: "CSS Grid Generator",
    description: "Visual grid: columns, rows, gaps — outputs grid-template CSS.",
    category: "designer",
    icon: "GR",
    tags: ["grid", "css", "layout"],
    related: ["flexbox-playground", "container-query-helper", "aspect-ratio-calculator"]
  },
  {
    slug: "flexbox-playground",
    name: "Flexbox Playground",
    description: "Tweak flex properties with live preview and copyable CSS.",
    category: "designer",
    icon: "FX",
    tags: ["flexbox", "css", "layout"],
    related: ["css-grid-generator", "border-radius-generator", "box-shadow-generator"]
  },
  {
    slug: "border-radius-generator",
    name: "Border Radius Generator",
    description: "Set each corner independently with live preview and shorthand CSS.",
    category: "designer",
    icon: "BR",
    tags: ["radius", "css", "corners"],
    related: ["box-shadow-generator", "clip-path-generator", "flexbox-playground"]
  },
  {
    slug: "box-shadow-generator",
    name: "Box Shadow Generator",
    description: "Build box-shadow layers: offset, blur, spread, color, inset.",
    category: "designer",
    icon: "BS",
    tags: ["shadow", "css", "effects"],
    related: ["border-radius-generator", "css-filter-generator", "figma-to-css"]
  },
  {
    slug: "aspect-ratio-calculator",
    name: "Aspect Ratio Calculator",
    description: "Solve width/height from aspect ratio (16:9, 4:3, or custom).",
    category: "designer",
    icon: "AR",
    tags: ["aspect ratio", "layout", "math"],
    related: ["px-to-viewport", "css-grid-generator", "placeholder-image"]
  },
  {
    slug: "px-to-viewport",
    name: "px to Viewport Units",
    description: "Convert px to vw, vh, vmin, or vmax for a given viewport size.",
    category: "designer",
    icon: "VW",
    tags: ["vw", "vh", "responsive"],
    related: ["css-units-converter", "px-rem-em-converter", "fluid-typography"]
  },
  {
    slug: "container-query-helper",
    name: "Container Query Helper",
    description: "Generate @container query snippets with size conditions.",
    category: "designer",
    icon: "CQ",
    tags: ["container queries", "css", "responsive"],
    related: ["css-grid-generator", "breakpoint-visualizer", "flexbox-playground"]
  },
  {
    slug: "breakpoint-visualizer",
    name: "Breakpoint Visualizer",
    description: "Preview a URL at common breakpoints (iframe; some sites block embedding).",
    category: "designer",
    icon: "BK",
    tags: ["breakpoints", "responsive", "preview"],
    related: ["responsive-font-previewer", "container-query-helper", "og-preview"]
  },
  // Assets & export (8)
  {
    slug: "svg-to-css-background",
    name: "SVG to CSS Background",
    description: "Encode SVG markup as a CSS background-image data URI.",
    category: "designer",
    icon: "SB",
    tags: ["svg", "css", "data uri"],
    related: ["svg-optimizer", "data-uri-encoder", "css-pattern-generator"]
  },
  {
    slug: "css-pattern-generator",
    name: "CSS Pattern Generator",
    description: "Pure CSS background patterns — dots, lines, grid, checkerboard.",
    category: "designer",
    icon: "CP",
    tags: ["pattern", "css", "background"],
    related: ["gradient-generator", "box-shadow-generator", "svg-to-css-background"]
  },
  {
    slug: "icon-font-generator",
    name: "Icon Font Generator",
    description: "Bundle SVGs into an icon font + CSS (advanced; may use heavy client libs).",
    category: "designer",
    icon: "IF",
    tags: ["icons", "font", "svg"],
    related: ["svg-optimizer", "favicon-generator", "data-uri-encoder"]
  },
  {
    slug: "social-media-image-sizes",
    name: "Social Media Image Sizes",
    description: "Reference dimensions for Twitter, OG, LinkedIn, Instagram, and more.",
    category: "designer",
    icon: "SM",
    tags: ["social", "sizes", "reference"],
    related: ["placeholder-image", "og-preview", "qr-generator"]
  },
  {
    slug: "image-sprite-generator",
    name: "Image Sprite Generator",
    description: "Combine images into one sprite sheet with CSS background positions.",
    category: "designer",
    icon: "IS",
    tags: ["sprite", "canvas", "css"],
    related: ["image-to-base64", "placeholder-image", "favicon-generator"]
  },
  {
    slug: "data-uri-encoder",
    name: "Data URI Encoder",
    description: "Encode any file to a base64 data URI for inline CSS or HTML.",
    category: "designer",
    icon: "DU",
    tags: ["base64", "data uri", "assets"],
    related: ["base64", "svg-to-css-background", "image-to-base64"]
  },
  {
    slug: "favicon-checker",
    name: "Favicon Checker",
    description: "Given a URL, list common favicon link tags the site exposes.",
    category: "designer",
    icon: "FC",
    tags: ["favicon", "meta", "seo"],
    related: ["favicon-generator", "og-preview", "http-headers"]
  },
  {
    slug: "lottie-viewer",
    name: "Lottie Viewer",
    description: "Upload Lottie JSON and preview animation in the browser.",
    category: "designer",
    icon: "LO",
    tags: ["lottie", "animation", "json"],
    related: ["qr-generator", "image-to-base64", "css-animation-generator"]
  },
  // Design to code (8)
  {
    slug: "css-units-converter",
    name: "CSS Units Converter",
    description: "Convert px ↔ rem ↔ em ↔ pt ↔ vw in one place with shared root size.",
    category: "designer",
    icon: "CU",
    tags: ["units", "css", "conversion"],
    related: ["px-rem-em-converter", "px-to-viewport", "figma-to-css"]
  },
  {
    slug: "figma-to-css",
    name: "Figma to CSS",
    description: "Paste Figma inspect strings and normalize to clean CSS (shadows, colors, radius).",
    category: "designer",
    icon: "F2",
    tags: ["figma", "css", "handoff"],
    related: ["box-shadow-generator", "border-radius-generator", "tailwind-config-generator"]
  },
  {
    slug: "tailwind-config-generator",
    name: "Tailwind Config Generator",
    description: "Build a tailwind.config.js theme from brand colors, fonts, and spacing.",
    category: "designer",
    icon: "TW",
    tags: ["tailwind", "config", "design system"],
    related: ["tailwind-colors", "design-token-exporter", "spacing-scale-generator"]
  },
  {
    slug: "css-animation-generator",
    name: "CSS Animation Generator",
    description: "Compose @keyframes with duration, easing, and transform properties.",
    category: "designer",
    icon: "CA",
    tags: ["keyframes", "animation", "css"],
    related: ["cubic-bezier-editor", "css-transition-builder", "css-filter-generator"]
  },
  {
    slug: "css-filter-generator",
    name: "CSS Filter Generator",
    description: "Stack filter(): blur, brightness, contrast, hue-rotate, and more.",
    category: "designer",
    icon: "CF",
    tags: ["filter", "css", "effects"],
    related: ["box-shadow-generator", "clip-path-generator", "css-animation-generator"]
  },
  {
    slug: "svg-path-editor",
    name: "SVG Path Editor",
    description: "Edit SVG path d commands with live canvas preview.",
    category: "designer",
    icon: "PE",
    tags: ["svg", "path", "vector"],
    related: ["svg-optimizer", "clip-path-generator", "svg-to-css-background"]
  },
  {
    slug: "clip-path-generator",
    name: "Clip Path Generator",
    description: "Build clip-path polygons, circles, and ellipses with live preview.",
    category: "designer",
    icon: "CL",
    tags: ["clip-path", "css", "shapes"],
    related: ["border-radius-generator", "svg-path-editor", "css-filter-generator"]
  },
  {
    slug: "css-variable-converter",
    name: "CSS Variable Converter",
    description: "Replace repeated values in pasted CSS with var(--token) declarations.",
    category: "designer",
    icon: "VX",
    tags: ["css variables", "refactor", "tokens"],
    related: ["css-color-variables", "design-token-exporter", "tailwind-config-generator"]
  },
  // Motion (5)
  {
    slug: "cubic-bezier-editor",
    name: "Cubic Bezier Editor",
    description: "Edit cubic-bezier() with presets and live CSS transition preview.",
    category: "designer",
    icon: "BE",
    tags: ["easing", "bezier", "css"],
    related: ["css-transition-builder", "css-animation-generator", "spring-animation-calculator"]
  },
  {
    slug: "css-transition-builder",
    name: "CSS Transition Builder",
    description: "Build transition shorthand: property, duration, timing, delay.",
    category: "designer",
    icon: "TR",
    tags: ["transition", "css", "motion"],
    related: ["cubic-bezier-editor", "animation-duration-guide", "css-animation-generator"]
  },
  {
    slug: "spring-animation-calculator",
    name: "Spring Animation Calculator",
    description: "Approximate spring parameters for CSS or motion libraries.",
    category: "designer",
    icon: "SG",
    tags: ["spring", "motion", "physics"],
    related: ["cubic-bezier-editor", "css-animation-generator", "lottie-to-css-converter"]
  },
  {
    slug: "animation-duration-guide",
    name: "Animation Duration Guide",
    description: "Compare common durations (100ms–1000ms) with a live pulse demo.",
    category: "designer",
    icon: "AD",
    tags: ["duration", "ux", "motion"],
    related: ["css-transition-builder", "cubic-bezier-editor", "css-animation-generator"]
  },
  {
    slug: "lottie-to-css-converter",
    name: "Lottie to CSS Converter",
    description: "Experimental: map simple Lottie motion to CSS keyframes (limited cases).",
    category: "designer",
    icon: "LC",
    tags: ["lottie", "keyframes", "export"],
    related: ["lottie-viewer", "css-animation-generator", "cubic-bezier-editor"]
  }
];
