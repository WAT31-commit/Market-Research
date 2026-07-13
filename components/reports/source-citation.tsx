import { BookText } from "lucide-react";

export function SourceCitation({ source }: { source: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <BookText className="size-3" />
      Source: {source}
    </p>
  );
}
