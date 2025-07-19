# Bytescale File Upload Integration

This project has been updated to use **Bytescale** for file uploads instead of DigitalOcean Spaces.

## 🚀 Features

- ✅ **Single and Multiple Image Uploads**
- ✅ **Drag & Drop Interface**
- ✅ **Image Previews**
- ✅ **Progress Indicators**
- ✅ **Demo Mode** (works without API key)
- ✅ **Real Uploads** (with Bytescale API key)
- ✅ **File Validation** (size, type)
- ✅ **Error Handling**

## 🛠️ Setup Instructions

### 1. Get Bytescale API Key

1. Go to [Bytescale Dashboard](https://www.bytescale.com/dashboard)
2. Create an account or log in
3. Get your API key from the dashboard

### 2. Configure Environment Variables

Update your `.env.local` file:

```bash
# Bytescale Configuration
NEXT_PUBLIC_BYTESCALE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_BYTESCALE_FOLDER=mahostav-uploads

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### 3. Restart Development Server

```bash
npm run dev
```

## 📁 File Structure

```
src/
├── lib/
│   └── bytescale.ts           # Bytescale upload service
├── hooks/
│   └── useBytescaleUpload.ts  # React hook for uploads
├── contexts/
│   └── BytescaleContext.tsx   # Context provider
└── components/ui/
    └── file-upload.tsx        # Updated FileUpload component
```

## 💻 Usage

### Basic File Upload

```tsx
<FileUpload
  value={files}
  onChange={setFiles}
  maxFiles={1}
  enableBytescaleUpload={true}
  folderName="uploads/images"
  onUploadComplete={(results) => console.log("Uploaded:", results)}
  onUploadError={(error) => console.error("Error:", error)}
/>
```

### Multiple File Upload

```tsx
<FileUpload
  value={files}
  onChange={setFiles}
  maxFiles={10}
  enableBytescaleUpload={true}
  folderName="uploads/gallery"
  onUploadComplete={(results) => {
    const urls = results
      .filter((result) => result.success)
      .map((result) => result.url);
    console.log("Upload URLs:", urls);
  }}
/>
```

## 🔧 API Reference

### BytescaleUploadResult

```typescript
interface BytescaleUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
}
```

### FileUpload Props

```typescript
interface FileUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  enableBytescaleUpload?: boolean;
  folderName?: string;
  onUploadComplete?: (results: BytescaleUploadResult[]) => void;
  onUploadError?: (error: string) => void;
}
```

## 🎯 Form Integration

The main form now submits uploaded file URLs to the backend:

```typescript
const formData = {
  mandalOfficialName: "...",
  mandalLogo: uploadedLogoUrl, // Single image URL
  highQualityPhotos: uploadedPhotoUrls, // Array of image URLs
  // ... other fields
};
```

## 🚨 Demo Mode

If no API key is provided, the system runs in **demo mode**:

- Files appear to upload successfully
- Returns demo URLs like `https://demo-bytescale.com/uploads/filename.jpg`
- Perfect for testing and development

## 🔄 Migration from DigitalOcean Spaces

### What Changed:

- ✅ **DigitalOcean Spaces** → **Bytescale**
- ✅ **S3-compatible API** → **Simple REST API**
- ✅ **Complex configuration** → **Single API key**
- ✅ **AWS SDK dependency** → **Lightweight Bytescale SDK**

### Benefits:

- 🚀 **Simpler setup** (just one API key)
- 💰 **Better pricing** for file uploads
- 🔧 **Easier integration**
- 📊 **Better dashboard and analytics**
- 🌍 **Global CDN** included

## 🐛 Troubleshooting

### Files not uploading?

1. Check API key in `.env.local`
2. Verify folder permissions in Bytescale dashboard
3. Check browser console for errors

### Getting 403 errors?

- Verify your API key is correct
- Check Bytescale account limits

### Demo URLs showing instead of real URLs?

- Make sure `NEXT_PUBLIC_BYTESCALE_API_KEY` is set
- Restart the development server after updating `.env.local`

## 📚 Documentation

- [Bytescale Documentation](https://www.bytescale.com/docs)
- [API Reference](https://www.bytescale.com/docs/api)
- [SDK Documentation](https://www.bytescale.com/docs/sdks/javascript)
