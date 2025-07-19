'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Make sure the following file exists: src/components/ui/card.tsx
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
import { Input } from '@/components/ui/input';
import { SpacesProvider, useSpaces } from '@/contexts/SpacesContext';
import { UploadResult } from '@/lib/digitalocean-spaces';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
    eventName: string;
    eventDate: string;
    photos: File[];
    documents: File[];
    bucketName: string;
    folderName: string;
}

function SpacesUploadDemo() {
    const form = useForm<FormData>({
        defaultValues: {
            eventName: '',
            eventDate: '',
            photos: [],
            documents: [],
            bucketName: 'finrm-spaces',
            folderName: 'newfin/mahostav-uploads/events',
        }
    });

    const { isInitialized, error: spacesError } = useSpaces();
    const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUploadComplete = (results: UploadResult[]) => {
        setUploadResults(prev => [...prev, ...results]);
        console.log('Upload complete:', results);
    };

    const handleUploadError = (error: string) => {
        console.error('Upload error:', error);
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        console.log('Form submitted:', data);
        console.log('Upload results:', uploadResults);

        // Here you would typically send the form data and upload results to your backend
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Form submitted successfully! Check console for details.');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">DigitalOcean Spaces Upload Demo</h1>
                <p className="text-gray-600 mt-2">Upload files directly to DigitalOcean Spaces with dynamic bucket and folder configuration</p>
            </div>

            {/* Spaces Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Spaces Connection Status
                        <Badge variant={isInitialized ? "default" : "destructive"}>
                            {isInitialized ? "Connected" : "Not Connected"}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {spacesError && (
                        <Alert variant="destructive">
                            <AlertDescription>{spacesError}</AlertDescription>
                        </Alert>
                    )}
                    {isInitialized && (
                        <Alert>
                            <AlertDescription>
                                DigitalOcean Spaces is configured and ready for uploads!
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Configuration Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Upload Configuration</CardTitle>
                    <CardDescription>
                        Configure your bucket name and folder structure for organized uploads
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="eventName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter event name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="eventDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="bucketName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bucket Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., mahostav-uploads" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="folderName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Folder Name (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., events/2024" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Photo Upload */}
                            <FormField
                                control={form.control}
                                name="photos"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Photos</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                maxFiles={10}
                                                maxSize={10 * 1024 * 1024} // 10MB
                                                accept={{
                                                    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                                                }}
                                                enableSpacesUpload={isInitialized}
                                                bucketName={form.watch('bucketName')}
                                                folderName={`${form.watch('folderName')}/photos`}
                                                onUploadComplete={handleUploadComplete}
                                                onUploadError={handleUploadError}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Document Upload */}
                            <FormField
                                control={form.control}
                                name="documents"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Supporting Documents</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                maxFiles={5}
                                                maxSize={15 * 1024 * 1024} // 15MB
                                                accept={{
                                                    'application/pdf': ['.pdf'],
                                                    'application/msword': ['.doc'],
                                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                                                    'text/plain': ['.txt'],
                                                }}
                                                enableSpacesUpload={isInitialized}
                                                bucketName={form.watch('bucketName')}
                                                folderName={`${form.watch('folderName')}/documents`}
                                                onUploadComplete={handleUploadComplete}
                                                onUploadError={handleUploadError}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting || !isInitialized}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Event'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Upload Results */}
            {uploadResults.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Results</CardTitle>
                        <CardDescription>Files successfully uploaded to DigitalOcean Spaces</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {uploadResults.map((result, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {result.success ? '✅ Upload Success' : '❌ Upload Failed'}
                                            </p>
                                            {result.url && (
                                                <a
                                                    href={result.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-xs"
                                                >
                                                    {result.url}
                                                </a>
                                            )}
                                            {result.error && (
                                                <p className="text-red-600 text-xs">{result.error}</p>
                                            )}
                                        </div>
                                        <Badge variant={result.success ? "default" : "destructive"}>
                                            {result.success ? 'Success' : 'Failed'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default function SpacesUploadPage() {
    return (
        <SpacesProvider>
            <SpacesUploadDemo />
        </SpacesProvider>
    );
}
