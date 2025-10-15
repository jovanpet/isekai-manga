import { runGemini } from '../geminiClient';
import { buildSeriesOutlinePrompt } from '../prompts/seriesOutlinePrompt';
import { safeJsonParse } from '../utils/jsonParser';
import { StoryDetails } from '@/types/story_details';
import { getUserApiKey } from '../../lib/userSettings';

export interface ArcOutline {
    title: string;
    theme: string;
    goal: string;
    keyTwist: string;
    tone: string;
    endingHint: string;
}

export interface SeriesOutlineResponse {
    arcs: ArcOutline[];
}

export async function generateSeriesOutline(storyDetails: StoryDetails): Promise<ArcOutline[]> {
    try {
        const userApiKey = await getUserApiKey();
        if (!userApiKey) {
            throw new Error('Please add your Gemini API key in Settings before generating series outline.');
        }

        const prompt = buildSeriesOutlinePrompt(storyDetails, storyDetails.mainCharacter);
        const response = await runGemini(prompt, userApiKey);

        const outlineData = safeJsonParse<SeriesOutlineResponse>(response, 'series outline generation');
        return outlineData.arcs;
    } catch (error) {
        console.error('Error generating series outline:', error);
        if (error instanceof Error && error.message.includes('API key')) {
            throw error;
        }
        throw new Error('Failed to generate series outline. Please try again.');
    }
}