import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function UploadZone({
  onFileSelected,
}: {
  onFileSelected: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be 10 MB or less.");
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [onFileSelected],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors",
        isDragging
          ? "border-brand-500 bg-brand-50/50"
          : "border-ink-200 bg-ink-50/40",
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-ink-200">
        <UploadCloud className="h-5 w-5 text-brand-500" />
      </div>
      <p className="text-sm font-medium text-ink-900">
        Drag &amp; drop a PDF here
      </p>
      <p className="mt-1 text-xs text-ink-500">or</p>
      <Button
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={() => inputRef.current?.click()}
      >
        Browse files
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
      <p className="mt-4 text-xs text-ink-400">PDF up to 60MB</p>
    </div>
  );
}
