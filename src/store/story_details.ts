import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StoryDetails } from '@/types/story_details';

const COLLECTION_NAME = 'story_details';

export const storyDetailsStore = {
    async createStory(storyData: Omit<StoryDetails, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...storyData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating story:', error);
            throw error;
        }
    },

    async getStory(id: string): Promise<StoryDetails | null> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                } as StoryDetails;
            }

            return null;
        } catch (error) {
            console.error('Error getting story:', error);
            throw error;
        }
    },

    async updateStory(id: string, updates: Partial<Omit<StoryDetails, 'id' | 'createdAt'>>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating story:', error);
            throw error;
        }
    },

    async deleteStory(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting story:', error);
            throw error;
        }
    },

    async getAllStories(): Promise<StoryDetails[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as StoryDetails[];
        } catch (error) {
            console.error('Error getting all stories:', error);
            throw error;
        }
    },

    async getStoriesByUser(userId: string): Promise<StoryDetails[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as StoryDetails[];
        } catch (error) {
            console.error('Error getting user stories:', error);
            throw error;
        }
    },

    async getStoriesByStatus(status: string): Promise<StoryDetails[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('status', '==', status),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as StoryDetails[];
        } catch (error) {
            console.error('Error getting stories by status:', error);
            throw error;
        }
    },
};