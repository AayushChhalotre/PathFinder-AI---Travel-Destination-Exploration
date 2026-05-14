import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, increment, doc, orderBy, limit } from 'firebase/firestore';

export interface SavedInquiry {
  destinationName: string;
  count: number;
  lastQueried: any;
  vibeMatch?: string[];
  location?: string;
}

/**
 * Saves or updates a destination inquiry in the global community database.
 */
export async function logDestinationInquiry(
  destinationName: string, 
  location?: string, 
  vibes?: string[], 
  imageUrl?: string
) {
  if (!db) return;

  const normalizedName = destinationName.trim().toLowerCase();
  const collRef = collection(db, 'queried_destinations');
  
  try {
    const q = query(collRef, where('name_id', '==', normalizedName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'queried_destinations', existingDoc.id), {
        count: increment(1),
        lastQueried: serverTimestamp(),
        // Update vibes and image if provided and missing
        ...(vibes && { vibes: Array.from(new Set([...(existingDoc.data().vibes || []), ...vibes])) }),
        ...(imageUrl && !existingDoc.data().imageUrl && { imageUrl })
      });
    } else {
      await addDoc(collRef, {
        name: destinationName.trim(),
        name_id: normalizedName,
        location: location || '',
        vibes: vibes || [],
        imageUrl: imageUrl || '',
        count: 1,
        lastQueried: serverTimestamp(),
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('[UserDestinations] Failed to log inquiry:', error);
  }
}

const DEFAULT_TRENDING = [
  { name: 'Leh Ladakh', location: 'India', vibes: ['rugged', 'serene'], imageUrl: 'https://images.unsplash.com/photo-1581791534721-e599df4417f7?auto=format&fit=crop&w=800&q=80', count: 124 },
  { name: 'Amalfi Coast', location: 'Italy', vibes: ['vibrant', 'luxurious'], imageUrl: 'https://images.unsplash.com/photo-1633321088355-d0f81134ca3b?auto=format&fit=crop&w=800&q=80', count: 98 },
  { name: 'Kyoto', location: 'Japan', vibes: ['cultural', 'serene'], imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', count: 85 },
  { name: 'Iceland', location: 'North Atlantic', vibes: ['rugged', 'cinematic'], imageUrl: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80', count: 72 }
];

/**
 * Fetches the most popular destinations from the community database.
 */
export async function getPopularDestinations(limitCount = 6) {
  if (!db) return DEFAULT_TRENDING.slice(0, limitCount);
  
  const collRef = collection(db, 'queried_destinations');
  const q = query(collRef, orderBy('count', 'desc'), limit(limitCount));
  
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return DEFAULT_TRENDING.slice(0, limitCount);
    
    return querySnapshot.docs.map(d => ({ 
      id: d.id, 
      ...d.data(),
      // Ensure we have a valid image
      imageUrl: d.data().imageUrl || `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80`
    }));
  } catch (error) {
    console.error('[UserDestinations] Failed to fetch popular:', error);
    return DEFAULT_TRENDING.slice(0, limitCount);
  }
}
