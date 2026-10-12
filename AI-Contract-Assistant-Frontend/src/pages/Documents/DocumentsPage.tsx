import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Upload, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { UploadDialog } from "@/components/documents/UploadDialog";
import { useToast } from "@/components/ui/Toast";
import { documentService } from "@/services/documentService";
import { formatRelativeDate } from "@/lib/utils";
import type { ContractDocument } from "@/types";

export function DocumentsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ContractDocument[] | null>(null);
  const [query, setQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    documentService.list().then(setDocuments);
  }, []);

  const filtered = useMemo(() => {
    if (!documents) return [];
    if (!query.trim()) return documents;
    return documents.filter((doc) =>
      doc.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [documents, query]);

  const handleUploadComplete = async (file: File) => {
    const uploadedDocument = await documentService.upload(file);

    setDocuments((prev) =>
      prev ? [uploadedDocument, ...prev] : [uploadedDocument],
    );

    toast({
      title: "Upload complete",
      description: `${file.name} is now processing.`,
      variant: "success",
    });

    navigate(`/documents/${uploadedDocument.id}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
            Documents
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            All contracts uploaded for AI-assisted review.
          </p>
        </div>
        <Button variant="brand" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents..."
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
        {documents === null ? (
          <div className="divide-y divide-ink-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4">
                <Skeleton className="h-5 w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-2">
            <EmptyState
              icon={FileText}
              title={
                query ? "No documents match your search" : "No documents yet"
              }
              description={
                query
                  ? "Try a different search term."
                  : "Upload your first contract to get started."
              }
              action={
                !query && (
                  <Button variant="brand" onClick={() => setUploadOpen(true)}>
                    <Upload className="h-4 w-4" />
                    Upload contract
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60 text-xs font-medium uppercase tracking-wide text-ink-500">
                <th className="px-5 py-3 font-medium">Document name</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Pages</th>
                <th className="px-5 py-3 font-medium">Uploaded</th>
                <th className="w-10 px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => navigate(`/documents/${doc.id}`)}
                  className="cursor-pointer transition-colors hover:bg-ink-50/60"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                        <FileText className="h-4 w-4 text-brand-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink-900">
                          {doc.name}
                        </p>
                        <p className="truncate text-xs text-ink-500">
                          {doc.contractType}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-5 py-4 text-ink-600">{doc.pages} pages</td>
                  <td className="px-5 py-4 text-ink-600">
                    {formatRelativeDate(doc.uploadedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <ChevronRight className="h-4 w-4 text-ink-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
