'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { storyStore } from '@/store';
import { generatePagesForChapter } from '@/generation/services/pageService';
import { Story } from '@/types/story/story';
import { StoryDetails } from '@/types/story_details';
import { Chapter } from '@/types/story/arc';
import ProtectedRoute from '@/components/ProtectedRoute';

function ChapterViewContent() {
    const [story, setStory] = useState<Story & { details: StoryDetails } | null>(null);
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingPages, setIsGeneratingPages] = useState(false);
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

    const handleGeneratePages = async () => {
        if (!story || !chapter) return;

        setIsGeneratingPages(true);
        setError(null);

        try {
            const pageResponse = await generatePagesForChapter(chapter, story);

            const updatedArcs = [...story.arcs];
            updatedArcs[arcIndex] = {
                ...updatedArcs[arcIndex],
                chapters: updatedArcs[arcIndex].chapters?.map((ch, idx) =>
                    idx === chapterIndex ? { ...ch, pages: pageResponse.pages } : ch
                ) || []
            };

            await storyStore.updateStory(storyId, {
                arcs: updatedArcs
            });

            setChapter({
                ...chapter,
                pages: pageResponse.pages
            });

            const updatedStoryWithDetails = await storyStore.getStoryWithDetails(storyId);
            setStory(updatedStoryWithDetails);
        } catch (error) {
            console.error('Error generating pages:', error);
            setError('Failed to generate pages. Please try again.');
        } finally {
            setIsGeneratingPages(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
                </div>
            </div>
        );
    }

    if (error || !story || !chapter) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
                    <p className="text-red-800 dark:text-red-300 mb-6">{error}</p>
                    <button
                        onClick={() => router.push(`/story/${storyId}`)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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

    const getOutcomeBadge = (outcomeType: string) => {
        const badges: Record<string, string> = {
            'victory': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            'progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            'setback': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
            'twist': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
        };
        return badges[outcomeType] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919]">
            <div className="max-w-4xl mx-auto p-12">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push(`/story/${storyId}`)}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        ← Back to {story.details.title}
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Arc {arc.order}: {arc.title}
                    </p>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Chapter {chapterIndex + 1}: {chapter.chapterTitle}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOutcomeBadge(chapter.outcomeType)}`}>
                            {chapter.outcomeType}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                            {chapter.sceneType}
                        </span>
                    </div>
                </div>

                {/* Chapter Content */}
                <div className="space-y-8 mb-12">
                    {/* Summary */}
                    <section className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Summary</h2>
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{chapter.summary}</p>
                    </section>

                    {/* Detailed Description */}
                    {chapter.detailed_description && (
                        <section className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Chapter Events</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{chapter.detailed_description}</p>
                        </section>
                    )}

                    {/* Challenge & Resolution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Challenge</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{chapter.challenge}</p>
                        </div>
                        <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Resolution</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{chapter.resolution}</p>
                        </div>
                    </div>

                    {/* Key Choices */}
                    {chapter.choices && chapter.choices.length > 0 && (
                        <section className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Key Choices</h3>
                            <ul className="space-y-2">
                                {chapter.choices.map((choice, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span>
                                        <span className="text-gray-700 dark:text-gray-300">{choice}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Generate Pages Button */}
                {(!chapter.pages || chapter.pages.length === 0) && (
                    <div className="mb-12">
                        <button
                            onClick={handleGeneratePages}
                            disabled={isGeneratingPages}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingPages ? 'Generating Pages...' : 'Generate Manga Pages'}
                        </button>
                    </div>
                )}

                {/* Manga Pages */}
                {chapter.pages && chapter.pages.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                            Manga Pages ({chapter.pages.length})
                        </h2>

                        <div className="space-y-6">
                            {chapter.pages.map((page) => (
                                <div key={page.id} className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            Page {page.order}
                                        </h3>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                                {page.pageType === 'splash' ? 'Full Page' : 'Multi Panel'}
                                            </span>
                                            {page.layoutType && (
                                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                                                    {page.layoutType}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-300 mb-4">{page.description}</p>

                                    {page.emotion && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            <span className="font-semibold">Emotion:</span> {page.emotion}
                                        </p>
                                    )}

                                    {/* Splash Page Panel */}
                                    {page.pageType === 'splash' && page.panel && (
                                        <div className="bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Scene</p>
                                                    <p className="text-gray-900 dark:text-gray-100">{page.panel.description}</p>
                                                </div>
                                                {page.panel.dialogue && (
                                                    <div>
                                                        <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Dialogue</p>
                                                        <p className="text-gray-900 dark:text-gray-100 italic">&quot;{page.panel.dialogue}&quot;</p>
                                                    </div>
                                                )}
                                                {page.panel.focusCharacters && page.panel.focusCharacters.length > 0 && (
                                                    <div>
                                                        <p className="text-gray-500 dark:text-gray-400 font-semibold mb-2">Characters</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {page.panel.focusCharacters.map((char, charIndex) => (
                                                                <span key={charIndex} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                                                                    {char}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {page.panel.cameraAngle && (
                                                    <div>
                                                        <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Camera</p>
                                                        <p className="text-gray-900 dark:text-gray-100">{page.panel.cameraAngle}</p>
                                                    </div>
                                                )}
                                                {page.panel.soundEffect && (
                                                    <div>
                                                        <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Sound Effect</p>
                                                        <p className="text-orange-600 dark:text-orange-400 font-bold">{page.panel.soundEffect}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Multi Panel Pages */}
                                    {page.pageType === 'multi' && page.panels && page.panels.length > 0 && (
                                        <div className="space-y-4">
                                            {page.panels.map((panel) => (
                                                <div key={panel.id} className="bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="font-semibold text-gray-900 dark:text-gray-100">Panel {panel.order}</h5>
                                                        {panel.emotion && (
                                                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs">
                                                                {panel.emotion}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Scene</p>
                                                            <p className="text-gray-900 dark:text-gray-100">{panel.description}</p>
                                                        </div>
                                                        {panel.dialogue && (
                                                            <div>
                                                                <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Dialogue</p>
                                                                <p className="text-gray-900 dark:text-gray-100 italic">&quot;{panel.dialogue}&quot;</p>
                                                            </div>
                                                        )}
                                                        {panel.focusCharacters && panel.focusCharacters.length > 0 && (
                                                            <div>
                                                                <p className="text-gray-500 dark:text-gray-400 font-semibold mb-2">Characters</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {panel.focusCharacters.map((char, charIndex) => (
                                                                        <span key={charIndex} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                                                                            {char}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {panel.cameraAngle && (
                                                            <div>
                                                                <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Camera</p>
                                                                <p className="text-gray-900 dark:text-gray-100">{panel.cameraAngle}</p>
                                                            </div>
                                                        )}
                                                        {panel.soundEffect && (
                                                            <div>
                                                                <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Sound Effect</p>
                                                                <p className="text-orange-600 dark:text-orange-400 font-bold">{panel.soundEffect}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex gap-2">
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
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                ← Previous Chapter
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {(hasNextChapter || hasNextArc) && (
                            <button
                                onClick={() => {
                                    if (hasNextChapter) {
                                        router.push(`/story/${storyId}/chapter/${arcIndex}/${chapterIndex + 1}`);
                                    } else if (hasNextArc) {
                                        router.push(`/story/${storyId}/chapter/${arcIndex + 1}/0`);
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Next Chapter →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ChapterViewPage() {
    return (
        <ProtectedRoute>
            <ChapterViewContent />
        </ProtectedRoute>
    );
}
