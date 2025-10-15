'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';

function SettingsContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            if (!user) return;

            try {
                const settingsRef = doc(db, 'user_settings', user.uid);
                const settingsSnap = await getDoc(settingsRef);

                if (settingsSnap.exists()) {
                    const data = settingsSnap.data();
                    setApiKey(data.geminiApiKey || '');
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, [user]);

    const handleSave = async () => {
        if (!user || !apiKey.trim()) {
            setMessage({ type: 'error', text: 'Please enter an API key' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const settingsRef = doc(db, 'user_settings', user.uid);
            await setDoc(settingsRef, {
                geminiApiKey: apiKey.trim(),
                updatedAt: new Date()
            }, { merge: true });

            setMessage({ type: 'success', text: 'API key saved successfully!' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Failed to save API key. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919]">
            <div className="max-w-3xl mx-auto p-12">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm mb-6"
                    >
                        <span>←</span>
                        <span>Back to Home</span>
                    </button>

                    <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Settings
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Configure your account and API settings
                    </p>
                </div>

                <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Gemini API Key
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                API Key
                            </label>
                            <input
                                id="apiKey"
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Gemini API key"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Your API key is stored securely and used to generate story content.
                            </p>
                        </div>

                        {message && (
                            <div className={`rounded-lg p-4 ${
                                message.type === 'success'
                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                            }`}>
                                <p className={`text-sm ${
                                    message.type === 'success'
                                        ? 'text-green-800 dark:text-green-200'
                                        : 'text-red-800 dark:text-red-200'
                                }`}>
                                    {message.text}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={isSaving || !apiKey.trim()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save API Key'}
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            How to get your API key
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>Visit <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google AI Studio</a></li>
                            <li>Sign in with your Google account</li>
                            <li>Click "Get API Key" or "Create API Key"</li>
                            <li>Copy the key and paste it above</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsContent />
        </ProtectedRoute>
    );
}
