import { ToolBrowser } from "@/components/tool-browser";
import { tools } from "@/data/tools";

export default function HomePage() {
  return (
    <ToolBrowser
      eyebrow="Static Developer Tools"
      title="Fast browser tools for everyday development work."
      description="AllToolsKit bundles practical utilities into a cleaner, more searchable interface with client-side processing only."
      tools={tools}
    />
  );
}
