'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { storyStore } from '@/store';
import { completeStoryWithChapters } from '@/generation/services/storyCompletionService';
import { Story } from '@/types/story/story';
import { StoryDetails } from '@/types/story_details';

export default function StoryDisplayPage() {
    const [story, setStory] = useState<Story & { details: StoryDetails } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingChapters, setIsGeneratingChapters] = useState(false);
    const router = useRouter();
    const params = useParams();
    const storyId = params.id as string;

    useEffect(() => {
        const loadStory = async () => {
            try {
                const storyWithDetails = await storyStore.getStoryWithDetails(storyId);
                if (!storyWithDetails) {
                    setError('Story not found');
                    return;
                }
                setStory(storyWithDetails);
            } catch (error) {
                console.error('Error loading story:', error);
                setError('Failed to load story');
            } finally {
                setIsLoading(false);
            }
        };

        if (storyId) {
            loadStory();
        }
    }, [storyId]);

    const handleGenerateChapters = async () => {
        if (!story) return;

        setIsGeneratingChapters(true);
        setError(null);

        try {
            const result = await completeStoryWithChapters(storyId);
            // Reload the story to get the updated data with chapters
            const updatedStoryWithDetails = await storyStore.getStoryWithDetails(storyId);
            setStory(updatedStoryWithDetails);
        } catch (error) {
            console.error('Error generating chapters:', error);
            setError('Failed to generate chapters. Please try again.');
        } finally {
            setIsGeneratingChapters(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg">Loading your story...</p>
                </div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="bg-red-900/50 backdrop-blur-sm rounded-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                    <p className="text-red-200 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                        Back to Home
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
                        {story.details.title}
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Your Isekai Story is Ready!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Story Details */}
                    <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-purple-300 mb-4">Story Details</h2>

                        <div className="space-y-3">
                            <div>
                                <span className="text-gray-400 font-semibold">Summary:</span>
                                <p className="text-gray-300 mt-1">{story.details.summary}</p>
                            </div>

                            <div>
                                <span className="text-gray-400 font-semibold">Description:</span>
                                <p className="text-gray-300 mt-1">{story.details.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 font-semibold">Influence:</span>
                                    <p className="text-gray-300">{story.details.influence}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-semibold">Total Arcs:</span>
                                    <p className="text-gray-300">{story.details.totalArcs}</p>
                                </div>
                            </div>

                            <div>
                                <span className="text-gray-400 font-semibold">World Type:</span>
                                <p className="text-gray-300">{story.details.newWorldType}</p>
                            </div>

                            <div>
                                <span className="text-gray-400 font-semibold">Origin World:</span>
                                <p className="text-gray-300">{story.details.originWorld}</p>
                            </div>

                            <div>
                                <span className="text-gray-400 font-semibold">Genre Tags:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {story.details.genreTags.map((tag, index) => (
                                        <span key={index} className="bg-purple-600/50 px-2 py-1 rounded-lg text-sm text-purple-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Character */}
                    <div className="bg-gradient-to-br from-cyan-800/50 to-teal-800/50 backdrop-blur-sm rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-cyan-300 mb-4">Main Character</h2>

                        <div className="space-y-3">
                            <div>
                                <span className="text-gray-400 font-semibold">Name:</span>
                                <p className="text-gray-300">{story.details.mainCharacter.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 font-semibold">Gender:</span>
                                    <p className="text-gray-300">{story.details.mainCharacter.gender}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-semibold">Species:</span>
                                    <p className="text-gray-300">{story.details.mainCharacter.species}</p>
                                </div>
                            </div>

                            <div>
                                <span className="text-gray-400 font-semibold">Rebirth Type:</span>
                                <p className="text-gray-300">{story.details.mainCharacter.rebirthType}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-400 font-semibold">Previous Job:</span>
                                    <p className="text-gray-300">{story.details.mainCharacter.previousOccupation}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-semibold">New Role:</span>
                                    <p className="text-gray-300">{story.details.mainCharacter.characterOccupation}</p>
                                </div>
                            </div>

                            <div>
                                <span className="text-gray-400 font-semibold">Overpowered:</span>
                                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                    story.details.mainCharacter.overpowered
                                        ? 'bg-green-600/50 text-green-200'
                                        : 'bg-gray-600/50 text-gray-300'
                                }`}>
                                    {story.details.mainCharacter.overpowered ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Objectives */}
                <div className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 backdrop-blur-sm rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-green-300 mb-6">Story Objectives</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {story.objectives.map((objective, index) => (
                            <div key={index} className="bg-black/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-green-200">{objective.title}</h3>
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        objective.type === 'main'
                                            ? 'bg-yellow-600/50 text-yellow-200'
                                            : 'bg-gray-600/50 text-gray-300'
                                    }`}>
                                        {objective.type}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <span className="text-gray-400 font-semibold text-sm">Description:</span>
                                        <p className="text-gray-300 text-sm">{objective.description}</p>
                                    </div>

                                    <div>
                                        <span className="text-gray-400 font-semibold text-sm">Related Arcs:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {objective.relatedArcs.map((arcTitle, arcIndex) => (
                                                <span key={arcIndex} className="bg-green-600/50 px-2 py-1 rounded text-xs text-green-200">
                                                    {arcTitle}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Story Threads */}
                <div className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-purple-300 mb-6">Story Threads</h2>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Major Threads */}
                        <div>
                            <h3 className="text-lg font-bold text-purple-200 mb-4">Major Threads</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {story.threads.filter(thread => thread.importance === 'major').map((thread, index) => (
                                    <div key={index} className="bg-black/30 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-md font-bold text-purple-100">{thread.title}</h4>
                                            <span className="px-2 py-1 rounded text-xs bg-purple-600/50 text-purple-200">
                                                {thread.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-400 font-semibold text-sm">Summary:</span>
                                                <p className="text-gray-300 text-sm">{thread.summary}</p>
                                            </div>

                                            <div>
                                                <span className="text-gray-400 font-semibold text-sm">Introduced:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    <span className="bg-blue-600/50 px-2 py-1 rounded text-xs text-blue-200">
                                                        {thread.arcIntroduced}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-gray-400 font-semibold text-sm">Resolved:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    <span className="bg-green-600/50 px-2 py-1 rounded text-xs text-green-200">
                                                        {thread.arcsResolved}
                                                    </span>
                                                </div>
                                            </div>

                                            {thread.relatedObjectives.length > 0 && (
                                                <div>
                                                    <span className="text-gray-400 font-semibold text-sm">Related Objectives:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {thread.relatedObjectives.map((objTitle, objIndex) => (
                                                            <span key={objIndex} className="bg-yellow-600/50 px-2 py-1 rounded text-xs text-yellow-200">
                                                                {objTitle}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Minor Threads */}
                        <div>
                            <h3 className="text-lg font-bold text-purple-200 mb-4">Minor Threads</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {story.threads.filter(thread => thread.importance === 'minor').map((thread, index) => (
                                    <div key={index} className="bg-black/30 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-md font-bold text-purple-100">{thread.title}</h4>
                                            <span className="px-2 py-1 rounded text-xs bg-gray-600/50 text-gray-300">
                                                {thread.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-gray-400 font-semibold text-sm">Summary:</span>
                                                <p className="text-gray-300 text-sm">{thread.summary}</p>
                                            </div>

                                            <div>
                                                <span className="text-gray-400 font-semibold text-sm">Arcs:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    <span className="bg-blue-600/50 px-2 py-1 rounded text-xs text-blue-200">
                                                        Intro: {thread.arcIntroduced}
                                                    </span>
                                                    <span className="bg-green-600/50 px-2 py-1 rounded text-xs text-green-200">
                                                        Resolved: {thread.arcsResolved}
                                                    </span>
                                                </div>
                                            </div>

                                            {thread.relatedObjectives.length > 0 && (
                                                <div>
                                                    <span className="text-gray-400 font-semibold text-sm">Objectives:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {thread.relatedObjectives.map((objTitle, objIndex) => (
                                                            <span key={objIndex} className="bg-yellow-600/50 px-2 py-1 rounded text-xs text-yellow-200">
                                                                {objTitle}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Story Arcs */}
                <div className="bg-gradient-to-br from-pink-800/50 to-orange-800/50 backdrop-blur-sm rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-pink-300 mb-6">Story Arcs</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {story.arcs.map((arc, index) => (
                            <div key={arc.id} className="bg-black/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-pink-200">Arc {arc.order}: {arc.title}</h3>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <span className="text-gray-400 font-semibold text-sm">Theme:</span>
                                        <p className="text-gray-300 text-sm">{arc.theme}</p>
                                    </div>

                                    <div>
                                        <span className="text-gray-400 font-semibold text-sm">Goal:</span>
                                        <p className="text-gray-300 text-sm">{arc.goal}</p>
                                    </div>

                                    <div>
                                        <span className="text-gray-400 font-semibold text-sm">Key Twist:</span>
                                        <p className="text-gray-300 text-sm">{arc.keyTwist}</p>
                                    </div>

                                    <div>
                                        <span className="text-gray-400 font-semibold text-sm">Ending:</span>
                                        <p className="text-gray-300 text-sm">{arc.endingHint}</p>
                                    </div>

                                    {/* Chapters */}
                                    {arc.chapters && arc.chapters.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-600">
                                            <span className="text-gray-400 font-semibold text-sm">Chapters ({arc.chapters.length}):</span>
                                            <div className="mt-2 space-y-2">
                                                {arc.chapters.map((chapter, chapterIndex) => (
                                                    <div key={chapterIndex} className="bg-black/20 rounded p-3 hover:bg-black/30 transition-colors cursor-pointer"
                                                         onClick={() => router.push(`/story/${storyId}/chapter/${index}/${chapterIndex}`)}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="text-sm font-bold text-pink-100 hover:text-pink-50">
                                                                Ch. {chapterIndex + 1}: {chapter.chapterTitle}
                                                            </h5>
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                chapter.outcomeType === 'victory' ? 'bg-green-600/50 text-green-200' :
                                                                chapter.outcomeType === 'progress' ? 'bg-blue-600/50 text-blue-200' :
                                                                chapter.outcomeType === 'setback' ? 'bg-red-600/50 text-red-200' :
                                                                'bg-purple-600/50 text-purple-200'
                                                            }`}>
                                                                {chapter.sceneType}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-300 text-xs mb-2">{chapter.summary}</p>
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div>
                                                                <span className="text-gray-400 font-semibold">Challenge:</span>
                                                                <p className="text-gray-300">{chapter.challenge}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400 font-semibold">Resolution:</span>
                                                                <p className="text-gray-300">{chapter.resolution}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-300"
                    >
                        Create New Story
                    </button>

                    <button
                        onClick={handleGenerateChapters}
                        disabled={isGeneratingChapters}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isGeneratingChapters ? 'Generating Chapters...' : 'Generate Chapters'}
                    </button>
                </div>
            </div>
        </div>
    );
}