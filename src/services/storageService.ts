import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export class StorageService {
  /**
   * Upload file to tenant specific folder structure
   * Path format: tenants/{tenantId}/{folder}/{filename}
   */
  static async uploadTenantFile(
    tenantId: string, 
    folder: 'logos' | 'members' | 'receipts' | 'attachments' | 'backups', 
    file: File
  ): Promise<string> {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `tenants/${tenantId}/${folder}/${fileName}`;
    const storageRef = ref(storage, storagePath);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  /**
   * Delete file by storage URL
   */
  static async deleteFileByURL(url: string): Promise<void> {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.warn('Storage deletion error:', error);
    }
  }
}
