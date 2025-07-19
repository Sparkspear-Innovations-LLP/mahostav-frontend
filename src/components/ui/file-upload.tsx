'use client';

import { useSpacesUpload } from '@/hooks/useSpacesUpload';
import { UploadResult } from '@/lib/digitalocean-spaces';
import { cn } from '@/lib/utils';
import { CheckCircle, Cloud, File, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';

interface FileUploadProps {
    value?: File[];
    onChange: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number;
    accept?: Record<string, string[]>;
    disabled?: boolean;
    className?: string;
    // DigitalOcean Spaces configuration
    enableSpacesUpload?: boolean;
    bucketName?: string;
    folderName?: string;
    makePublic?: boolean;
    onUploadComplete?: (results: UploadResult[]) => void;
    onUploadError?: (error: string) => void;
}

export function FileUpload({
    value = [],
    onChange,
    maxFiles = 1,
    maxSize = 5 * 1024 * 1024, // 5MB default
    accept = {
        'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        'application/pdf': ['.pdf'],
    },
    disabled = false,
    className,
    enableSpacesUpload = false,
    bucketName = '',
    folderName = '',
    makePublic = true,
    onUploadComplete,
    onUploadError,
}: FileUploadProps) {
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // DigitalOcean Spaces upload hook
    const {
        uploading,
        uploadProgress,
        uploadMultipleFiles,
        uploadedFiles,
    } = useSpacesUpload({
        bucketName: bucketName || 'default-bucket',
        folderName,
        makePublic,
        onUploadComplete: (results) => {
            onUploadComplete?.(results);
        },
        onUploadError: (error) => {
            console.error('Upload error:', error);
            onUploadError?.(error);
        },
    });

    // Create preview URLs for images
    useEffect(() => {
        const urls = value.map(file => {
            if (file.type.startsWith('image/')) {
                return URL.createObjectURL(file);
            }
            return '';
        });

        setPreviewUrls(urls);

        // Cleanup function to revoke object URLs
        return () => {
            urls.forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [value]);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            let filesToAdd = acceptedFiles;

            if (maxFiles === 1) {
                filesToAdd = acceptedFiles.slice(0, 1);
            } else {
                filesToAdd = [...value, ...acceptedFiles].slice(0, maxFiles);
            }

            // Update local files first
            onChange(filesToAdd);

            // Upload to DigitalOcean Spaces if enabled
            if (enableSpacesUpload && bucketName) {
                try {
                    await uploadMultipleFiles(acceptedFiles);
                } catch (error) {
                    console.error('Failed to upload files to Spaces:', error);
                    onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
                }
            }
        },
        [onChange, value, maxFiles, enableSpacesUpload, bucketName, uploadMultipleFiles, onUploadError]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
            onDrop,
            maxFiles,
            maxSize,
            accept,
            disabled,
        });

    const removeFile = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isImage = (file: File) => {
        return file.type.startsWith('image/');
    };

    const getImagePreview = (file: File, index: number) => {
        if (isImage(file) && previewUrls[index]) {
            return previewUrls[index];
        }
        return null;
    };

    return (
        <div className={cn('w-auto', className)}>
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors',
                    'hover:border-gray-400 focus:outline-none focus:ring-2 bg-white focus:ring-offset-2 focus:ring-blue-500',
                    isDragActive && 'border-blue-400 bg-blue-50',
                    disabled && 'opacity-50 cursor-not-allowed',
                    value.length > 0 && 'border-green-300 bg-green-50'
                )}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    {isDragActive ? (
                        'Drop the files here...'
                    ) : (
                        <>
                            {maxFiles === 1 ? (
                                <>
                                    Drag & drop a single image here, or{' '}
                                    <span className="text-blue-600 font-medium">browse</span>
                                </>
                            ) : (
                                <>
                                    Drag & drop multiple images here, or{' '}
                                    <span className="text-blue-600 font-medium">browse</span>
                                </>
                            )}
                        </>
                    )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {maxFiles === 1 ? (
                        <>Single image only • Max size {formatFileSize(maxSize)}</>
                    ) : (
                        <>Max {maxFiles} images • Max size {formatFileSize(maxSize)} each</>
                    )}
                </p>
            </div>

            {/* File Rejections */}
            {fileRejections.length > 0 && (
                <div className="mt-2">
                    {fileRejections.map(({ file, errors }) => (
                        <div key={file.name} className="text-sm text-red-600">
                            {file.name} - {errors.map((e) => e.message).join(', ')}
                        </div>
                    ))}
                </div>
            )}

            {/* Demo Mode Indicator */}
            {/* {enableSpacesUpload && bucketName && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs text-blue-700">
                        📁 Uploading to: <span className="font-mono">{bucketName}</span>
                        {folderName && <span>/{folderName}</span>}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        {maxFiles === 1 ? '📷 Single image upload' : `🖼️ Multiple images (max ${maxFiles})`} •
                        💡 Configure DigitalOcean Spaces credentials in .env.local for real uploads
                    </p>
                </div>
            )} */}

            {/* Selected Files */}
            {value.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected files:</p>
                    <div className="space-y-2">
                        {value.map((file, index) => {
                            const imagePreview = getImagePreview(file, index);
                            const isUploaded = uploadedFiles.some(result =>
                                result.success && result.url
                            );

                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center space-x-3">
                                        {imagePreview ? (
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                                <Image
                                                    src={imagePreview}
                                                    alt={file.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                                                <File className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                            {imagePreview && (
                                                <p className="text-xs text-green-600 font-medium">Image Preview</p>
                                            )}
                                            {enableSpacesUpload && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    {uploading ? (
                                                        <>
                                                            <Cloud className="h-3 w-3 text-blue-500 animate-pulse" />
                                                            <span className="text-xs text-blue-600">Uploading... {uploadProgress}%</span>
                                                        </>
                                                    ) : isUploaded ? (
                                                        <>
                                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                                            <span className="text-xs text-green-600">Uploaded to Spaces</span>
                                                        </>
                                                    ) : bucketName ? (
                                                        <>
                                                            <Cloud className="h-3 w-3 text-gray-400" />
                                                            <span className="text-xs text-gray-500">Ready to upload</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-orange-500">Bucket name required</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        disabled={disabled || uploading}
                                        className="flex-shrink-0 text-gray-400 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
