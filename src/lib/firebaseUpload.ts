import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from './firebase'; 

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const uploadFile = async (
  userId: string,
  file: File,
  pathUnderBucket: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Set a short retry time so Firebase Storage fails fast if blocked/misconfigured
  try {
    storage.maxUploadRetryTime = 1500;
    storage.maxOperationRetryTime = 1500;
  } catch (err) {
    console.warn('Configuring storage retry properties error:', err);
  }

  // 1. Attempt Firebase Storage upload
  try {
    const storageRef = ref(storage, `${pathUnderBucket}/${Date.now()}_${file.name}`);
    
    const uploadPromise = new Promise<string>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) {
            onProgress(progress);
          }
        }, 
        (error) => {
          reject(error);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (e) {
            reject(e);
          }
        }
      );
    });

    // Timeout of 2 seconds for Firebase Storage upload
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('Firebase Storage upload timed out')), 2000);
    });

    const url = await Promise.race([uploadPromise, timeoutPromise]);
    console.log('[Upload] Firebase Storage upload succeeded:', url);
    if (onProgress) {
      onProgress(100);
    }
    return url;
  } catch (storageError) {
    console.warn('[Upload] Firebase Storage upload failed or timed out. Falling back to Express API:', storageError);
    
    // 2. Fallback: Express Server base64 upload
    try {
      if (onProgress) {
        onProgress(30);
      }
      const base64Data = await fileToBase64(file);
      if (onProgress) {
        onProgress(60);
      }
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileData: base64Data,
          userId,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${response.status} from API upload`);
      }

      const result = await response.json();
      console.log('[Upload] Express API fallback upload succeeded:', result.url);
      if (onProgress) {
        onProgress(100);
      }
      return result.url;
    } catch (apiError: any) {
      console.error('[Upload] Express API upload fallback also failed:', apiError);
      throw new Error(`Upload failed. ${apiError.message || 'Please try again.'}`);
    }
  }
};

export const uploadProfileMedia = async (userId: string, file: File, type: 'avatar' | 'coverPhoto', onProgress?: (p: number) => void) => {
  const pathUnderBucket = `users/${userId}/${type}`;
  const downloadURL = await uploadFile(userId, file, pathUnderBucket, onProgress);

  try {
    const userRef = doc(db, 'users', userId);
    const updateData = type === 'avatar' ? { avatar: downloadURL } : { coverPhoto: downloadURL };
    await updateDoc(userRef, updateData);
  } catch (firestoreError) {
    console.warn('[Upload] Failed to update doc users in Firestore:', firestoreError);
  }

  return downloadURL;
};
