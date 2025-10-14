import { NextRequest, NextResponse } from 'next/server';
import { runGemini } from '@/generation/geminiClient';
import { buildStorylinePrompt } from '@/generation/prompts/storylinePrompts';

export async function POST(request: NextRequest) {
    try {
        const { storyData, characterData } = await request.json();

        if (!storyData || !characterData) {
            return NextResponse.json(
                { error: 'Missing story or character data' },
                { status: 400 }
            );
        }

        const prompt = buildStorylinePrompt(storyData);
        const response = await runGemini(prompt);

        // Parse JSON response
        const cleanedResponse = response.replace(/```json\n?|```\n?/g, '').trim();
        const storylines = JSON.parse(cleanedResponse);

        return NextResponse.json(storylines);
    } catch (error) {
        console.error('Error generating storylines:', error);
        return NextResponse.json(
            { error: 'Failed to generate storylines' },
            { status: 500 }
        );
    }
}