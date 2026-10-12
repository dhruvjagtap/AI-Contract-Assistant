import { Badge } from "@/components/ui/Badge";
import type { DocumentStatus } from "@/types";

const statusConfig: Record<
  DocumentStatus,
  { label: string; variant: "success" | "warning" | "danger" | "brand" }
> = {
  uploaded: { label: "Uploaded", variant: "brand" },
  ready: { label: "Ready", variant: "success" },
  processing: { label: "Processing", variant: "warning" },
  uploading: { label: "Uploading", variant: "brand" },
  failed: { label: "Failed", variant: "danger" },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  // console.log("STATUS FROM BACKEND:", status);

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
}
