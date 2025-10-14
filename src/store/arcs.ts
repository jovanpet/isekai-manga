import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Arc } from '@/types/story/arc';
import { ArcOutline } from '@/generation/services/seriesOutlineService';

export const arcStore = {
    async createArcs(storyId: string, arcOutlines: ArcOutline[]): Promise<string[]> {
        try {
            const arcIds: string[] = [];
            const arcsCollectionRef = collection(db, 'stories', storyId, 'arcs');

            for (let i = 0; i < arcOutlines.length; i++) {
                const arcData = {
                    ...arcOutlines[i],
                    order: i + 1,
                    chapters: [],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };

                const docRef = await addDoc(arcsCollectionRef, arcData);
                arcIds.push(docRef.id);
            }

            return arcIds;
        } catch (error) {
            console.error('Error creating arcs:', error);
            throw error;
        }
    },

    async getArcs(storyId: string): Promise<Arc[]> {
        try {
            const arcsCollectionRef = collection(db, 'stories', storyId, 'arcs');
            const q = query(arcsCollectionRef, orderBy('order', 'asc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Arc[];
        } catch (error) {
            console.error('Error getting arcs:', error);
            throw error;
        }
    },

    async updateArc(storyId: string, arcId: string, updates: Partial<Omit<Arc, 'id' | 'createdAt'>>): Promise<void> {
        try {
            const arcDocRef = doc(db, 'stories', storyId, 'arcs', arcId);
            await updateDoc(arcDocRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating arc:', error);
            throw error;
        }
    },

    async deleteArc(storyId: string, arcId: string): Promise<void> {
        try {
            const arcDocRef = doc(db, 'stories', storyId, 'arcs', arcId);
            await deleteDoc(arcDocRef);
        } catch (error) {
            console.error('Error deleting arc:', error);
            throw error;
        }
    },
};