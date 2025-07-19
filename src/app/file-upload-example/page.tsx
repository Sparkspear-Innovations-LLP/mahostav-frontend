'use client';

import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function FileUploadExample() {
    const form = useForm();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const onSubmit = (data: Record<string, unknown>) => {
        console.log('Form submitted with data:', data);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">File Upload Examples</h1>

            {/* Example 1: Single Image Upload */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Single Image Upload</h2>
                <FileUpload
                    value={uploadedFiles}
                    onChange={setUploadedFiles}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024} // 5MB
                    accept={{
                        'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                    }}
                />
            </div>

            {/* Example 2: Multiple Documents Upload */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Multiple Documents Upload</h2>
                <FileUpload
                    value={uploadedFiles}
                    onChange={setUploadedFiles}
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024} // 10MB
                    accept={{
                        'application/pdf': ['.pdf'],
                        'application/msword': ['.doc'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                        'text/plain': ['.txt'],
                    }}
                />
            </div>

            {/* Example 3: With React Hook Form */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">With React Hook Form</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="profilePicture"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Picture</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            maxFiles={1}
                                            maxSize={2 * 1024 * 1024} // 2MB
                                            accept={{
                                                'image/*': ['.jpeg', '.jpg', '.png'],
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                            maxFiles={3}
                                            maxSize={5 * 1024 * 1024} // 5MB
                                            accept={{
                                                'application/pdf': ['.pdf'],
                                                'image/*': ['.jpeg', '.jpg', '.png'],
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Submit Form
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
