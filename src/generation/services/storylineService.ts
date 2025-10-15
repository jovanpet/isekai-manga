import { runGemini } from '../geminiClient';
import { buildStorylinePrompt } from '../prompts/storylinePrompts';
import { getUserApiKey } from '../../lib/userSettings';

export interface StorylineOption {
    title: string;
    hook: string;
    short_summary: string;
    detailed_description: string;
    goal: string;
}

export async function generateStorylines(storyData: any): Promise<StorylineOption[]> {
    try {
        const userApiKey = await getUserApiKey();
        if (!userApiKey) {
            throw new Error('Please add your Gemini API key in Settings before generating storylines.');
        }

        const prompt = buildStorylinePrompt(storyData);
        const response = await runGemini(prompt, userApiKey);

        const cleanedResponse = response.replace(/```json\n?|```\n?/g, '').trim();
        const storylines = JSON.parse(cleanedResponse) as StorylineOption[];

        return storylines;
    } catch (error) {
        console.error('Error generating storylines:', error);
        if (error instanceof Error && error.message.includes('API key')) {
            throw error;
        }
        throw new Error('Failed to generate storylines. Please try again.');
    }
}