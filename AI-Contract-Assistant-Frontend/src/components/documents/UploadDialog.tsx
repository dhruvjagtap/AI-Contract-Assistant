import { useState } from "react";

import { FileText, X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { UploadZone } from "@/components/documents/UploadZone";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { formatFileSize } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "done" | "error";

export function UploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (file: File) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<UploadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const startUpload = async (selected: File) => {
    setFile(selected);
    setState("uploading");
    setProgress(0);
    setErrorMessage("");

    try {
      await onUploadComplete(selected);

      setProgress(100);
      setState("done");

      setTimeout(() => {
        reset();
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload the document.",
      );

      setState("error");
    }
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setState("idle");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (state === "uploading") return;

        if (!next) {
          reset();
        } else {
          onOpenChange(next);
        }
      }}
    >
      <DialogContent title="Upload contract" className="max-w-lg">
        {state === "idle" && <UploadZone onFileSelected={startUpload} />}

        {(state === "uploading" || state === "done" || state === "error") &&
          file && (
            <div className="rounded-xl border border-ink-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <FileText className="h-4 w-4 text-brand-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">
                    {file.name}
                  </p>

                  <p className="text-xs text-ink-500">
                    {state === "done"
                      ? "Upload complete"
                      : state === "error"
                        ? "Upload failed"
                        : "Uploading..."}{" "}
                    · {formatFileSize(file.size)}
                  </p>
                </div>

                {state === "uploading" && (
                  <button
                    onClick={reset}
                    className="text-ink-400 hover:text-ink-700"
                    aria-label="Cancel upload"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs text-ink-500">
                    {state === "done"
                      ? "Done"
                      : state === "error"
                        ? "Failed"
                        : "Uploading"}
                  </span>

                  <span className="text-xs font-medium text-ink-700">
                    {Math.round(progress)}%
                  </span>
                </div>

                <Progress value={progress} />
              </div>

              {state === "error" && (
                <>
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-700">
                      {errorMessage}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button variant="secondary" size="sm" onClick={reset}>
                      Close
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

        {state === "idle" && (
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" size="sm" onClick={reset}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
