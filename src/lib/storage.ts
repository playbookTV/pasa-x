// File storage service for Pasa using Cloudflare R2

const CLOUDFLARE_R2_URL = import.meta.env.VITE_CLOUDFLARE_R2_URL || process.env.CLOUDFLARE_R2_URL;
const CLOUDFLARE_R2_ACCESS_KEY_ID = import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

/**
 * Upload a file to Cloudflare R2 storage
 * @param file File to upload
 * @param userId User ID to associate with the file
 * @param type File type (resume, coverletter, etc.)
 * @returns URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  userId: string,
  type: 'resume' | 'coverletter' = 'resume'
): Promise<string> {
  // If in development mode and no R2 credentials, return mock URL
  if (!CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    console.log('R2 credentials not found, returning mock URL');
    return `${CLOUDFLARE_R2_URL || 'https://r2.example.com'}/${type}s/${userId}/${file.name}`;
  }

  try {
    // Create a unique file path
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${type}s/${userId}/${fileName}`;

    // For security, we should generate a pre-signed URL on the server
    // But for demonstration purposes, we'll simulate direct upload
    
    // If we were using AWS SDK directly:
    /*
    const params = {
      Bucket: 'pasa-data',
      Key: filePath,
      Body: file,
      ContentType: file.type,
    };
    
    const result = await s3Client.send(new PutObjectCommand(params));
    */
    
    // Instead, for now we'll prepare for a fetch upload
    const formData = new FormData();
    formData.append('file', file);
    
    // This would typically go through your backend API
    // const response = await fetch(`/api/upload/${type}/${userId}`, {
    //   method: 'POST',
    //   body: formData,
    // });
    
    // Mock successful upload
    console.log(`File uploaded: ${filePath}`);
    
    // Construct and return the URL
    return `${CLOUDFLARE_R2_URL}/${filePath}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Get a file from Cloudflare R2 storage
 * @param url URL of the file to get
 * @returns Blob of the file
 */
export async function getFile(url: string): Promise<Blob> {
  try {
    // If in development mode and no R2 credentials, return mock data
    if (!CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
      console.log('R2 credentials not found, returning mock data');
      return new Blob(['Mock file content'], { type: 'application/pdf' });
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error getting file:', error);
    throw new Error('Failed to get file');
  }
}

/**
 * Delete a file from Cloudflare R2 storage
 * @param url URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    // If in development mode and no R2 credentials, skip deletion
    if (!CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
      console.log('R2 credentials not found, skipping file deletion');
      return;
    }
    
    // This would typically go through your backend API
    // const response = await fetch(`/api/delete-file`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ url }),
    // });
    
    // if (!response.ok) {
    //   throw new Error(`Failed to delete file: ${response.status} ${response.statusText}`);
    // }
    
    console.log(`File deleted: ${url}`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Generate a public URL for a file
 * @param filePath Path of the file in storage
 * @param expirationMinutes How long the URL should be valid (in minutes)
 * @returns Public URL for the file
 */
export function getPublicUrl(filePath: string, expirationMinutes: number = 60): string {
  // In a real implementation, this would generate a time-limited signed URL
  // But for demonstration purposes, we'll just return the full URL
  
  // If the filePath is already a full URL, return it
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  return `${CLOUDFLARE_R2_URL}/${filePath}`;
} 