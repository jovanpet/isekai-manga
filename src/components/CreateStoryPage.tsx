'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CharacterRole } from '@/types';
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

        // Calculate totalArcs based on selected arcLength
        const totalArcs = calculateTotalArcs(storyData.arcLength);
        const storyDataWithArcs = { ...storyData, totalArcs };

        // Pass the story and character data through URL params or localStorage
        localStorage.setItem('tempStoryData', JSON.stringify(storyDataWithArcs));
        localStorage.setItem('tempCharacterData', JSON.stringify(characterData));

        router.push('/generate-storylines');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Create Your Isekai Story
                    </h1>
                    <button
                        onClick={handleClearAll}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 text-sm font-medium"
                    >
                        Clear All
                    </button>
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
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Create Story
                    </button>
                </div>
            </div>
        </div>
    );
}