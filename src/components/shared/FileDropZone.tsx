"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, X, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
  onFileSelect?: (file: File) => void;
  onSubmit?: (file: File) => void;
  isSubmitting?: boolean;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
}

interface FileState {
  file: File | null;
  error: string | null;
  isValid: boolean;
}

const REQUIRED_HEADERS = ["account_number", "amount", "reference", "description"];

export function FileDropZone({
  onFileSelect,
  onSubmit,
  isSubmitting = false,
  acceptedTypes = ["text/csv", "application/csv", "text/plain"],
  maxSizeMB = 5,
  className,
}: FileDropZoneProps) {
  const [fileState, setFileState] = useState<FileState>({
    file: null,
    error: null,
    isValid: false,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    async (file: File): Promise<{ isValid: boolean; error: string | null }> => {
      // Check extension
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension !== "csv") {
        return { isValid: false, error: "Invalid file type. Please upload a CSV file." };
      }

      // Check MIME type
      if (!acceptedTypes.includes(file.type) && !file.name.endsWith(".csv")) {
        return { isValid: false, error: "Invalid file type. Please upload a CSV file." };
      }

      // Check file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return { isValid: false, error: `File too large. Maximum size is ${maxSizeMB}MB.` };
      }

      // Validate CSV headers
      try {
        const text = await file.text();
        const firstLine = text.split("\n")[0];
        const headers = firstLine.split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
        
        const missingHeaders = REQUIRED_HEADERS.filter(
          (required) => !headers.includes(required)
        );
        
        if (missingHeaders.length > 0) {
          return {
            isValid: false,
            error: `Invalid CSV format. Missing required headers: ${missingHeaders.join(", ")}`,
          };
        }
      } catch {
        return { isValid: false, error: "Unable to read file. Please try again." };
      }

      return { isValid: true, error: null };
    },
    [acceptedTypes, maxSizeMB]
  );

  const handleFile = useCallback(
    async (file: File) => {
      const validation = await validateFile(file);
      setFileState({
        file,
        error: validation.error,
        isValid: validation.isValid,
      });
      if (validation.isValid) {
        onFileSelect?.(file);
      }
    },
    [validateFile, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleChooseFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFileState({ file: null, error: null, isValid: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelect?.(null as any);
  }, [onFileSelect]);

  const handleSubmit = useCallback(() => {
    if (fileState.file && fileState.isValid) {
      onSubmit?.(fileState.file);
    }
  }, [fileState.file, fileState.isValid, onSubmit]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownloadTemplate = useCallback(() => {
    const templateContent = "account_number,amount,reference,description\n1234567890,100.00,REF001,Payment for invoice 001\n1234567891,250.00,REF002,Payment for invoice 002";
    const blob = new Blob([templateContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence>
        {fileState.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{fileState.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragOver
            ? "hsl(var(--primary))"
            : "hsl(var(--border))",
          backgroundColor: isDragOver
            ? "hsl(var(--primary) / 0.05)"
            : "transparent",
        }}
        className={cn(
          "relative border-2 border-dashed rounded-xl h-[300px] flex flex-col items-center justify-center transition-colors",
          fileState.error
            ? "border-destructive/50 bg-destructive/5"
            : "cursor-pointer"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv,application/csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {!fileState.file ? (
          <div className="text-center space-y-4">
            <motion.div
              animate={{ scale: isDragOver ? 1.1 : 1 }}
              className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center"
            >
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Drag & drop your CSV file here
              </p>
              <p className="text-sm text-muted-foreground">
                or{" "}
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="text-primary hover:underline font-medium"
                >
                  choose a file to upload
                </button>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {maxSizeMB}MB • CSV format only
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4 w-full px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <FileText className="h-8 w-8 text-primary" />
            </motion.div>
            <div className="space-y-2">
              <p className="font-medium text-foreground truncate max-w-[280px] mx-auto">
                {fileState.file.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(fileState.file.size)}
              </p>
              {fileState.error ? (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove file
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4 inline mr-1" />
                  Remove file
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download className="h-4 w-4" />
          Download CSV template
        </button>
      </div>

      {fileState.file && fileState.isValid && (
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !fileState.isValid}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                />
                Submitting...
              </>
            ) : (
              "Submit Batch"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default FileDropZone;
