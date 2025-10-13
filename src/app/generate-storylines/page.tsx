'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateStorylines, StorylineOption } from '@/generation/storylineService';
import StorylineCard from '@/components/StorylineCard';
import { storyStore, characterStore } from '@/store';
import { StoryStatus, CharacterRole } from '@/types';

export default function GenerateStorylinesPage() {
    const [storylines, setStorylines] = useState<StorylineOption[]>([]);
    const [selectedStoryline, setSelectedStoryline] = useState<StorylineOption | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [storyData, setStoryData] = useState<any>(null);
    const [characterData, setCharacterData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadDataAndGenerateStorylines = async () => {
            try {
                // Load data from localStorage
                const tempStoryData = localStorage.getItem('tempStoryData');
                const tempCharacterData = localStorage.getItem('tempCharacterData');

                if (!tempStoryData || !tempCharacterData) {
                    setError('No story data found. Please fill out the form first.');
                    setIsLoading(false);
                    return;
                }

                const parsedStoryData = JSON.parse(tempStoryData);
                const parsedCharacterData = JSON.parse(tempCharacterData);

                setStoryData(parsedStoryData);
                setCharacterData(parsedCharacterData);

                // Generate storylines using Gemini
                const generatedStorylines = await generateStorylines(parsedStoryData, parsedCharacterData);
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
        if (!selectedStoryline || !storyData || !characterData) return;

        setIsSaving(true);

        try {
            // Update the story data with selected storyline
            const updatedStoryData = {
                ...storyData,
                title: selectedStoryline.title,
                description: selectedStoryline.description,
                plot: {
                    ...storyData.plot,
                    premise: selectedStoryline.hook,
                    goal: selectedStoryline.short_summary
                }
            };

            // Save story to Firebase
            const storyId = await storyStore.createStory(updatedStoryData);

            // Save character to Firebase under the story
            await characterStore.createCharacter(storyId, characterData);

            // Clean up localStorage
            localStorage.removeItem('tempStoryData');
            localStorage.removeItem('tempCharacterData');

            // Navigate to success page or story list
            router.push('/stories');
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
        if (!storyData || !characterData) return;

        setIsLoading(true);
        setError(null);
        setSelectedStoryline(null);

        try {
            const generatedStorylines = await generateStorylines(storyData, characterData);
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
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="bg-red-900/50 backdrop-blur-sm rounded-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                    <p className="text-red-200 mb-6">{error}</p>
                    <button
                        onClick={handleBackToForm}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                        Back to Form
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        Choose Your Storyline
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Select a storyline that resonates with your vision
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                            <p className="text-gray-300 text-lg">Generating storylines with AI...</p>
                            <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
                        </div>
                    </div>
                )}

                {/* Saving State */}
                {isSaving && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
                            <p className="text-gray-300 text-lg">Creating story...</p>
                            <p className="text-gray-400 text-sm mt-2">Saving your story and character</p>
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
                                description={storyline.description}
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
                            className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-300"
                        >
                            Back to Form
                        </button>

                        <button
                            onClick={handleRegenerateStorylines}
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300"
                        >
                            Regenerate Storylines
                        </button>

                        <button
                            onClick={handleUseStoryline}
                            disabled={!selectedStoryline}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            Use Selected Storyline
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}