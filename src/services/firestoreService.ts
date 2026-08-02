import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, DocumentData, QueryConstraint, serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export class FirestoreService {
  /**
   * Fetch a single document by Collection name and Document ID
   */
  static async getById<T = DocumentData>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  }

  /**
   * Query items within an organization (Tenant Isolation)
   */
  static async getTenantCollection<T = DocumentData>(
    collectionName: string, 
    tenantId: string, 
    extraConstraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const colRef = collection(db, collectionName);
    const q = query(colRef, where('tenantId', '==', tenantId), ...extraConstraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  /**
   * Save or overwrite a document
   */
  static async set<T extends DocumentData>(collectionName: string, id: string, data: T): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  /**
   * Update fields of a document
   */
  static async update(collectionName: string, id: string, data: Partial<DocumentData>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Delete a document
   */
  static async remove(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }
}
