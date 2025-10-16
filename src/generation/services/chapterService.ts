import { runGemini } from '../geminiClient';
import { buildChaptersPrompt } from '../prompts/chapterGenerationPrompt';
import { buildCharacterTypePrompt } from '../prompts/generateCharcters';
import { safeJsonParse } from '../utils/jsonParser';
import { Story } from '@/types/story/story';
import { Chapter } from '@/types/story/arc';
import { Character } from '@/types/character';
import { Gender, Species, CharacterRole } from '@/types/statics';
import { getUserApiKey } from '../../lib/userSettings';

export interface ChapterGenerationResponse {
    chapters: Chapter[];
    importantCharacters: {
        name: string;
        gender: 'male' | 'female' | 'other';
        species: 'human' | 'elf' | 'demon' | 'beastkin' | 'spirit' | 'god' | 'undead' | 'android' | 'fairy' | 'dragonkin';
        role: 'companion' | 'mentor' | 'rival' | 'villain' | 'support';
        appearanceHint: string;
    }[];
    characterUpdates: {
        name: string;
        statusChange: 'active' | 'inactive';
        roleChanges: string;
    }[];
}

export interface CharacterGenerationResult {
    newCharacters: Character[];
    updatedCharacters: Character[];
}

export async function generateChaptersForArc(story: Story, arcIndex: number): Promise<ChapterGenerationResponse> {
    try {
        const userApiKey = await getUserApiKey();
        if (!userApiKey) {
            throw new Error('Please add your Gemini API key in Settings before generating chapters.');
        }

        const prompt = buildChaptersPrompt(story, arcIndex);
        const response = await runGemini(prompt, userApiKey);

        // Parse the response using safe JSON parser
        const chapterData = safeJsonParse<ChapterGenerationResponse>(response, 'chapter generation');

        return chapterData;
    } catch (error) {
        console.error('Error generating chapters:', error);
        if (error instanceof Error && error.message.includes('API key')) {
            throw error;
        }
        throw new Error('Failed to generate chapters');
    }
}

export async function processCharacters(
    chapterResponse: ChapterGenerationResponse,
    existingCharacters: Character[],
    storyId: string
): Promise<CharacterGenerationResult> {
    const newCharacters: Character[] = [];
    const updatedCharacters: Character[] = [];

    // Process character updates first
    for (const update of chapterResponse.characterUpdates) {
        const existingChar = existingCharacters.find(char => char.name === update.name);
        if (existingChar) {
            const updatedChar: Character = {
                ...existingChar,
                status: update.statusChange,
                role: update.roleChanges as CharacterRole || existingChar.role,
                updatedAt: new Date()
            };
            updatedCharacters.push(updatedChar);
        }
    }

    // Process new characters
    for (const importantChar of chapterResponse.importantCharacters) {
        // Check if this character already exists
        const existingChar = existingCharacters.find(char => char.name === importantChar.name);
        if (!existingChar) {
            // Create basic character structure
            const basicCharacter: Partial<Character> = {
                id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                storyId,
                name: importantChar.name,
                gender: mapGender(importantChar.gender),
                species: mapSpecies(importantChar.species),
                role: mapRole(importantChar.role),
                status: 'active', // All new characters start as active
                personalityTraits: [], // Will be filled by character generation
                appearance: {
                    description: importantChar.appearanceHint
                },
                overpowered: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Generate detailed character data using buildCharacterTypePrompt
            try {
                const userApiKey = await getUserApiKey();
                if (!userApiKey) {
                    throw new Error('Please add your Gemini API key in Settings before generating series outline.');
                }
                const charGenPrompt = buildCharacterTypePrompt(basicCharacter as Character);
                const charResponse = await runGemini(charGenPrompt, userApiKey);
                // Parse as array since the prompt returns an array
                const charData = safeJsonParse<any>(charResponse, 'character generation');
                const generatedData = Array.isArray(charData) ? charData[0] : charData;

                // Merge generated data with basic character
                const fullCharacter: Character = {
                    ...basicCharacter,
                    appearance: {
                        ...basicCharacter.appearance,
                        ...generatedData.appearance
                    },
                    outfits: {
                        default: generatedData.outfit
                    },
                    currentOutfit: 'default'
                } as Character;

                newCharacters.push(fullCharacter);
            } catch (charError) {
                console.error('Error generating character details:', charError);
                // Fallback: add basic character without detailed generation
                newCharacters.push(basicCharacter as Character);
            }
        }
    }

    return { newCharacters, updatedCharacters };
}

// Helper functions to map string values to enum values
function mapGender(gender: string): Gender {
    switch (gender.toLowerCase()) {
        case 'male': return Gender.Male;
        case 'female': return Gender.Female;
        case 'other': return Gender.Other;
        default: return Gender.Male;
    }
}

function mapSpecies(species: string): Species {
    switch (species.toLowerCase()) {
        case 'human': return Species.Human;
        case 'elf': return Species.Elf;
        case 'demon': return Species.Demon;
        case 'beastkin': return Species.Beastkin;
        case 'spirit': return Species.Spirit;
        case 'god': return Species.God;
        case 'undead': return Species.Undead;
        case 'android': return Species.Android;
        case 'fairy': return Species.Fairy;
        case 'dragonkin': return Species.Dragonkin;
        default: return Species.Human;
    }
}

function mapRole(role: string): CharacterRole {
    switch (role.toLowerCase()) {
        case 'companion': return CharacterRole.Companion;
        case 'mentor': return CharacterRole.Mentor;
        case 'rival': return CharacterRole.Rival;
        case 'villain': return CharacterRole.Villain;
        case 'support': return CharacterRole.Support;
        default: return CharacterRole.Support;
    }
}

