import { runGemini } from '../geminiClient';
import { buildSeriesOutlinePrompt } from '../prompts/seriesOutlinePrompt';
import { StoryDetails } from '@/types/story_details';

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
        const prompt = buildSeriesOutlinePrompt(storyDetails, storyDetails.mainCharacter);
        const response = await runGemini(prompt);

        const cleanedResponse = response.replace(/```json\n?|```\n?/g, '').trim();
        const outlineData = JSON.parse(cleanedResponse) as SeriesOutlineResponse;

        return outlineData.arcs;
    } catch (error) {
        console.error('Error generating series outline:', error);
        throw new Error('Failed to generate series outline. Please try again.');
    }
}