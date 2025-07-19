"use client";

import { bytescaleService, BytescaleUploadResult } from "@/lib/bytescale";
import { useCallback, useState } from "react";

interface UseBytescaleUploadProps {
  folder?: string;
  onUploadComplete?: (results: BytescaleUploadResult[]) => void;
  onUploadError?: (error: string) => void;
}

export function useBytescaleUpload({
  folder,
  onUploadComplete,
  onUploadError,
}: UseBytescaleUploadProps = {}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<BytescaleUploadResult[]>(
    []
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return [];

      setUploading(true);
      setUploadProgress(0);

      try {
        console.log(`Uploading ${files.length} files to Bytescale...`);

        const results = await bytescaleService.uploadMultipleFiles(
          files,
          folder
        );

        setUploadedFiles((prev) => [...prev, ...results]);
        setUploadProgress(100);

        // Check for any failures
        const failures = results.filter((result) => !result.success);
        if (failures.length > 0) {
          const errorMessage = `Failed to upload ${
            failures.length
          } files: ${failures.map((f) => f.error).join(", ")}`;
          console.error(errorMessage);
          onUploadError?.(errorMessage);
        }

        // Call success callback with all results
        onUploadComplete?.(results);

        return results;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        console.error("Upload error:", errorMessage);
        onUploadError?.(errorMessage);
        return [];
      } finally {
        setUploading(false);
      }
    },
    [folder, onUploadComplete, onUploadError]
  );

  const uploadSingleFile = useCallback(
    async (file: File) => {
      const results = await uploadMultipleFiles([file]);
      return results[0] || null;
    },
    [uploadMultipleFiles]
  );

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    uploading,
    uploadProgress,
    uploadedFiles,
    uploadMultipleFiles,
    uploadSingleFile,
    clearUploadedFiles,
    isConfigured: bytescaleService.isConfigured(),
  };
}
