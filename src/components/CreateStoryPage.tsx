'use client';

import { useState } from 'react';
import {
    randomStoryPreset,
    randomCharacterPreset,
    Influence,
    GenreTag,
    Gender,
    Species,
    CharacterRole,
    CharacterClass,
    Trait,
    Weakness,
    HairColor,
    EyeColor,
    BodyType,
    SkinTone,
    Tone,
    PreviousOccupations,
    Theme,
    ROLES
} from '@/types';
import {
    FormInput,
    FormSelect,
    FormTextarea,
    ToggleButtonGroup,
    FormSection,
    CheckboxField
} from '@/components/forms';

export default function CreateStoryPage() {
    // Story state
    const [storyData, setStoryData] = useState({
        title: '',
        influence: Influence.Original,
        newWorldType: '',
        genreTags: [] as GenreTag[],
        description: '',
        tone: undefined as Tone | undefined,
        themes: [] as Theme[],
        moralQuestion: '',
        totalPages: 100
    });

    // Character state
    const [characterData, setCharacterData] = useState({
        name: '',
        gender: Gender.Male,
        species: Species.Human,
        role: CharacterRole.Protagonist,
        characterOccupation: ROLES[0],
        previousOccupation: undefined as PreviousOccupations | undefined,
        personalityTraits: [] as Trait[],
        overpowered: false,
        age: undefined as number | undefined,
        class: undefined as CharacterClass | undefined,
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
            title: preset.title,
            influence: preset.influence,
            newWorldType: preset.newWorldType,
            genreTags: preset.genreTags,
            description: storyData.description,
            tone: preset.plot.tone,
            themes: preset.plot.themes || [],
            moralQuestion: '',
            totalPages: preset.totalPages
        });
    };

    const handleCharacterAutoFill = () => {
        const preset = randomCharacterPreset();
        setCharacterData({
            name: preset.name,
            gender: preset.gender,
            species: preset.species,
            role: preset.role,
            characterOccupation: preset.characterOccupation || '',
            personalityTraits: preset.personalityTraits,
            overpowered: preset.overpowered,
            age: preset.age,
            class: preset.class,
            hairColor: preset.appearance.hairColor,
            eyeColor: preset.appearance.eyeColor,
            height: characterData.height,
            build: preset.appearance.build,
            distinguishingFeatures: characterData.distinguishingFeatures,
            skinTone: preset.appearance.skinTone,
            backstory: characterData.backstory
        });
    };

    const handleClearAll = () => {
        setStoryData({
            title: '',
            influence: Influence.Original,
            newWorldType: '',
            genreTags: [],
            description: '',
            tone: undefined,
            themes: [],
            moralQuestion: '',
            totalPages: 100
        });

        setCharacterData({
            name: '',
            gender: Gender.Male,
            species: Species.Human,
            role: CharacterRole.Protagonist,
            characterOccupation: ROLES[0],
            previousOccupation: undefined,
            personalityTraits: [],
            overpowered: false,
            age: undefined,
            class: undefined,
            hairColor: undefined,
            eyeColor: undefined,
            height: '',
            build: undefined,
            distinguishingFeatures: '',
            skinTone: undefined,
            backstory: ''
        });
    };

    const handleSubmit = () => {
        console.log('Story Data:', storyData);
        console.log('Character Data:', characterData);
    };

    const toggleArrayItem = <T,>(array: T[], item: T, setter: (newArray: T[]) => void) => {
        if (array.includes(item)) {
            setter(array.filter(i => i !== item));
        } else {
            setter([...array, item]);
        }
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

                                <FormInput
                                    label="Total Pages"
                                    value={storyData.totalPages}
                                    onChange={(value) => setStoryData({ ...storyData, totalPages: parseInt(value) || 100 })}
                                    type="number"
                                    min={1}
                                    max={1000}
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

                        <FormInput
                            label="New World Type"
                            value={storyData.newWorldType}
                            onChange={(value) => setStoryData({ ...storyData, newWorldType: value })}
                            placeholder="e.g., Medieval Fantasy Kingdom..."
                            required
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

                                    <FormSelect
                                        label="Class"
                                        value={characterData.class || ''}
                                        onChange={(value) => setCharacterData({ ...characterData, class: value })}
                                        options={Object.values(CharacterClass)}
                                        placeholder="Select class..."
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
                            label="Previous Occupation"
                            value={characterData.previousOccupation}
                            onChange={(value) => setCharacterData({ ...characterData, previousOccupation: value! })}
                            options={Object.values(PreviousOccupations)}
                            required
                            className="focus:ring-cyan-500"
                        />

                        <FormSelect
                            label="Character Occupation"
                            value={characterData.characterOccupation}
                            onChange={(value) => setCharacterData({ ...characterData, characterOccupation: value! })}
                            options={ROLES}
                            required
                            className="focus:ring-cyan-500"
                            getDisplayText={(role) => role.charAt(0).toUpperCase() + role.slice(1)}
                        />

                        <ToggleButtonGroup
                            label="Personality Traits"
                            selectedItems={characterData.personalityTraits}
                            onToggle={(trait) => toggleArrayItem(characterData.personalityTraits, trait, (newTraits) => setCharacterData({ ...characterData, personalityTraits: newTraits }))}
                            options={Object.values(Trait)}
                            required
                            colorScheme="cyan"
                            helpText="Click to select/deselect traits"
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

                {/* Submit Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 text-lg"
                    >
                        Create Story
                    </button>
                </div>
            </div>
        </div>
    );
}