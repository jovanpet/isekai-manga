import { runGemini } from '../geminiClient';
import { buildObjectivesPrompt } from '../prompts/objectivesPrompt';
import { Arc } from '@/types/story/arc';
import { Objective } from '@/types/story/objective';

export async function generateObjectives(arcs: Arc[]): Promise<Objective[]> {
    try {
        const prompt = buildObjectivesPrompt(arcs);
        const response = await runGemini(prompt);

        // Clean up the response to extract JSON
        const cleanedResponse = response.replace(/```json\n?|```\n?/g, '').trim();

        // Parse the response as an array of objectives
        const objectives = JSON.parse(cleanedResponse) as Objective[];

        return objectives;
    } catch (error) {
        console.error('Error generating objectives:', error);
        throw new Error('Failed to generate objectives');
    }
}