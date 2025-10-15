'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateStorylines, StorylineOption } from '@/generation/services/storylineService';
import { createStoryFromStoryline } from '@/generation/services/storyCreationService';
import StorylineCard from '@/components/StorylineCard';
import ProtectedRoute from '@/components/ProtectedRoute';

function GenerateStorylinesContent() {
    const [storylines, setStorylines] = useState<StorylineOption[]>([]);
    const [selectedStoryline, setSelectedStoryline] = useState<StorylineOption | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [storyData, setStoryData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadDataAndGenerateStorylines = async () => {
            try {
                const tempStoryData = localStorage.getItem('tempStoryData');

                if (!tempStoryData) {
                    setError('No story data found. Please fill out the form first.');
                    setIsLoading(false);
                    return;
                }

                const parsedStoryData = JSON.parse(tempStoryData);
                setStoryData(parsedStoryData);

                const generatedStorylines = await generateStorylines(parsedStoryData);
                setStorylines(generatedStorylines);
            } catch (error) {
                console.error('Error generating storylines:', error);
                setError('Failed to generate storylines. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadDataAndGenerateStorylines();
    }, []);

    const handleStorylineSelect = (storyline: StorylineOption) => {
        setSelectedStoryline(storyline);
    };

    const handleUseStoryline = async () => {
        if (!selectedStoryline || !storyData) return;

        setIsSaving(true);

        try {
            const { storyId } = await createStoryFromStoryline({
                storyData,
                selectedStoryline
            });

            localStorage.removeItem('tempStoryData');
            router.push(`/story/${storyId}`);
        } catch (error) {
            console.error('Error saving story:', error);
            setError('Failed to save story. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBackToForm = () => {
        router.push('/');
    };

    const handleRegenerateStorylines = async () => {
        if (!storyData) return;

        setIsLoading(true);
        setError(null);
        setSelectedStoryline(null);

        try {
            const generatedStorylines = await generateStorylines(storyData);
            setStorylines(generatedStorylines);
        } catch (error) {
            console.error('Error regenerating storylines:', error);
            setError('Failed to regenerate storylines. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
                    <p className="text-red-800 dark:text-red-300 mb-6">{error}</p>
                    <button
                        onClick={handleBackToForm}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to Form
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919]">
            <div className="max-w-6xl mx-auto p-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Choose Your Storyline
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Select a storyline that resonates with your vision
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-900 dark:text-gray-100 text-lg font-medium">Generating storylines with AI...</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">This may take a few moments</p>
                        </div>
                    </div>
                )}

                {/* Saving State */}
                {isSaving && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-900 dark:text-gray-100 text-lg font-medium">Creating your story...</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Generating arcs, objectives, threads, and saving your story</p>
                        </div>
                    </div>
                )}

                {/* Storylines Grid */}
                {!isLoading && !isSaving && storylines.length > 0 && (
                    <div className="space-y-6 mb-8">
                        {storylines.map((storyline, index) => (
                            <StorylineCard
                                key={index}
                                title={storyline.title}
                                hook={storyline.hook}
                                short_summary={storyline.short_summary}
                                isSelected={selectedStoryline === storyline}
                                onClick={() => handleStorylineSelect(storyline)}
                            />
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                {!isLoading && !isSaving && (
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={handleBackToForm}
                            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Back to Form
                        </button>

                        <button
                            onClick={handleRegenerateStorylines}
                            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                        >
                            Regenerate Storylines
                        </button>

                        <button
                            onClick={handleUseStoryline}
                            disabled={!selectedStoryline}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Use Selected Storyline
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function GenerateStorylinesPage() {
    return (
        <ProtectedRoute>
            <GenerateStorylinesContent />
        </ProtectedRoute>
    );
}
