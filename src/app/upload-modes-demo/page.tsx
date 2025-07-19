'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { SpacesProvider } from '@/contexts/SpacesContext';
import { UploadResult } from '@/lib/digitalocean-spaces';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
    profilePhoto: File[];
    galleryPhotos: File[];
    documents: File[];
    heroImage: File[];
}

function UploadModesDemo() {
    const form = useForm<FormData>({
        defaultValues: {
            profilePhoto: [],
            galleryPhotos: [],
            documents: [],
            heroImage: [],
        }
    });

    const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);

    const handleUploadComplete = (results: UploadResult[]) => {
        setUploadResults(prev => [...prev, ...results]);
        console.log('Upload complete:', results);
    };

    const handleUploadError = (error: string) => {
        console.error('Upload error:', error);
    };

    const onSubmit = (data: FormData) => {
        console.log('Form submitted:', data);
        console.log('Upload results:', uploadResults);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Single vs Multiple Upload Demo</h1>
                <p className="text-gray-600 mt-2">Compare different upload modes and configurations</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Single Image Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    📷 Single Image Upload
                                </CardTitle>
                                <CardDescription>
                                    Perfect for profile photos, hero images, or any single image requirement
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="profilePhoto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Photo</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    value={field.value || []}
                                                    onChange={field.onChange}
                                                    maxFiles={1}
                                                    maxSize={5 * 1024 * 1024} // 5MB
                                                    accept={{
                                                        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                                                    }}
                                                    enableSpacesUpload={true}
                                                    bucketName="finrm-spaces"
                                                    folderName="newfin/mahostav-uploads/profiles"
                                                    onUploadComplete={handleUploadComplete}
                                                    onUploadError={handleUploadError}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Multiple Images Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    🖼️ Multiple Images Upload
                                </CardTitle>
                                <CardDescription>
                                    Great for galleries, portfolios, or collections of images
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="galleryPhotos"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gallery Photos (Max 10)</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    value={field.value || []}
                                                    onChange={field.onChange}
                                                    maxFiles={10}
                                                    maxSize={10 * 1024 * 1024} // 10MB
                                                    accept={{
                                                        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                                                    }}
                                                    enableSpacesUpload={true}
                                                    bucketName="finrm-spaces"
                                                    folderName="newfin/mahostav-uploads/gallery"
                                                    onUploadComplete={handleUploadComplete}
                                                    onUploadError={handleUploadError}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* High-Quality Single Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    🎨 High-Quality Single Image
                                </CardTitle>
                                <CardDescription>
                                    Large file size limit for high-resolution images
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="heroImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hero Image (Max 25MB)</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    value={field.value || []}
                                                    onChange={field.onChange}
                                                    maxFiles={1}
                                                    maxSize={25 * 1024 * 1024} // 25MB
                                                    accept={{
                                                        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.tiff'],
                                                    }}
                                                    enableSpacesUpload={true}
                                                    bucketName="finrm-spaces"
                                                    folderName="newfin/mahostav-uploads/hero-images"
                                                    onUploadComplete={handleUploadComplete}
                                                    onUploadError={handleUploadError}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Mixed File Types */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    📄 Mixed File Types
                                </CardTitle>
                                <CardDescription>
                                    Multiple files including images, PDFs, and documents
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="documents"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Documents (Max 5)</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    value={field.value || []}
                                                    onChange={field.onChange}
                                                    maxFiles={5}
                                                    maxSize={15 * 1024 * 1024} // 15MB
                                                    accept={{
                                                        'image/*': ['.jpeg', '.jpg', '.png'],
                                                        'application/pdf': ['.pdf'],
                                                        'application/msword': ['.doc'],
                                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                                                    }}
                                                    enableSpacesUpload={true}
                                                    bucketName="finrm-spaces"
                                                    folderName="newfin/mahostav-uploads/documents"
                                                    onUploadComplete={handleUploadComplete}
                                                    onUploadError={handleUploadError}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                    </div>

                    {/* Comparison Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Mode Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Upload Type</th>
                                            <th className="text-left p-2">Max Files</th>
                                            <th className="text-left p-2">Max Size</th>
                                            <th className="text-left p-2">File Types</th>
                                            <th className="text-left p-2">Use Case</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">📷 Single Image</td>
                                            <td className="p-2">1</td>
                                            <td className="p-2">5MB</td>
                                            <td className="p-2">Images only</td>
                                            <td className="p-2">Profile photos, logos</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">🖼️ Multiple Images</td>
                                            <td className="p-2">10</td>
                                            <td className="p-2">10MB each</td>
                                            <td className="p-2">Images only</td>
                                            <td className="p-2">Photo galleries, portfolios</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">🎨 High-Quality Single</td>
                                            <td className="p-2">1</td>
                                            <td className="p-2">25MB</td>
                                            <td className="p-2">High-res images</td>
                                            <td className="p-2">Hero images, banners</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">📄 Mixed Files</td>
                                            <td className="p-2">5</td>
                                            <td className="p-2">15MB each</td>
                                            <td className="p-2">Images, PDFs, Docs</td>
                                            <td className="p-2">Documents, attachments</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center">
                        <Button type="submit" size="lg" className="px-8">
                            Submit All Uploads
                        </Button>
                    </div>

                </form>
            </Form>

            {/* Upload Results */}
            {uploadResults.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Results ({uploadResults.length} files)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {uploadResults.map((result, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                                            {result.success ? '✅' : '❌'} {result.success ? 'Success' : 'Failed'}
                                        </span>
                                    </div>
                                    {result.url && (
                                        <a
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline block truncate"
                                        >
                                            {result.url}
                                        </a>
                                    )}
                                    {result.error && (
                                        <p className="text-red-600">{result.error}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}

export default function UploadModesPage() {
    return (
        <SpacesProvider>
            <UploadModesDemo />
        </SpacesProvider>
    );
}
