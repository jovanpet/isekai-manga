'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storyStore } from '@/store';
import { Story } from '@/types/story/story';
import { StoryDetails } from '@/types/story_details';
import { CharacterRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import {
    randomStoryPreset,
    randomCharacterPreset,
    Influence,
    GenreTag,
    Gender,
    Species,
    Trait,
    HairColor,
    EyeColor,
    BodyType,
    SkinTone,
    Tone,
    Theme,
    ArcLength,
    ROLES,
    WORLDS,
    REBIRTH_TYPES
} from '@/types';
import { PreviousOccupations } from '@/types/statics';
import {
    FormInput,
    FormSelect,
    FormTextarea,
    ToggleButtonGroup,
    FormSection,
    CheckboxField
} from '@/components/forms';

export default function CreateStoryPage() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [existingStories, setExistingStories] = useState<(Story & { details: StoryDetails })[]>([]);
    const [isLoadingStories, setIsLoadingStories] = useState(true);

    // Load existing stories
    useEffect(() => {
        const loadStories = async () => {
            if (!user) {
                setIsLoadingStories(false);
                return;
            }

            try {
                const stories = await storyStore.getStoriesWithDetailsByUser(user.uid);
                setExistingStories(stories);
            } catch (error) {
                console.error('Error loading stories:', error);
            } finally {
                setIsLoadingStories(false);
            }
        };
        loadStories();
    }, [user]);

    // Story state
    const [storyData, setStoryData] = useState({
        title: '',
        influence: Influence.Original,
        newWorldType: WORLDS[0],
        originWorld: WORLDS[1],
        genreTags: [] as GenreTag[],
        description: '',
        tone: undefined as Tone | undefined,
        themes: [] as Theme[],
        moralQuestion: '',
        arcLength: ArcLength.Medium
    });

    // Character state
    const [characterData, setCharacterData] = useState({
        name: '',
        gender: Gender.Male,
        species: Species.Human,
        role: CharacterRole.Protagonist,
        status: 'active',
        characterOccupation: ROLES[0],
        previousOccupation: PreviousOccupations.HighSchoolStudent,
        rebirthType: REBIRTH_TYPES[0],
        personalityTraits: [] as Trait[],
        overpowered: false,
        age: undefined as number | undefined,
        hairColor: undefined as HairColor | undefined,
        eyeColor: undefined as EyeColor | undefined,
        height: '',
        build: undefined as BodyType | undefined,
        distinguishingFeatures: '',
        skinTone: undefined as SkinTone | undefined,
        backstory: ''
    });


    const handleStoryAutoFill = () => {
        const preset = randomStoryPreset();
        setStoryData({
            ...storyData,
            influence: preset.influence,
            newWorldType: preset.newWorldType as any,
            genreTags: preset.genreTags
        });
    };

    const handleCharacterAutoFill = () => {
        const preset = randomCharacterPreset();
        setCharacterData({
            ...characterData,
            name: preset.name,
            gender: preset.gender,
            species: preset.species,
            rebirthType: preset.rebirthType as any
        });
    };

    const handleClearAll = () => {
        setStoryData({
            title: '',
            influence: Influence.Original,
            newWorldType: WORLDS[0],
            originWorld: WORLDS[1],
            genreTags: [],
            description: '',
            tone: undefined,
            themes: [],
            moralQuestion: '',
            arcLength: ArcLength.Medium
        });

        setCharacterData({
            name: '',
            gender: Gender.Male,
            species: Species.Human,
            role: CharacterRole.Protagonist,
            status: 'active',
            characterOccupation: ROLES[0],
            previousOccupation: PreviousOccupations.HighSchoolStudent,
            rebirthType: REBIRTH_TYPES[0],
            personalityTraits: [],
            overpowered: false,
            age: undefined,
            hairColor: undefined,
            eyeColor: undefined,
            height: '',
            build: undefined,
            distinguishingFeatures: '',
            skinTone: undefined,
            backstory: ''
        });
    };

    const toggleArrayItem = <T,>(array: T[], item: T, setter: (newArray: T[]) => void) => {
        if (array.includes(item)) {
            setter(array.filter(i => i !== item));
        } else {
            setter([...array, item]);
        }
    };

    const calculateTotalArcs = (arcLength: ArcLength): number => {
        switch (arcLength) {
            case ArcLength.Short:
                return Math.floor(Math.random() * (5 - 3 + 1)) + 3; // 3-5
            case ArcLength.Medium:
                return Math.floor(Math.random() * (12 - 6 + 1)) + 6; // 6-12
            case ArcLength.Epic:
                return Math.floor(Math.random() * (24 - 13 + 1)) + 13; // 13-24
            case ArcLength.SurpriseMe:
                return Math.floor(Math.random() * 25) + 1; // 1-25
            default:
                return 8; // fallback to medium range
        }
    };

    // Check if all required fields are filled
    const isFormValid = () => {
        const storyValid = storyData.newWorldType && storyData.genreTags.length > 0 && storyData.influence && storyData.originWorld;
        const characterValid = characterData.name && characterData.species && characterData.rebirthType && characterData.previousOccupation && characterData.characterOccupation;
        return storyValid && characterValid;
    };

    const handleGenerateStorylines = () => {
        if (!isFormValid()) {
            alert('Please fill in all required fields before generating storylines');
            return;
        }

        if (!user) {
            alert('You must be signed in to create a story');
            return;
        }

        // Calculate totalArcs based on selected arcLength
        const totalArcs = calculateTotalArcs(storyData.arcLength);
        const storyDataWithArcs = {
            ...storyData,
            totalArcs,
            mainCharacter: characterData,
            userId: user.uid
        };

        // Pass the story data with embedded character through localStorage
        localStorage.setItem('tempStoryData', JSON.stringify(storyDataWithArcs));

        router.push('/generate-storylines');
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/auth/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919]">
            <div className="max-w-7xl mx-auto p-12">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Create Your Isekai Story
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Build your next adventure with AI
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {user && (
                            <>
                                <button
                                    onClick={() => router.push('/settings')}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                                >
                                    ⚙️ Settings
                                </button>
                                <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {user.email}
                                    </span>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </>
                        )}
                        <button
                            onClick={handleClearAll}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Story Section */}
                    <FormSection
                        title="Story"
                        onAutoFill={handleStoryAutoFill}
                        autoFillColorScheme="purple"
                        collapsibleTitle="Optional Fields"
                        collapsibleContent={
                            <>
                                <FormTextarea
                                    label="Description"
                                    value={storyData.description}
                                    onChange={(value) => setStoryData({ ...storyData, description: value })}
                                    placeholder="Describe your story..."
                                    rows={4}
                                />

                                <FormSelect
                                    label="Tone"
                                    value={storyData.tone || ''}
                                    onChange={(value) => setStoryData({ ...storyData, tone: value })}
                                    options={Object.values(Tone)}
                                    placeholder="Select tone..."
                                />

                                <ToggleButtonGroup
                                    label="Themes"
                                    selectedItems={storyData.themes}
                                    onToggle={(theme) => toggleArrayItem(storyData.themes, theme, (newThemes) => setStoryData({ ...storyData, themes: newThemes }))}
                                    options={Object.values(Theme)}
                                    colorScheme="indigo"
                                    helpText="Click to select/deselect themes"
                                />

                                <FormInput
                                    label="Moral Question"
                                    value={storyData.moralQuestion}
                                    onChange={(value) => setStoryData({ ...storyData, moralQuestion: value })}
                                    placeholder="What deeper question does this story explore?"
                                />

                            </>
                        }
                    >
                        <FormSelect
                            label="Influence"
                            value={storyData.influence}
                            onChange={(value) => setStoryData({ ...storyData, influence: value! })}
                            options={Object.values(Influence)}
                            required
                        />

                        <FormSelect
                            label="New World Type"
                            value={storyData.newWorldType}
                            onChange={(value) => setStoryData({ ...storyData, newWorldType: value! })}
                            options={[...WORLDS] as any}
                            required
                            getDisplayText={(world) => world.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        />

                        <FormSelect
                            label="Origin World"
                            value={storyData.originWorld}
                            onChange={(value) => setStoryData({ ...storyData, originWorld: value! })}
                            options={[...WORLDS] as any}
                            required
                            getDisplayText={(world) => world.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        />

                        <ToggleButtonGroup
                            label="Genre Tags"
                            selectedItems={storyData.genreTags}
                            onToggle={(tag) => toggleArrayItem(storyData.genreTags, tag, (newTags) => setStoryData({ ...storyData, genreTags: newTags }))}
                            options={Object.values(GenreTag)}
                            required
                            colorScheme="purple"
                            helpText="Click to select/deselect tags"
                        />

                        <FormSelect
                            label="Arc Length"
                            value={storyData.arcLength}
                            onChange={(value) => setStoryData({ ...storyData, arcLength: value! })}
                            options={Object.values(ArcLength)}
                            required
                        />
                    </FormSection>

                    {/* Character Section */}
                    <FormSection
                        title="Main Character"
                        onAutoFill={handleCharacterAutoFill}
                        autoFillText="Auto-Fill Required"
                        autoFillColorScheme="cyan"
                        collapsibleTitle="Optional Fields"
                        collapsibleContent={
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Age"
                                        value={characterData.age || ''}
                                        onChange={(value) => setCharacterData({ ...characterData, age: parseInt(value) || undefined })}
                                        type="number"
                                        placeholder="Age"
                                        min={1}
                                        max={1000}
                                        className="focus:ring-cyan-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormSelect
                                        label="Hair Color"
                                        value={characterData.hairColor || ''}
                                        onChange={(value) => setCharacterData({ ...characterData, hairColor: value })}
                                        options={Object.values(HairColor)}
                                        className="focus:ring-cyan-500"
                                    />

                                    <FormSelect
                                        label="Eye Color"
                                        value={characterData.eyeColor || ''}
                                        onChange={(value) => setCharacterData({ ...characterData, eyeColor: value })}
                                        options={Object.values(EyeColor)}
                                        className="focus:ring-cyan-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Height"
                                        value={characterData.height}
                                        onChange={(value) => setCharacterData({ ...characterData, height: value })}
                                        placeholder="e.g., 5 feet 8 inches"
                                        className="focus:ring-cyan-500"
                                    />

                                    <FormSelect
                                        label="Build"
                                        value={characterData.build || ''}
                                        onChange={(value) => setCharacterData({ ...characterData, build: value })}
                                        options={Object.values(BodyType)}
                                        className="focus:ring-cyan-500"
                                    />
                                </div>

                                <FormSelect
                                    label="Skin Tone"
                                    value={characterData.skinTone || ''}
                                    onChange={(value) => setCharacterData({ ...characterData, skinTone: value })}
                                    options={Object.values(SkinTone)}
                                    className="focus:ring-cyan-500"
                                />

                                <FormInput
                                    label="Distinguishing Features"
                                    value={characterData.distinguishingFeatures}
                                    onChange={(value) => setCharacterData({ ...characterData, distinguishingFeatures: value })}
                                    placeholder="Scars, tattoos, unique features..."
                                    className="focus:ring-cyan-500"
                                />

                                <FormTextarea
                                    label="Backstory"
                                    value={characterData.backstory}
                                    onChange={(value) => setCharacterData({ ...characterData, backstory: value })}
                                    placeholder="Character's background and history..."
                                    rows={4}
                                    className="focus:ring-cyan-500"
                                />

                                <ToggleButtonGroup
                                    label="Personality Traits"
                                    selectedItems={characterData.personalityTraits}
                                    onToggle={(trait) => toggleArrayItem(characterData.personalityTraits, trait, (newTraits) => setCharacterData({ ...characterData, personalityTraits: newTraits }))}
                                    options={Object.values(Trait)}
                                    colorScheme="cyan"
                                    helpText="Click to select/deselect traits"
                                />
                            </>
                        }
                    >
                        <FormInput
                            label="Name"
                            value={characterData.name}
                            onChange={(value) => setCharacterData({ ...characterData, name: value })}
                            placeholder="Enter character name..."
                            required
                            className="focus:ring-cyan-500"
                        />

                        <FormSelect
                            label="Gender"
                            value={characterData.gender}
                            onChange={(value) => setCharacterData({ ...characterData, gender: value! })}
                            options={Object.values(Gender)}
                            required
                            className="focus:ring-cyan-500"
                        />

                        <FormSelect
                            label="Species"
                            value={characterData.species}
                            onChange={(value) => setCharacterData({ ...characterData, species: value! })}
                            options={Object.values(Species)}
                            required
                            className="focus:ring-cyan-500"
                        />

                        <FormSelect
                            label="Rebirth Type"
                            value={characterData.rebirthType}
                            onChange={(value) => setCharacterData({ ...characterData, rebirthType: value! })}
                            options={[...REBIRTH_TYPES] as any}
                            required
                            className="focus:ring-cyan-500"
                            getDisplayText={(type) => type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        />

                        <FormSelect
                            label="Previous Occupation"
                            value={characterData.previousOccupation}
                            onChange={(value) => setCharacterData({ ...characterData, previousOccupation: value as PreviousOccupations })}
                            options={Object.values(PreviousOccupations)}
                            required
                            className="focus:ring-cyan-500"
                        />

                        <FormSelect
                            label="Character Occupation"
                            value={characterData.characterOccupation}
                            onChange={(value) => setCharacterData({ ...characterData, characterOccupation: value! })}
                            options={[...ROLES] as any}
                            required
                            className="focus:ring-cyan-500"
                            getDisplayText={(role) => role.charAt(0).toUpperCase() + role.slice(1)}
                        />

                        <CheckboxField
                            label="Overpowered Character"
                            checked={characterData.overpowered}
                            onChange={(checked) => setCharacterData({ ...characterData, overpowered: checked })}
                            id="characterOverpowered"
                            colorScheme="cyan"
                        />
                    </FormSection>
                </div>

                {/* Action Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleGenerateStorylines}
                        disabled={!isFormValid()}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Story
                    </button>
                </div>

                {/* Existing Stories Section */}
                {existingStories.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                            Your Stories
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {existingStories.map((story) => (
                                <div
                                    key={story.id}
                                    onClick={() => router.push(`/story/${story.id}`)}
                                    className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer transition-all group"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {story.details.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                        {story.details.summary}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {story.details.genreTags.slice(0, 2).map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                            {story.details.genreTags.length > 2 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                                                    +{story.details.genreTags.length - 2}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {story.arcs.length} arcs
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 dark:bg-blue-500 transition-all"
                                                style={{
                                                    width: `${(story.arcs.filter(arc => arc.chapters && arc.chapters.length > 0).length / story.arcs.length) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {story.arcs.filter(arc => arc.chapters && arc.chapters.length > 0).length}/{story.arcs.length}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isLoadingStories && (
                    <div className="mt-16 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your stories...</p>
                    </div>
                )}
            </div>
        </div>
    );
}