import { runGemini } from '../geminiClient';
import { buildThreadSeedsPrompt } from '../prompts/threadSeedsPrompt';
import { Story } from '@/types/story/story';
import { Thread } from '@/types/story/thread';
import { Arc } from '@/types/story/arc';
import { Objective } from '@/types/story/objective';
import { getUserApiKey } from '../../lib/userSettings';

export interface PartialStoryForThreads {
    arcs: Arc[];
    objectives: Objective[];
}

export async function generateThreads(partialStory: PartialStoryForThreads): Promise<Thread[]> {
    try {
        const userApiKey = await getUserApiKey();
        if (!userApiKey) {
            throw new Error('Please add your Gemini API key in Settings before generating series outline.');
        }
        // Create a partial story object for the prompt
        const storyForPrompt = {
            arcs: partialStory.arcs,
            objectives: partialStory.objectives
        } as Story;

        const prompt = buildThreadSeedsPrompt(storyForPrompt);
        const response = await runGemini(prompt, userApiKey);

        // Clean up the response to extract JSON
        const cleanedResponse = response.replace(/```json\n?|```\n?/g, '').trim();

        // Parse the response as an array of threads
        const threads = JSON.parse(cleanedResponse) as Thread[];

        return threads;
    } catch (error) {
        console.error('Error generating threads:', error);
        throw new Error('Failed to generate threads');
    }
}