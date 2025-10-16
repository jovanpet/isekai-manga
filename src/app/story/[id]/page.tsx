'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { storyStore } from '@/store';
import { completeStoryWithChapters } from '@/generation/services/storyCompletionService';
import { Story } from '@/types/story/story';
import { StoryDetails } from '@/types/story_details';
import ProtectedRoute from '@/components/ProtectedRoute';
import { generateStoryPDF } from '@/pdf_generation/pdf_story_service';

function StoryDisplayContent() {
    const [story, setStory] = useState<Story & { details: StoryDetails } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingChapters, setIsGeneratingChapters] = useState(false);
    const [activeSection, setActiveSection] = useState<'story' | 'characters' | 'objectives' | 'threads' | 'arcs'>('story');
    const [arcsMenuOpen, setArcsMenuOpen] = useState(true);
    const router = useRouter();
    const params = useParams();
    const storyId = params.id as string;

    const getThreadArcIntroduced = (thread: any) => {
        return thread.arcIntroduced || (Array.isArray(thread.arcsIntroduced) ? thread.arcsIntroduced[0] : thread.arcsIntroduced) || 'Unknown';
    };

    const getThreadArcsResolved = (thread: any) => {
        return thread.arcsResolved || (Array.isArray(thread.arcsResolved) ? thread.arcsResolved[0] : thread.arcsResolved) || 'Unknown';
    };

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
            await completeStoryWithChapters(storyId);
            const updatedStoryWithDetails = await storyStore.getStoryWithDetails(storyId);
            setStory(updatedStoryWithDetails);
        } catch (error) {
            console.error('Error generating chapters:', error);
            setError('Failed to generate chapters. Please try again.');
        } finally {
            setIsGeneratingChapters(false);
        }
    };

    const handleExportPDF = () => {
        if (!story) return;
        try {
            generateStoryPDF(story, {
                includeObjectives: true,
                includeThreads: true,
                includeCharacters: true,
                includeChapters: true
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            setError('Failed to export PDF. Please try again.');
        }
    };

    const hasMoreArcsToGenerate = story?.arcs.some(arc => !arc.chapters || arc.chapters.length === 0) || false;
    const nextArcToGenerate = story?.arcs.findIndex(arc => !arc.chapters || arc.chapters.length === 0);
    const nextArcNumber = nextArcToGenerate !== undefined && nextArcToGenerate !== -1 ? nextArcToGenerate + 1 : null;

    const scrollToSection = (section: 'story' | 'characters' | 'objectives' | 'threads' | 'arcs') => {
        setActiveSection(section);
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your story...</p>
                </div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
                    <p className="text-red-800 dark:text-red-300 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919]">
            {/* Side Navigation */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-[#f7f7f5] dark:bg-[#252525] border-r border-gray-200 dark:border-gray-800 p-6 overflow-y-auto z-10">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm mb-6"
                    >
                        <span>←</span>
                        <span>Back to Home</span>
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {story.details.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Isekai Story</p>
                </div>

                <nav className="space-y-1">
                    <button
                        onClick={() => scrollToSection('story')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeSection === 'story'
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        📖 Story Details
                    </button>
                    <button
                        onClick={() => scrollToSection('characters')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeSection === 'characters'
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        👥 Characters
                    </button>
                    <button
                        onClick={() => scrollToSection('objectives')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeSection === 'objectives'
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        🎯 Objectives
                    </button>
                    <button
                        onClick={() => scrollToSection('threads')}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeSection === 'threads'
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        🧵 Story Threads
                    </button>

                    {/* Story Arcs with Submenu */}
                    <div>
                        <button
                            onClick={() => {
                                setArcsMenuOpen(!arcsMenuOpen);
                                scrollToSection('arcs');
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                                activeSection === 'arcs'
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <span>📚 Story Arcs</span>
                            <span className={`transition-transform ${arcsMenuOpen ? 'rotate-90' : ''}`}>›</span>
                        </button>

                        {arcsMenuOpen && (
                            <div className="ml-4 mt-1 space-y-1">
                                {story.arcs.map((arc, index) => (
                                    <button
                                        key={arc.id}
                                        onClick={() => {
                                            const element = document.getElementById(`arc-${index}`);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }
                                        }}
                                        className="w-full text-left px-3 py-1.5 rounded-md text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-gray-400">Arc {arc.order}</span>
                                        <span className="truncate">{arc.title}</span>
                                        {arc.chapters && arc.chapters.length > 0 && (
                                            <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                                                {arc.chapters.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                <div className="mt-8 space-y-2">
                    {hasMoreArcsToGenerate && (
                        <button
                            onClick={handleGenerateChapters}
                            disabled={isGeneratingChapters}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingChapters
                                ? `Generating Arc ${nextArcNumber}...`
                                : `Generate Arc ${nextArcNumber}`
                            }
                        </button>
                    )}

                    {!hasMoreArcsToGenerate && (
                        <div className="w-full px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-medium rounded-md text-center">
                            ✓ All Arcs Complete
                        </div>
                    )}

                    <button
                        onClick={handleExportPDF}
                        className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                        <span>📄</span>
                        <span>Export as PDF</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div>
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {story.details.title}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {story.details.summary}
                        </p>
                    </div>

                    {/* Story Details Section */}
                    <section id="story" className="scroll-mt-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">📖 Story Details</h2>

                        <div className="space-y-6">
                            {/* Main Character */}
                            <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Main Character</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                        <p className="text-gray-900 dark:text-gray-100">{story.details.mainCharacter.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                                        <p className="text-gray-900 dark:text-gray-100">{story.details.mainCharacter.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Species</p>
                                        <p className="text-gray-900 dark:text-gray-100">{story.details.mainCharacter.species}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Rebirth Type</p>
                                        <p className="text-gray-900 dark:text-gray-100">{story.details.mainCharacter.rebirthType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Previous Job</p>
                                        <p className="text-gray-900 dark:text-gray-100">{story.details.mainCharacter.previousOccupation}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">New Role</p>
                                        <p className="text-gray-900 dark:text-gray-100">{story.details.mainCharacter.characterOccupation}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Overpowered:</span>
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        story.details.mainCharacter.overpowered
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}>
                                        {story.details.mainCharacter.overpowered ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>

                            {/* Story Info */}
                            <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Story Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
                                        <p className="text-gray-900 dark:text-gray-100">{story.details.description}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Influence</p>
                                            <p className="text-gray-900 dark:text-gray-100">{story.details.influence}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Arcs</p>
                                            <p className="text-gray-900 dark:text-gray-100">{story.details.totalArcs}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">World Type</p>
                                            <p className="text-gray-900 dark:text-gray-100">{story.details.newWorldType}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Genre Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {story.details.genreTags.map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Characters Section */}
                    <section id="characters" className="scroll-mt-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">👥 Characters</h2>
                        <div className="space-y-4">
                            {story.characters && story.characters.length > 0 ? (
                                story.characters.map((character, index) => (
                                    <div key={character.id || index} className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{character.name}</h3>
                                            <div className="flex gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    character.role === 'protagonist'
                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                        : character.role === 'companion'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                        : character.role === 'mentor'
                                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                        : character.role === 'rival'
                                                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                                                        : character.role === 'villain'
                                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {character.role}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    character.status === 'active'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {character.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                                                <p className="text-gray-900 dark:text-gray-100">{character.gender}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Species</p>
                                                <p className="text-gray-900 dark:text-gray-100">{character.species}</p>
                                            </div>
                                            {character.characterOccupation && (
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Occupation</p>
                                                    <p className="text-gray-900 dark:text-gray-100">{character.characterOccupation}</p>
                                                </div>
                                            )}
                                            {character.age && (
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                                                    <p className="text-gray-900 dark:text-gray-100">{character.age}</p>
                                                </div>
                                            )}
                                        </div>

                                        {character.appearance?.description && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Appearance</p>
                                                <p className="text-gray-900 dark:text-gray-100">{character.appearance.description}</p>
                                            </div>
                                        )}

                                        {character.personalityTraits && character.personalityTraits.length > 0 && (
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Personality Traits</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {character.personalityTraits.map((trait, traitIndex) => (
                                                        <span key={traitIndex} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-sm">
                                                            {trait}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {character.overpowered && (
                                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-sm font-medium">
                                                ⚡ Overpowered
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">No additional characters yet. Characters will be added as the story progresses.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Objectives Section */}
                    <section id="objectives" className="scroll-mt-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">🎯 Story Objectives</h2>
                        <div className="space-y-4">
                            {story.objectives.map((objective, index) => (
                                <div key={index} className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{objective.title}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            objective.type === 'main'
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}>
                                            {objective.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">{objective.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {objective.relatedArcs.map((arcTitle, arcIndex) => (
                                            <span key={arcIndex} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                                                {arcTitle}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Story Threads Section */}
                    <section id="threads" className="scroll-mt-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">🧵 Story Threads</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Major Threads</h3>
                                <div className="space-y-4">
                                    {story.threads.filter(thread => thread.importance === 'major').map((thread, index) => (
                                        <div key={index} className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{thread.title}</h4>
                                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                                                    {thread.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-3">{thread.summary}</p>
                                            <div className="flex gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Introduced: </span>
                                                    <span className="text-gray-900 dark:text-gray-100">{getThreadArcIntroduced(thread)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Resolved: </span>
                                                    <span className="text-gray-900 dark:text-gray-100">{getThreadArcsResolved(thread)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Minor Threads</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {story.threads.filter(thread => thread.importance === 'minor').map((thread, index) => (
                                        <div key={index} className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{thread.title}</h4>
                                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                                                    {thread.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{thread.summary}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Story Arcs Section */}
                    <section id="arcs" className="scroll-mt-8 pb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">📚 Story Arcs</h2>
                        <div className="space-y-6">
                            {story.arcs.map((arc, index) => (
                                <div key={arc.id} id={`arc-${index}`} className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6 scroll-mt-8">
                                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Arc {arc.order}: {arc.title}
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Theme</p>
                                            <p className="text-gray-900 dark:text-gray-100">{arc.theme}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Goal</p>
                                            <p className="text-gray-900 dark:text-gray-100">{arc.goal}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Key Twist</p>
                                            <p className="text-gray-900 dark:text-gray-100">{arc.keyTwist}</p>
                                        </div>
                                    </div>

                                    {arc.chapters && arc.chapters.length > 0 && (
                                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Chapters ({arc.chapters.length})
                                            </h4>
                                            <div className="space-y-3">
                                                {arc.chapters.map((chapter, chapterIndex) => (
                                                    <div
                                                        key={chapterIndex}
                                                        onClick={() => router.push(`/story/${storyId}/chapter/${index}/${chapterIndex}`)}
                                                        className="p-4 bg-gray-50 dark:bg-[#1e1e1e] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors border border-gray-200 dark:border-gray-800"
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                Chapter {chapterIndex + 1}: {chapter.chapterTitle}
                                                            </h5>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                chapter.outcomeType === 'victory' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                                chapter.outcomeType === 'progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                                                chapter.outcomeType === 'setback' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                                                'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                            }`}>
                                                                {chapter.sceneType}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{chapter.summary}</p>
                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div>
                                                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Challenge</p>
                                                                <p className="text-gray-900 dark:text-gray-100">{chapter.challenge}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Resolution</p>
                                                                <p className="text-gray-900 dark:text-gray-100">{chapter.resolution}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default function StoryDisplayPage() {
    return (
        <ProtectedRoute>
            <StoryDisplayContent />
        </ProtectedRoute>
    );
}
