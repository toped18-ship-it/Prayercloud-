/**
 * Utility to upload files from user gadgets (computers, smartphones, tablets)
 */

export interface UploadedFileResult {
  url: string;
  fileName: string;
  originalName: string;
  size: number;
  fileType: string;
  isLocalOnly?: boolean;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function uploadFileFromDevice(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedFileResult> {
  // Read file as Base64 Data URL
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 50));
      }
    };
    reader.readAsDataURL(file);
  });

  try {
    if (onProgress) onProgress(60);

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        base64Data,
      }),
    });

    if (onProgress) onProgress(90);

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      throw new Error(errJson?.error || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    if (onProgress) onProgress(100);

    return {
      url: data.url,
      fileName: data.fileName,
      originalName: data.originalName || file.name,
      size: data.size || file.size,
      fileType: data.fileType || file.type,
    };
  } catch (error) {
    // If backend endpoint is unavailable, gracefully fall back to local Blob/DataURL
    console.warn('Backend upload unavailable, using client-side data URL fallback:', error);
    if (onProgress) onProgress(100);

    return {
      url: base64Data,
      fileName: file.name,
      originalName: file.name,
      size: file.size,
      fileType: file.type,
      isLocalOnly: true,
    };
  }
}
