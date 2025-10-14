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
        // Get the story with all its data
        const storyWithDetails = await storyStore.getStoryWithDetails(storyId);
        if (!storyWithDetails) {
            throw new Error('Story not found');
        }

        const story = storyWithDetails;
        let allCharacters = [...story.characters];

        // Generate chapters for each arc
        for (let arcIndex = 0; arcIndex < story.arcs.length; arcIndex++) {
            const arc = story.arcs[arcIndex];

            // Generate chapters and character data for this arc
            const chapterResponse = await generateChaptersForArc(story, arcIndex);

            // Process characters (new ones and updates)
            const characterResult = await processCharacters(
                chapterResponse,
                allCharacters,
                storyId
            );

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
        }

        // Update the story with all chapters and characters
        await storyStore.updateStory(storyId, {
            arcs: story.arcs,
            characters: allCharacters
        });

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