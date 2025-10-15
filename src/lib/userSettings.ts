import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export async function getUserApiKey(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    try {
        const settingsRef = doc(db, 'user_settings', user.uid);
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
            const data = settingsSnap.data();
            return data.geminiApiKey || null;
        }

        return null;
    } catch (error) {
        console.error('Error fetching user API key:', error);
        return null;
    }
}
