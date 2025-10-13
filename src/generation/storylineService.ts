import { runGemini } from './geminiClient';
import { buildStorylinePrompt } from './prompts/storylinePrompts';

export interface StorylineOption {
    title: string;
    hook: string;
    short_summary: string;
    detailed_description: string;
    goal: string;
}

export async function generateStorylines(storyData: any, characterData: any): Promise<StorylineOption[]> {
    try {
        const prompt = buildStorylinePrompt(storyData, characterData);
        const response = await runGemini(prompt);

        const cleanedResponse = response.replace(/```json\n?|```\n?/g, '').trim();
        const storylines = JSON.parse(cleanedResponse) as StorylineOption[];

        return storylines;
    } catch (error) {
        console.error('Error generating storylines:', error);
        throw new Error('Failed to generate storylines. Please try again.');
    }
}