import AWS from "aws-sdk";

export interface SpacesConfig {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
}

export interface UploadOptions {
  bucketName: string;
  folderName?: string;
  file: File;
  fileName?: string;
  makePublic?: boolean;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

class DigitalOceanSpaces {
  private s3: AWS.S3;
  private defaultBucket: string;

  constructor(config: SpacesConfig) {
    this.s3 = new AWS.S3({
      endpoint: config.endpoint,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region || "nyc3",
      s3ForcePathStyle: false,
      signatureVersion: "v4",
    });
    this.defaultBucket = config.bucketName;
  }

  /**
   * Upload a file to DigitalOcean Spaces
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    try {
      const {
        bucketName,
        folderName,
        file,
        fileName,
        makePublic = true,
      } = options;

      // Generate unique filename if not provided
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split(".").pop();
      const finalFileName =
        fileName || `${timestamp}_${randomString}.${fileExtension}`;

      // Create the key (path) for the file
      const key = folderName ? `${folderName}/${finalFileName}` : finalFileName;

      // Convert File to Buffer
      const fileBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(fileBuffer);

      // Upload parameters
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ...(makePublic && { ACL: "public-read" }),
      };

      // Upload the file
      const result = await this.s3.upload(uploadParams).promise();

      return {
        success: true,
        url: result.Location,
        key: result.Key,
      };
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown upload error",
      };
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    bucketName: string,
    folderName?: string,
    makePublic: boolean = true
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile({
        bucketName,
        folderName,
        file,
        makePublic,
      })
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from Spaces
   */
  async deleteFile(bucketName: string, key: string): Promise<boolean> {
    try {
      await this.s3
        .deleteObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();

      return true;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    }
  }

  /**
   * Get a signed URL for private files
   */
  getSignedUrl(
    bucketName: string,
    key: string,
    expires: number = 3600
  ): string {
    return this.s3.getSignedUrl("getObject", {
      Bucket: bucketName,
      Key: key,
      Expires: expires,
    });
  }

  /**
   * List files in a bucket/folder
   */
  async listFiles(
    bucketName: string,
    folderName?: string,
    maxKeys: number = 1000
  ) {
    try {
      const params: AWS.S3.ListObjectsV2Request = {
        Bucket: bucketName,
        MaxKeys: maxKeys,
        ...(folderName && { Prefix: folderName }),
      };

      const result = await this.s3.listObjectsV2(params).promise();
      return result.Contents || [];
    } catch (error) {
      console.error("List files error:", error);
      return [];
    }
  }
}

// Create and export a singleton instance
let spacesInstance: DigitalOceanSpaces | null = null;

export const initializeSpaces = (config: SpacesConfig): DigitalOceanSpaces => {
  spacesInstance = new DigitalOceanSpaces(config);
  return spacesInstance;
};

export const getSpacesInstance = (): DigitalOceanSpaces | null => {
  return spacesInstance;
};

export default DigitalOceanSpaces;
