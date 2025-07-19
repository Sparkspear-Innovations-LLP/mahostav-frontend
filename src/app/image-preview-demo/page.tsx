'use client';

import { FileUpload } from '@/components/ui/file-upload';
import { useState } from 'react';

export default function ImagePreviewDemo() {
    const [profileImage, setProfileImage] = useState<File[]>([]);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-center">Image Preview Demo</h1>

            {/* Single Image Upload with Preview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Profile Picture (Single Image)</h2>
                <FileUpload
                    value={profileImage}
                    onChange={setProfileImage}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024} // 5MB
                    accept={{
                        'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                    }}
                />
            </div>

            {/* Multiple Images Upload with Preview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Photo Gallery (Multiple Images)</h2>
                <FileUpload
                    value={galleryImages}
                    onChange={setGalleryImages}
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024} // 10MB
                    accept={{
                        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                    }}
                />
            </div>

            {/* Mixed Files Upload */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Mixed Documents (Images + PDFs)</h2>
                <FileUpload
                    value={documents}
                    onChange={setDocuments}
                    maxFiles={10}
                    maxSize={15 * 1024 * 1024} // 15MB
                    accept={{
                        'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                        'application/pdf': ['.pdf'],
                        'application/msword': ['.doc'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                    }}
                />
            </div>

            {/* Current Files Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Current Files Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h3 className="font-medium text-gray-700">Profile Images</h3>
                        <p className="text-sm text-gray-500">{profileImage.length} file(s)</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-700">Gallery Images</h3>
                        <p className="text-sm text-gray-500">{galleryImages.length} file(s)</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-700">Documents</h3>
                        <p className="text-sm text-gray-500">{documents.length} file(s)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
