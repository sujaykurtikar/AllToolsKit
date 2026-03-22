"use client";

import {
  AccessibleColorPairs,
  BrandPaletteBuilder,
  ColorBlindnessSimulator,
  ColorHarmoniesTool,
  ColorNameFinder,
  CssColorVariables,
  DarkModeColorGenerator,
  DesignTokenExporter,
  FigmaVariableImporter,
  OpacityAlphaCalculator,
  PaletteFromImage,
  TintShadeGenerator
} from "@/components/tool-sections/designer/color-tools";
import {
  BoxShadowGenerator,
  CubicBezierEditor,
  LineHeightCalculator,
  PxRemEmConverter,
  SpacingScaleGenerator,
  TypeScaleGenerator
} from "@/components/tool-sections/designer/core";
import {
  CssAnimationGenerator,
  ClipPathGenerator,
  CssFilterGenerator,
  CssUnitsConverter,
  CssVariableConverter,
  FigmaToCss,
  SvgPathEditor,
  TailwindConfigGenerator
} from "@/components/tool-sections/designer/code-tools";
import {
  AspectRatioCalculator,
  BorderRadiusGenerator,
  BreakpointVisualizer,
  ContainerQueryHelper,
  CssGridGenerator,
  FlexboxPlayground,
  PxToViewport
} from "@/components/tool-sections/designer/layout-tools";
import {
  AnimationDurationGuide,
  CssTransitionBuilder,
  LottieToCssConverter,
  SpringAnimationCalculator
} from "@/components/tool-sections/designer/motion-tools";
import {
  CssFontStackGenerator,
  FluidTypography,
  FontPairingPreview,
  GoogleFontsCssGenerator,
  LetterSpacingConverter,
  ResponsiveFontPreviewer,
  VariableFontTester
} from "@/components/tool-sections/designer/typography-tools";
import {
  CssPatternGenerator,
  DataUriEncoder,
  FaviconChecker,
  IconFontGenerator,
  ImageSpriteGenerator,
  LottieViewer,
  SocialMediaImageSizes,
  SvgToCssBackground
} from "@/components/tool-sections/designer/assets-tools";

export function DesignerSection({ slug }: { slug: string }) {
  switch (slug) {
    case "px-rem-em-converter":
      return <PxRemEmConverter />;
    case "type-scale-generator":
      return <TypeScaleGenerator />;
    case "spacing-scale-generator":
      return <SpacingScaleGenerator />;
    case "box-shadow-generator":
      return <BoxShadowGenerator />;
    case "cubic-bezier-editor":
      return <CubicBezierEditor />;
    case "line-height-calculator":
      return <LineHeightCalculator />;
    case "tint-shade-generator":
      return <TintShadeGenerator />;
    case "color-harmonies":
      return <ColorHarmoniesTool />;
    case "design-token-exporter":
      return <DesignTokenExporter />;
    case "brand-palette-builder":
      return <BrandPaletteBuilder />;
    case "color-name-finder":
      return <ColorNameFinder />;
    case "palette-from-image":
      return <PaletteFromImage />;
    case "accessible-color-pairs":
      return <AccessibleColorPairs />;
    case "dark-mode-color-generator":
      return <DarkModeColorGenerator />;
    case "opacity-alpha-calculator":
      return <OpacityAlphaCalculator />;
    case "css-color-variables":
      return <CssColorVariables />;
    case "figma-variable-importer":
      return <FigmaVariableImporter />;
    case "color-blindness-simulator":
      return <ColorBlindnessSimulator />;
    case "font-pairing-preview":
      return <FontPairingPreview />;
    case "letter-spacing-converter":
      return <LetterSpacingConverter />;
    case "fluid-typography":
      return <FluidTypography />;
    case "google-fonts-css-generator":
      return <GoogleFontsCssGenerator />;
    case "css-font-stack-generator":
      return <CssFontStackGenerator />;
    case "variable-font-tester":
      return <VariableFontTester />;
    case "responsive-font-previewer":
      return <ResponsiveFontPreviewer />;
    case "css-grid-generator":
      return <CssGridGenerator />;
    case "flexbox-playground":
      return <FlexboxPlayground />;
    case "border-radius-generator":
      return <BorderRadiusGenerator />;
    case "aspect-ratio-calculator":
      return <AspectRatioCalculator />;
    case "px-to-viewport":
      return <PxToViewport />;
    case "container-query-helper":
      return <ContainerQueryHelper />;
    case "breakpoint-visualizer":
      return <BreakpointVisualizer />;
    case "svg-to-css-background":
      return <SvgToCssBackground />;
    case "css-pattern-generator":
      return <CssPatternGenerator />;
    case "icon-font-generator":
      return <IconFontGenerator />;
    case "social-media-image-sizes":
      return <SocialMediaImageSizes />;
    case "image-sprite-generator":
      return <ImageSpriteGenerator />;
    case "data-uri-encoder":
      return <DataUriEncoder />;
    case "favicon-checker":
      return <FaviconChecker />;
    case "lottie-viewer":
      return <LottieViewer />;
    case "css-units-converter":
      return <CssUnitsConverter />;
    case "figma-to-css":
      return <FigmaToCss />;
    case "tailwind-config-generator":
      return <TailwindConfigGenerator />;
    case "css-animation-generator":
      return <CssAnimationGenerator />;
    case "css-filter-generator":
      return <CssFilterGenerator />;
    case "svg-path-editor":
      return <SvgPathEditor />;
    case "clip-path-generator":
      return <ClipPathGenerator />;
    case "css-variable-converter":
      return <CssVariableConverter />;
    case "css-transition-builder":
      return <CssTransitionBuilder />;
    case "spring-animation-calculator":
      return <SpringAnimationCalculator />;
    case "animation-duration-guide":
      return <AnimationDurationGuide />;
    case "lottie-to-css-converter":
      return <LottieToCssConverter />;
    default:
      return null;
  }
}
