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
import { Character } from '@/types/character';

export const characterStore = {
    async createCharacter(storyId: string, characterData: Omit<Character, 'id' | 'storyId' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            if (!storyId || storyId.trim() === '') {
                throw new Error('Story ID is required to create character');
            }

            const charactersRef = collection(db, 'stories', storyId, 'characters');

            // Clean the data to remove undefined values (Firebase doesn't allow them)
            const cleanData = (obj: any): any => {
                if (obj === null || obj === undefined) return null;
                if (typeof obj !== 'object') return obj;
                if (Array.isArray(obj)) return obj.filter(item => item !== undefined);

                const cleaned: any = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (value !== undefined) {
                        cleaned[key] = typeof value === 'object' ? cleanData(value) : value;
                    }
                }
                return cleaned;
            };

            const cleanedData = cleanData(characterData);

            const dataToSave = {
                ...cleanedData,
                storyId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(charactersRef, dataToSave);
            return docRef.id;
        } catch (error) {
            console.error('Error creating character:', error);
            throw error;
        }
    },

    async getCharacter(storyId: string, characterId: string): Promise<Character | null> {
        try {
            const docRef = doc(db, 'stories', storyId, 'characters', characterId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    storyId,
                    ...docSnap.data(),
                } as Character;
            }

            return null;
        } catch (error) {
            console.error('Error getting character:', error);
            throw error;
        }
    },

    async updateCharacter(storyId: string, characterId: string, updates: Partial<Omit<Character, 'id' | 'storyId' | 'createdAt'>>): Promise<void> {
        try {
            const docRef = doc(db, 'stories', storyId, 'characters', characterId);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error updating character:', error);
            throw error;
        }
    },

    async deleteCharacter(storyId: string, characterId: string): Promise<void> {
        try {
            const docRef = doc(db, 'stories', storyId, 'characters', characterId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting character:', error);
            throw error;
        }
    },

    async getCharactersByStory(storyId: string): Promise<Character[]> {
        try {
            const charactersRef = collection(db, 'stories', storyId, 'characters');
            const q = query(charactersRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                storyId,
                ...doc.data(),
            })) as Character[];
        } catch (error) {
            console.error('Error getting story characters:', error);
            throw error;
        }
    },

    async getCharactersByRole(storyId: string, role: string): Promise<Character[]> {
        try {
            const charactersRef = collection(db, 'stories', storyId, 'characters');
            const q = query(
                charactersRef,
                where('role', '==', role),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                storyId,
                ...doc.data(),
            })) as Character[];
        } catch (error) {
            console.error('Error getting characters by role:', error);
            throw error;
        }
    },

    async getMainCharacter(storyId: string): Promise<Character | null> {
        try {
            const charactersRef = collection(db, 'stories', storyId, 'characters');
            const q = query(
                charactersRef,
                where('role', '==', 'protagonist')
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return {
                    id: doc.id,
                    storyId,
                    ...doc.data(),
                } as Character;
            }

            return null;
        } catch (error) {
            console.error('Error getting main character:', error);
            throw error;
        }
    },
};