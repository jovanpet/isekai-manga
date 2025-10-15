import { runGemini } from '../geminiClient';
import { buildPagesPrompt } from '../prompts/pagesPrompt';
import { safeJsonParse } from '../utils/jsonParser';
import { Story } from '@/types/story/story';
import { Chapter, Page } from '@/types/story/arc';
import { Character } from '@/types/character';

export interface PageGenerationResponse {
    chapterTitle: string;
    pages: Page[];
}

export async function generatePagesForChapter(
    chapter: Chapter,
    story: Story
): Promise<PageGenerationResponse> {
    try {
        // Get active characters from the story
        const activeCharacters = story.characters.filter(char => char.status === 'active');

        const prompt = buildPagesPrompt(chapter, activeCharacters);
        const response = await runGemini(prompt);

        // Parse the response using safe JSON parser
        const pageData = safeJsonParse<PageGenerationResponse>(response, 'page generation');

        // Generate unique IDs for pages and panels if they don't exist
        pageData.pages = pageData.pages.map((page, pageIndex) => {
            const pageWithId = {
                ...page,
                id: page.id || `page-${pageIndex + 1}`,
                order: page.order || pageIndex + 1
            };

            // Handle splash page panel
            if (pageWithId.pageType === 'splash' && pageWithId.panel) {
                pageWithId.panel = {
                    ...pageWithId.panel,
                    id: pageWithId.panel.id || `panel-1`,
                    order: pageWithId.panel.order || 1
                };
            }

            // Handle multi page panels
            if (pageWithId.pageType === 'multi' && pageWithId.panels) {
                pageWithId.panels = pageWithId.panels.map((panel, panelIndex) => ({
                    ...panel,
                    id: panel.id || `panel-${panelIndex + 1}`,
                    order: panel.order || panelIndex + 1
                }));
            }

            return pageWithId;
        });

        return pageData;
    } catch (error) {
        console.error('Error generating pages for chapter:', error);
        throw new Error('Failed to generate pages for chapter');
    }
}