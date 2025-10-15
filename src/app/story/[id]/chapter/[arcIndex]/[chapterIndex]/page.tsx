'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { storyStore } from '@/store';
import { generatePagesForChapter } from '@/generation/services/pageService';
import { Story } from '@/types/story/story';
import { StoryDetails } from '@/types/story_details';
import { Chapter } from '@/types/story/arc';

export default function ChapterViewPage() {
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
            // Generate pages for this chapter
            const pageResponse = await generatePagesForChapter(chapter, story);

            // Update the chapter with generated pages
            const updatedArcs = [...story.arcs];
            updatedArcs[arcIndex] = {
                ...updatedArcs[arcIndex],
                chapters: updatedArcs[arcIndex].chapters?.map((ch, idx) =>
                    idx === chapterIndex ? { ...ch, pages: pageResponse.pages } : ch
                ) || []
            };

            // Update Firestore
            await storyStore.updateStory(storyId, {
                arcs: updatedArcs
            });

            // Update local state
            setChapter({
                ...chapter,
                pages: pageResponse.pages
            });

            // Reload the story
            const updatedStoryWithDetails = await storyStore.getStoryWithDetails(storyId);
            setStory(updatedStoryWithDetails);
        } catch (error) {
            console.error('Error generating pages:', error);
            setError('Failed to generate pages. Please try again.');
        } finally {
            setIsGeneratingPages(false);
        }
    };

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

                {/* Pages */}
                {chapter.pages && chapter.pages.length > 0 && (
                    <div className="bg-gradient-to-br from-indigo-800/50 to-purple-800/50 backdrop-blur-sm rounded-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold text-indigo-300 mb-6">Manga Pages ({chapter.pages.length})</h2>

                        <div className="space-y-8">
                            {chapter.pages.map((page, pageIndex) => (
                                <div key={page.id} className="bg-black/30 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-indigo-200">
                                            Page {page.order} - {page.pageType === 'splash' ? 'Full Page' : 'Multi Panel'}
                                        </h3>
                                        <div className="flex gap-2">
                                            {page.pageType === 'splash' && (
                                                <span className="px-2 py-1 rounded text-xs bg-red-600/50 text-red-200">
                                                    Splash
                                                </span>
                                            )}
                                            {page.layoutType && (
                                                <span className="px-2 py-1 rounded text-xs bg-blue-600/50 text-blue-200">
                                                    {page.layoutType}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <span className="text-gray-400 font-semibold text-sm">Page Description:</span>
                                        <p className="text-gray-300 text-sm mt-1">{page.description}</p>
                                    </div>

                                    {page.emotion && (
                                        <div className="mb-4">
                                            <span className="text-gray-400 font-semibold text-sm">Emotion:</span>
                                            <span className="text-yellow-300 text-sm ml-2">{page.emotion}</span>
                                        </div>
                                    )}

                                    {/* Splash Page Panel */}
                                    {page.pageType === 'splash' && page.panel && (
                                        <div className="bg-black/20 rounded p-4">
                                            <h4 className="text-md font-bold text-indigo-100 mb-3">Full Page Panel</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-400 font-semibold">Scene:</span>
                                                    <p className="text-gray-300 mt-1">{page.panel.description}</p>
                                                </div>
                                                {page.panel.dialogue && (
                                                    <div>
                                                        <span className="text-gray-400 font-semibold">Dialogue:</span>
                                                        <p className="text-gray-300 mt-1 italic">"{page.panel.dialogue}"</p>
                                                    </div>
                                                )}
                                                {page.panel.focusCharacters && page.panel.focusCharacters.length > 0 && (
                                                    <div>
                                                        <span className="text-gray-400 font-semibold">Characters:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {page.panel.focusCharacters.map((char, charIndex) => (
                                                                <span key={charIndex} className="bg-green-600/50 px-2 py-1 rounded text-xs text-green-200">
                                                                    {char}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {page.panel.settingHint && (
                                                    <div>
                                                        <span className="text-gray-400 font-semibold">Setting:</span>
                                                        <p className="text-gray-300 mt-1">{page.panel.settingHint}</p>
                                                    </div>
                                                )}
                                                {page.panel.cameraAngle && (
                                                    <div>
                                                        <span className="text-gray-400 font-semibold">Camera:</span>
                                                        <p className="text-gray-300 mt-1">{page.panel.cameraAngle}</p>
                                                    </div>
                                                )}
                                                {page.panel.soundEffect && (
                                                    <div>
                                                        <span className="text-gray-400 font-semibold">Sound:</span>
                                                        <p className="text-orange-300 mt-1 font-bold">{page.panel.soundEffect}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Multi Page Panels */}
                                    {page.pageType === 'multi' && page.panels && page.panels.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-md font-bold text-indigo-100">Panels ({page.panels.length})</h4>
                                            {page.panels.map((panel, panelIndex) => (
                                                <div key={panel.id} className="bg-black/20 rounded p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="text-sm font-bold text-indigo-50">Panel {panel.order}</h5>
                                                        {panel.emotion && (
                                                            <span className="px-2 py-1 rounded text-xs bg-yellow-600/50 text-yellow-200">
                                                                {panel.emotion}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <span className="text-gray-400 font-semibold">Scene:</span>
                                                            <p className="text-gray-300 mt-1">{panel.description}</p>
                                                        </div>
                                                        {panel.dialogue && (
                                                            <div>
                                                                <span className="text-gray-400 font-semibold">Dialogue:</span>
                                                                <p className="text-gray-300 mt-1 italic">"{panel.dialogue}"</p>
                                                            </div>
                                                        )}
                                                        {panel.focusCharacters && panel.focusCharacters.length > 0 && (
                                                            <div>
                                                                <span className="text-gray-400 font-semibold">Characters:</span>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {panel.focusCharacters.map((char, charIndex) => (
                                                                        <span key={charIndex} className="bg-green-600/50 px-2 py-1 rounded text-xs text-green-200">
                                                                            {char}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {panel.settingHint && (
                                                            <div>
                                                                <span className="text-gray-400 font-semibold">Setting:</span>
                                                                <p className="text-gray-300 mt-1">{panel.settingHint}</p>
                                                            </div>
                                                        )}
                                                        {panel.cameraAngle && (
                                                            <div>
                                                                <span className="text-gray-400 font-semibold">Camera:</span>
                                                                <p className="text-gray-300 mt-1">{panel.cameraAngle}</p>
                                                            </div>
                                                        )}
                                                        {panel.soundEffect && (
                                                            <div>
                                                                <span className="text-gray-400 font-semibold">Sound:</span>
                                                                <p className="text-orange-300 mt-1 font-bold">{panel.soundEffect}</p>
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
                    </div>
                )}

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

                    <div className="flex gap-2">
                        {/* Generate Pages Button */}
                        {(!chapter.pages || chapter.pages.length === 0) && (
                            <button
                                onClick={handleGeneratePages}
                                disabled={isGeneratingPages}
                                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGeneratingPages ? 'Generating Pages...' : 'Generate Pages'}
                            </button>
                        )}

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
        </div>
    );
}