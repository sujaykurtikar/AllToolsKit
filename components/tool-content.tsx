"use client";

import { getToolBySlug } from "@/data/tools";

import { ColorSection } from "@/components/tool-sections/color";
import { DateSection } from "@/components/tool-sections/date";
import { DeveloperSection } from "@/components/tool-sections/developer";
import { FileSection } from "@/components/tool-sections/file";
import { ImageSection } from "@/components/tool-sections/image";
import { MathSection } from "@/components/tool-sections/math";
import { NetworkSection } from "@/components/tool-sections/network";
import { TextSection } from "@/components/tool-sections/text";

export function ToolContent({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  if (!tool) {
    return <p className="text-[var(--text-secondary)]">Tool not found.</p>;
  }
  switch (tool.category) {
    case "developer":
      return <DeveloperSection slug={slug} />;
    case "text":
      return <TextSection slug={slug} />;
    case "network":
      return <NetworkSection slug={slug} />;
    case "image":
      return <ImageSection slug={slug} />;
    case "color":
      return <ColorSection slug={slug} />;
    case "math":
      return <MathSection slug={slug} />;
    case "file":
      return <FileSection slug={slug} />;
    case "date":
      return <DateSection slug={slug} />;
    default:
      return null;
  }
}
