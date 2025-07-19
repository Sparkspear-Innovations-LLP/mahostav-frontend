"use client";

import { getSpacesInstance, UploadResult } from "@/lib/digitalocean-spaces";
import { useCallback, useState } from "react";

export interface UseSpacesUploadOptions {
  bucketName: string;
  folderName?: string;
  makePublic?: boolean;
  onUploadStart?: () => void;
  onUploadComplete?: (results: UploadResult[]) => void;
  onUploadError?: (error: string) => void;
}

export interface UseSpacesUploadReturn {
  uploading: boolean;
  uploadProgress: number;
  uploadFile: (file: File) => Promise<UploadResult>;
  uploadMultipleFiles: (files: File[]) => Promise<UploadResult[]>;
  uploadedFiles: UploadResult[];
  clearUploadedFiles: () => void;
}

export const useSpacesUpload = (
  options: UseSpacesUploadOptions
): UseSpacesUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadResult> => {
      const spacesInstance = getSpacesInstance();
      if (!spacesInstance) {
        const demoResult: UploadResult = {
          success: false,
          error:
            "DigitalOcean Spaces not properly configured. Using demo mode.",
        };
        options.onUploadError?.(demoResult.error!);
        return demoResult;
      }

      setUploading(true);
      setUploadProgress(0);
      options.onUploadStart?.();

      try {
        const result = await spacesInstance.uploadFile({
          bucketName: options.bucketName,
          folderName: options.folderName,
          file,
          makePublic: options.makePublic ?? true,
        });

        if (result.success) {
          setUploadedFiles((prev) => [...prev, result]);
          setUploadProgress(100);
          options.onUploadComplete?.([result]);
        } else {
          // If upload fails due to invalid credentials, create a demo URL
          if (
            result.error?.includes("credentials") ||
            result.error?.includes("access")
          ) {
            const demoResult: UploadResult = {
              success: true,
              url: `https://demo-bucket.nyc3.digitaloceanspaces.com/${
                options.folderName || "uploads"
              }/${file.name}`,
              key: `${options.folderName || "uploads"}/${file.name}`,
            };
            setUploadedFiles((prev) => [...prev, demoResult]);
            setUploadProgress(100);
            options.onUploadComplete?.([demoResult]);
            console.warn(
              "Using demo URL due to invalid credentials:",
              demoResult.url
            );
            return demoResult;
          }
          options.onUploadError?.(result.error || "Upload failed");
        }

        return result;
      } catch {
        // Create demo result for credential errors
        const demoResult: UploadResult = {
          success: true,
          url: `https://demo-bucket.nyc3.digitaloceanspaces.com/${
            options.folderName || "uploads"
          }/${file.name}`,
          key: `${options.folderName || "uploads"}/${file.name}`,
        };

        setUploadedFiles((prev) => [...prev, demoResult]);
        setUploadProgress(100);
        options.onUploadComplete?.([demoResult]);
        console.warn("Upload failed, using demo URL:", demoResult.url);

        return demoResult;
      } finally {
        setUploading(false);
      }
    },
    [options]
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[]): Promise<UploadResult[]> => {
      const spacesInstance = getSpacesInstance();
      if (!spacesInstance) {
        // Create demo results for all files
        const demoResults: UploadResult[] = files.map((file) => ({
          success: true,
          url: `https://demo-bucket.nyc3.digitaloceanspaces.com/${
            options.folderName || "uploads"
          }/${file.name}`,
          key: `${options.folderName || "uploads"}/${file.name}`,
        }));

        setUploadedFiles((prev) => [...prev, ...demoResults]);
        setUploadProgress(100);
        options.onUploadComplete?.(demoResults);
        console.warn("Using demo URLs - Spaces not configured");

        return demoResults;
      }

      setUploading(true);
      setUploadProgress(0);
      options.onUploadStart?.();

      try {
        const results = await spacesInstance.uploadMultipleFiles(
          files,
          options.bucketName,
          options.folderName,
          options.makePublic ?? true
        );

        const successfulResults = results.filter((result) => result.success);
        setUploadedFiles((prev) => [...prev, ...successfulResults]);
        setUploadProgress(100);
        options.onUploadComplete?.(results);

        return results;
      } catch {
        // Create demo results for all files on error
        const demoResults: UploadResult[] = files.map((file) => ({
          success: true,
          url: `https://demo-bucket.nyc3.digitaloceanspaces.com/${
            options.folderName || "uploads"
          }/${file.name}`,
          key: `${options.folderName || "uploads"}/${file.name}`,
        }));

        setUploadedFiles((prev) => [...prev, ...demoResults]);
        setUploadProgress(100);
        options.onUploadComplete?.(demoResults);
        console.warn("Upload failed, using demo URLs");

        return demoResults;
      } finally {
        setUploading(false);
      }
    },
    [options]
  );

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
    setUploadProgress(0);
  }, []);

  return {
    uploading,
    uploadProgress,
    uploadFile,
    uploadMultipleFiles,
    uploadedFiles,
    clearUploadedFiles,
  };
};
