import { generateChaptersForArc, processCharacters } from './chapterService';
import { storyStore } from '@/store';
import { Story } from '@/types/story/story';
import { Character } from '@/types/character';

export interface CompleteStoryResult {
    storyId: string;
    updatedStory: Story;
    allCharacters: Character[];
}

export async function completeStoryWithChapters(storyId: string): Promise<CompleteStoryResult> {
    try {
        console.log('🚀 Starting completeStoryWithChapters for story:', storyId);

        // Get the story with all its data
        const storyWithDetails = await storyStore.getStoryWithDetails(storyId);
        if (!storyWithDetails) {
            throw new Error('Story not found');
        }

        console.log('📖 Story loaded:', {
            title: storyWithDetails.details.title,
            arcsCount: storyWithDetails.arcs.length,
            charactersCount: storyWithDetails.characters.length
        });

        const story = storyWithDetails;
        let allCharacters = [...story.characters];

        // Find the first arc that doesn't have chapters yet
        const arcIndex = story.arcs.findIndex(arc => !arc.chapters || arc.chapters.length === 0);

        if (arcIndex === -1) {
            console.log('✅ All arcs already have chapters generated');
            return {
                storyId,
                updatedStory: story,
                allCharacters
            };
        }

        const arc = story.arcs[arcIndex];
        console.log(`🎭 Processing arc ${arcIndex + 1}/${story.arcs.length}: ${arc.title}`);

        // Generate chapters and character data for this arc
        console.log('🤖 Generating chapters for arc...');
        const chapterResponse = await generateChaptersForArc(story, arcIndex);
        console.log('✅ Generated chapters:', {
            chaptersCount: chapterResponse.chapters.length,
            importantCharactersCount: chapterResponse.importantCharacters.length,
            characterUpdatesCount: chapterResponse.characterUpdates.length
        });

        // Log generated chapters structure
        chapterResponse.chapters.forEach((chapter, idx) => {
            console.log(`📑 Chapter ${idx + 1}: ${chapter.chapterTitle}`, {
                hasUndefined: Object.values(chapter).some(v => v === undefined),
                keys: Object.keys(chapter)
            });
        });

        // Process characters (new ones and updates)
        console.log('👥 Processing characters...');
        const characterResult = await processCharacters(
            chapterResponse,
            allCharacters,
            storyId
        );

        console.log('✅ Character processing result:', {
            newCharacters: characterResult.newCharacters.length,
            updatedCharacters: characterResult.updatedCharacters.length
        });

        // Log new characters for undefined values
        characterResult.newCharacters.forEach((char, idx) => {
            console.log(`👤 New character ${idx + 1}: ${char.name}`, {
                hasUndefined: Object.values(char).some(v => v === undefined),
                undefinedKeys: Object.entries(char).filter(([k, v]) => v === undefined).map(([k]) => k)
            });
        });

        // Update characters list
        allCharacters = [
            ...allCharacters,
            ...characterResult.newCharacters
        ];

        // Apply character updates
        for (const updatedChar of characterResult.updatedCharacters) {
            const index = allCharacters.findIndex(char => char.id === updatedChar.id);
            if (index !== -1) {
                allCharacters[index] = updatedChar;
            }
        }

        // Update the arc with generated chapters
        story.arcs[arcIndex] = {
            ...arc,
            chapters: chapterResponse.chapters
        };

        console.log(`✅ Arc ${arcIndex + 1} completed with ${chapterResponse.chapters.length} chapters`);

        // Deep clean data to remove ALL undefined values before Firestore update
        function removeUndefined(obj: any): any {
            if (obj === null || obj === undefined) {
                return null;
            }
            if (typeof obj !== 'object') {
                return obj;
            }
            if (Array.isArray(obj)) {
                return obj.map(removeUndefined).filter(item => item !== null && item !== undefined);
            }
            const cleaned: any = {};
            for (const [key, value] of Object.entries(obj)) {
                if (value !== undefined) {
                    cleaned[key] = removeUndefined(value);
                }
            }
            return cleaned;
        }

        console.log('🧹 Starting data cleaning...');

        // Check for undefined values before cleaning
        const hasUndefinedInArcs = JSON.stringify(story.arcs).includes('undefined');
        const hasUndefinedInCharacters = JSON.stringify(allCharacters).includes('undefined');

        console.log('❓ Pre-cleaning undefined check:', {
            arcsHaveUndefined: hasUndefinedInArcs,
            charactersHaveUndefined: hasUndefinedInCharacters
        });

        const cleanedArcs = removeUndefined(story.arcs);
        const cleanedCharacters = removeUndefined(allCharacters);

        console.log('✨ Data cleaning completed');
        console.log('📊 Cleaned data summary:', {
            arcsCount: cleanedArcs.length,
            charactersCount: cleanedCharacters.length,
            firstArcChaptersCount: cleanedArcs[0]?.chapters?.length || 0
        });

        // Final check for undefined values
        const finalArcsString = JSON.stringify(cleanedArcs);
        const finalCharactersString = JSON.stringify(cleanedCharacters);

        console.log('🔍 Final undefined check:', {
            arcsHaveUndefined: finalArcsString.includes('undefined'),
            charactersHaveUndefined: finalCharactersString.includes('undefined'),
            dataPreview: {
                arcsSize: finalArcsString.length,
                charactersSize: finalCharactersString.length
            }
        });

        console.log('💾 Attempting Firestore update...');

        // Update the story with all chapters and characters
        await storyStore.updateStory(storyId, {
            arcs: cleanedArcs,
            characters: cleanedCharacters
        });

        console.log('✅ Firestore update successful!');

        return {
            storyId,
            updatedStory: story,
            allCharacters
        };
    } catch (error) {
        console.error('Error completing story with chapters:', error);
        throw new Error('Failed to complete story with chapters');
    }
}