'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { storyStore } from '@/store';
import { Story } from '@/types/story/story';
import { StoryDetails } from '@/types/story_details';
import { Chapter } from '@/types/story/arc';

export default function ChapterViewPage() {
    const [story, setStory] = useState<Story & { details: StoryDetails } | null>(null);
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const storyId = params.id as string;
    const arcIndex = parseInt(params.arcIndex as string);
    const chapterIndex = parseInt(params.chapterIndex as string);

    useEffect(() => {
        const loadChapter = async () => {
            try {
                const storyWithDetails = await storyStore.getStoryWithDetails(storyId);
                if (!storyWithDetails) {
                    setError('Story not found');
                    return;
                }

                const arc = storyWithDetails.arcs[arcIndex];
                if (!arc) {
                    setError('Arc not found');
                    return;
                }

                const chapterData = arc.chapters[chapterIndex];
                if (!chapterData) {
                    setError('Chapter not found');
                    return;
                }

                setStory(storyWithDetails);
                setChapter(chapterData);
            } catch (error) {
                console.error('Error loading chapter:', error);
                setError('Failed to load chapter');
            } finally {
                setIsLoading(false);
            }
        };

        if (storyId && !isNaN(arcIndex) && !isNaN(chapterIndex)) {
            loadChapter();
        }
    }, [storyId, arcIndex, chapterIndex]);

    const getOutcomeColor = (outcomeType: string) => {
        switch (outcomeType) {
            case 'victory': return 'from-green-600 to-emerald-600';
            case 'progress': return 'from-blue-600 to-cyan-600';
            case 'setback': return 'from-red-600 to-pink-600';
            case 'twist': return 'from-purple-600 to-indigo-600';
            default: return 'from-gray-600 to-slate-600';
        }
    };

    const getOutcomeIcon = (outcomeType: string) => {
        switch (outcomeType) {
            case 'victory': return '🏆';
            case 'progress': return '⬆️';
            case 'setback': return '⬇️';
            case 'twist': return '🌀';
            default: return '📖';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg">Loading chapter...</p>
                </div>
            </div>
        );
    }

    if (error || !story || !chapter) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="bg-red-900/50 backdrop-blur-sm rounded-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                    <p className="text-red-200 mb-6">{error}</p>
                    <button
                        onClick={() => router.push(`/story/${storyId}`)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                        Back to Story
                    </button>
                </div>
            </div>
        );
    }

    const arc = story.arcs[arcIndex];
    const hasNextChapter = chapterIndex < arc.chapters.length - 1;
    const hasPrevChapter = chapterIndex > 0;
    const hasNextArc = arcIndex < story.arcs.length - 1;
    const hasPrevArc = arcIndex > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <span className="text-gray-400 text-sm">
                            {story.details.title} • Arc {arc.order}: {arc.title}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Chapter {chapterIndex + 1}: {chapter.chapterTitle}
                    </h1>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getOutcomeColor(chapter.outcomeType)} text-white font-semibold`}>
                        <span>{getOutcomeIcon(chapter.outcomeType)}</span>
                        <span>{chapter.sceneType}</span>
                        <span>•</span>
                        <span>{chapter.outcomeType}</span>
                    </div>
                </div>

                {/* Chapter Content */}
                <div className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-xl p-8 mb-8">
                    {/* Summary */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-purple-300 mb-4">Summary</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">{chapter.summary}</p>
                    </div>

                    {/* Detailed Description */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-purple-300 mb-4">Chapter Events</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                                {chapter.detailed_description}
                            </p>
                        </div>
                    </div>

                    {/* Challenge & Resolution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-black/30 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-red-300 mb-3">Challenge</h3>
                            <p className="text-gray-300 leading-relaxed">{chapter.challenge}</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-green-300 mb-3">Resolution</h3>
                            <p className="text-gray-300 leading-relaxed">{chapter.resolution}</p>
                        </div>
                    </div>

                    {/* Choices */}
                    {chapter.choices && chapter.choices.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-yellow-300 mb-3">Key Choices</h3>
                            <ul className="space-y-2">
                                {chapter.choices.map((choice, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-yellow-400 font-bold mt-1">•</span>
                                        <span className="text-gray-300">{choice}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push(`/story/${storyId}`)}
                            className="px-4 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-300"
                        >
                            Back to Story
                        </button>

                        {(hasPrevChapter || hasPrevArc) && (
                            <button
                                onClick={() => {
                                    if (hasPrevChapter) {
                                        router.push(`/story/${storyId}/chapter/${arcIndex}/${chapterIndex - 1}`);
                                    } else if (hasPrevArc) {
                                        const prevArc = story.arcs[arcIndex - 1];
                                        const lastChapterIndex = prevArc.chapters.length - 1;
                                        router.push(`/story/${storyId}/chapter/${arcIndex - 1}/${lastChapterIndex}`);
                                    }
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                            >
                                ← Previous Chapter
                            </button>
                        )}
                    </div>

                    {(hasNextChapter || hasNextArc) && (
                        <button
                            onClick={() => {
                                if (hasNextChapter) {
                                    router.push(`/story/${storyId}/chapter/${arcIndex}/${chapterIndex + 1}`);
                                } else if (hasNextArc) {
                                    router.push(`/story/${storyId}/chapter/${arcIndex + 1}/0`);
                                }
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-lg hover:from-cyan-700 hover:to-teal-700 transition-all duration-300"
                        >
                            Next Chapter →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}