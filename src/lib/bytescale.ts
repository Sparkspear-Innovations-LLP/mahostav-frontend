import { UploadManager } from "@bytescale/sdk";

export interface BytescaleUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
}

export interface BytescaleConfig {
  apiKey: string;
  folder?: string;
}

class BytescaleUploadService {
  private uploadManager: UploadManager | null = null;
  private config: BytescaleConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig() {
    const apiKey = process.env.NEXT_PUBLIC_BYTESCALE_API_KEY;

    if (apiKey) {
      this.config = {
        apiKey,
        folder: process.env.NEXT_PUBLIC_BYTESCALE_FOLDER || "",
      };

      this.uploadManager = new UploadManager({
        apiKey: this.config.apiKey,
      });
    } else {
      console.warn("Bytescale API key not found. Using demo mode.");
    }
  }

  async uploadFile(
    file: File,
    folder?: string
  ): Promise<BytescaleUploadResult> {
    try {
      if (!this.uploadManager || !this.config) {
        // Demo mode - return fake URL
        console.log("Demo mode: File would be uploaded to Bytescale");
        return {
          success: true,
          url: `https://demo-bytescale.com/${folder || "uploads"}/${file.name}`,
          fileName: file.name,
        };
      }

      const uploadPath = folder ? `${folder}/${file.name}` : file.name;

      const result = await this.uploadManager.upload({
        data: file,
        path: uploadPath,
      });

      return {
        success: true,
        url: result.fileUrl,
        fileName: file.name,
      };
    } catch (error) {
      console.error("Bytescale upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
        fileName: file.name,
      };
    }
  }

  async uploadMultipleFiles(
    files: File[],
    folder?: string
  ): Promise<BytescaleUploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  isConfigured(): boolean {
    return this.config !== null && this.uploadManager !== null;
  }

  getConfig(): BytescaleConfig | null {
    return this.config;
  }
}

// Export singleton instance
export const bytescaleService = new BytescaleUploadService();
