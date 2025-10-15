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
import { Story } from '@/types/story/story';
import { StoryDetails } from '@/types/story_details';
import { Arc } from '@/types/story/arc';
import { Objective } from '@/types/story/objective';
import { Thread } from '@/types/story/thread';
import { Character } from '@/types/character';

const COLLECTION_NAME = 'stories';

export const storyStore = {
    async createStory(storyDetails: StoryDetails, arcs: Arc[] = [], objectives: Objective[] = [], threads: Thread[] = [], characters: Character[] = []): Promise<string> {
        try {
            // First save the StoryDetails to get an ID
            const storyDetailsRef = await addDoc(collection(db, 'story_details'), {
                ...storyDetails,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Create the full Story object
            const storyData: Omit<Story, 'id'> = {
                arcs,
                objectives,
                threads,
                characters,
                storyDetailsId: storyDetailsRef.id
            };

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

    async getStory(id: string): Promise<Story | null> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                } as Story;
            }

            return null;
        } catch (error) {
            console.error('Error getting story:', error);
            throw error;
        }
    },

    async getStoryWithDetails(id: string): Promise<(Story & { details: StoryDetails }) | null> {
        try {
            const story = await this.getStory(id);
            if (!story) return null;

            const detailsRef = doc(db, 'story_details', story.storyDetailsId);
            const detailsSnap = await getDoc(detailsRef);

            if (detailsSnap.exists()) {
                return {
                    ...story,
                    details: {
                        id: detailsSnap.id,
                        ...detailsSnap.data(),
                    } as StoryDetails
                };
            }

            return null;
        } catch (error) {
            console.error('Error getting story with details:', error);
            throw error;
        }
    },

    async updateStory(id: string, updates: Partial<Omit<Story, 'id' | 'createdAt'>>): Promise<void> {
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

    async getAllStories(): Promise<Story[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Story[];
        } catch (error) {
            console.error('Error getting all stories:', error);
            throw error;
        }
    },

    async getStoriesByUser(userId: string): Promise<Story[]> {
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
            })) as Story[];
        } catch (error) {
            console.error('Error getting user stories:', error);
            throw error;
        }
    },

    async getAllStoriesWithDetails(): Promise<(Story & { details: StoryDetails })[]> {
        try {
            const stories = await this.getAllStories();

            // Fetch details for all stories in parallel
            const storiesWithDetails = await Promise.all(
                stories.map(async (story) => {
                    const detailsRef = doc(db, 'story_details', story.storyDetailsId);
                    const detailsSnap = await getDoc(detailsRef);

                    if (detailsSnap.exists()) {
                        return {
                            ...story,
                            details: {
                                id: detailsSnap.id,
                                ...detailsSnap.data(),
                            } as StoryDetails
                        };
                    }
                    return null;
                })
            );

            // Filter out any null values
            return storiesWithDetails.filter((story): story is Story & { details: StoryDetails } => story !== null);
        } catch (error) {
            console.error('Error getting all stories with details:', error);
            throw error;
        }
    },
};