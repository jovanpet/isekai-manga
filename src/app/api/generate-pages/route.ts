import { NextRequest, NextResponse } from 'next/server';
import { addPagesToChapter } from '@/generation/services/chapterService';
import { storyStore } from '@/store';

export async function POST(request: NextRequest) {
    try {
        const { storyId, arcIndex, chapterIndex } = await request.json();

        if (!storyId || arcIndex === undefined || chapterIndex === undefined) {
            return NextResponse.json(
                { error: 'Missing storyId, arcIndex, or chapterIndex' },
                { status: 400 }
            );
        }

        // Get the story with details
        const storyWithDetails = await storyStore.getStoryWithDetails(storyId);
        if (!storyWithDetails) {
            return NextResponse.json(
                { error: 'Story not found' },
                { status: 404 }
            );
        }

        // Get the specific chapter
        const arc = storyWithDetails.arcs[arcIndex];
        if (!arc) {
            return NextResponse.json(
                { error: 'Arc not found' },
                { status: 404 }
            );
        }

        const chapter = arc.chapters[chapterIndex];
        if (!chapter) {
            return NextResponse.json(
                { error: 'Chapter not found' },
                { status: 404 }
            );
        }

        // Generate pages for the chapter
        const chapterWithPages = await addPagesToChapter(chapter, storyWithDetails);

        // Update the chapter in the story
        const updatedArcs = [...storyWithDetails.arcs];
        updatedArcs[arcIndex] = {
            ...arc,
            chapters: arc.chapters.map((ch, idx) =>
                idx === chapterIndex ? chapterWithPages : ch
            )
        };

        // Save the updated story
        await storyStore.updateStory(storyId, { arcs: updatedArcs });

        return NextResponse.json({
            success: true,
            pages: chapterWithPages.pages
        });
    } catch (error) {
        console.error('Error generating pages:', error);
        return NextResponse.json(
            { error: 'Failed to generate pages' },
            { status: 500 }
        );
    }
}