# DigitalOcean Spaces File Upload Integration

This project includes a complete file upload solution that integrates with DigitalOcean Spaces for cloud storage with dynamic bucket and folder configuration.

## 🚀 Features

- **Image Preview**: Shows actual thumbnails for uploaded images
- **Drag & Drop**: Full drag and drop support with visual feedback
- **DigitalOcean Spaces Integration**: Direct upload to cloud storage
- **Dynamic Configuration**: Configurable bucket names and folder structures
- **Progress Tracking**: Real-time upload progress and status
- **Error Handling**: Comprehensive error handling and user feedback
- **React Hook Form Integration**: Seamless form validation
- **TypeScript**: Full type safety

## 📋 Prerequisites

1. **DigitalOcean Spaces Account**: You need a DigitalOcean account with Spaces enabled
2. **API Keys**: Access Key ID and Secret Access Key for your Spaces
3. **Bucket**: Create a bucket in your DigitalOcean Spaces

## ⚙️ Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in your project root:

```bash
# DigitalOcean Spaces Configuration
NEXT_PUBLIC_DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
NEXT_PUBLIC_DO_SPACES_ACCESS_KEY_ID=your_access_key_here
NEXT_PUBLIC_DO_SPACES_SECRET_ACCESS_KEY=your_secret_key_here
NEXT_PUBLIC_DO_SPACES_REGION=nyc3
NEXT_PUBLIC_DO_SPACES_DEFAULT_BUCKET=your_bucket_name_here
```

### 2. DigitalOcean Spaces Setup

1. **Create a Space**: Go to DigitalOcean → Spaces → Create Space
2. **Generate API Keys**: Go to API → Spaces Keys → Generate New Key
3. **Configure CORS** (if needed):
   ```json
   {
     "origins": ["https://yourdomain.com", "http://localhost:3000"],
     "methods": ["GET", "PUT", "POST", "DELETE"],
     "headers": ["*"]
   }
   ```

### 3. Install Dependencies

```bash
npm install aws-sdk react-dropzone
```

## 🎯 Usage Examples

### Basic File Upload

```tsx
import { FileUpload } from "@/components/ui/file-upload";

function MyComponent() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      maxFiles={5}
      maxSize={10 * 1024 * 1024} // 10MB
      accept={{
        "image/*": [".jpeg", ".jpg", ".png"],
      }}
    />
  );
}
```

### With DigitalOcean Spaces Upload

```tsx
import { FileUpload } from "@/components/ui/file-upload";
import { SpacesProvider } from "@/contexts/SpacesContext";

function MyComponent() {
  const [files, setFiles] = useState<File[]>([]);

  const handleUploadComplete = (results) => {
    console.log("Upload results:", results);
  };

  return (
    <SpacesProvider>
      <FileUpload
        value={files}
        onChange={setFiles}
        maxFiles={5}
        maxSize={10 * 1024 * 1024}
        accept={{ "image/*": [".jpeg", ".jpg", ".png"] }}
        enableSpacesUpload={true}
        bucketName="my-bucket"
        folderName="uploads/photos"
        onUploadComplete={handleUploadComplete}
        onUploadError={(error) => console.error(error)}
      />
    </SpacesProvider>
  );
}
```

### With React Hook Form

```tsx
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

function FormExample() {
  const form = useForm();

  return (
    <FormField
      control={form.control}
      name="photos"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Photos</FormLabel>
          <FormControl>
            <FileUpload
              value={field.value || []}
              onChange={field.onChange}
              enableSpacesUpload={true}
              bucketName="event-photos"
              folderName="2024/events"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
```

## 🎨 Demo Pages

Visit these pages to see the file upload in action:

1. **Main Form**: `http://localhost:3000` - Your Mohotsav form with Spaces upload
2. **Spaces Demo**: `http://localhost:3000/spaces-upload-demo` - Comprehensive Spaces demo
3. **Basic Examples**: `http://localhost:3000/file-upload-example` - Various file upload examples
4. **Image Preview Demo**: `http://localhost:3000/image-preview-demo` - Image preview features

## 📁 File Structure

```
src/
├── components/ui/
│   ├── file-upload.tsx        # Main file upload component
│   ├── card.tsx              # UI card component
│   ├── alert.tsx             # UI alert component
│   └── badge.tsx             # UI badge component
├── contexts/
│   └── SpacesContext.tsx     # DigitalOcean Spaces context
├── hooks/
│   └── useSpacesUpload.ts    # Custom hook for Spaces upload
├── lib/
│   └── digitalocean-spaces.ts # DigitalOcean Spaces utility
└── app/
    ├── page.tsx              # Main form with Spaces upload
    └── spaces-upload-demo/   # Demo page
```

## 🔧 Configuration Options

### FileUpload Component Props

| Prop                 | Type                       | Default    | Description                |
| -------------------- | -------------------------- | ---------- | -------------------------- |
| `value`              | `File[]`                   | `[]`       | Current files              |
| `onChange`           | `(files: File[]) => void`  | -          | File change handler        |
| `maxFiles`           | `number`                   | `1`        | Maximum number of files    |
| `maxSize`            | `number`                   | `5MB`      | Maximum file size in bytes |
| `accept`             | `Record<string, string[]>` | images/pdf | Accepted file types        |
| `enableSpacesUpload` | `boolean`                  | `false`    | Enable Spaces upload       |
| `bucketName`         | `string`                   | -          | DigitalOcean bucket name   |
| `folderName`         | `string`                   | -          | Folder path in bucket      |
| `makePublic`         | `boolean`                  | `true`     | Make uploaded files public |

### Spaces Configuration

| Option            | Description                                   |
| ----------------- | --------------------------------------------- |
| `bucketName`      | Name of your DigitalOcean Space               |
| `folderName`      | Folder structure (e.g., "events/2024/photos") |
| `endpoint`        | Spaces endpoint URL                           |
| `accessKeyId`     | Your Spaces access key                        |
| `secretAccessKey` | Your Spaces secret key                        |
| `region`          | Spaces region (e.g., "nyc3")                  |

## 🔒 Security Notes

1. **Environment Variables**: Never commit real API keys to version control
2. **Public vs Private**: Consider whether files should be public or private
3. **CORS Configuration**: Set up proper CORS rules for production
4. **File Validation**: Always validate file types and sizes on both client and server

## 🚀 Deployment

1. **Environment Variables**: Set up environment variables in your deployment platform
2. **CORS Settings**: Update CORS settings in DigitalOcean Spaces console
3. **Domain Whitelist**: Add your production domain to allowed origins

## 📚 API Reference

### DigitalOcean Spaces Class

```typescript
const spaces = new DigitalOceanSpaces(config);

// Upload single file
const result = await spaces.uploadFile({
  bucketName: "my-bucket",
  folderName: "photos",
  file: file,
  makePublic: true,
});

// Upload multiple files
const results = await spaces.uploadMultipleFiles(
  files,
  "my-bucket",
  "documents"
);

// Delete file
await spaces.deleteFile("my-bucket", "path/to/file.jpg");

// Get signed URL
const url = spaces.getSignedUrl("my-bucket", "private/file.pdf");
```

## 🎯 Next Steps

1. Set up your DigitalOcean Spaces credentials
2. Test the upload functionality
3. Customize bucket names and folder structures
4. Integrate with your backend API
5. Add additional file validation as needed

## 📞 Support

For issues or questions:

1. Check the browser console for error messages
2. Verify your environment variables
3. Test your DigitalOcean Spaces credentials
4. Check CORS configuration
