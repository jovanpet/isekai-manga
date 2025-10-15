import { runGemini } from '../geminiClient';
import { buildPagesPrompt } from '../prompts/pagesPrompt';
import { safeJsonParse } from '../utils/jsonParser';
import { Story } from '@/types/story/story';
import { Chapter, Page } from '@/types/story/arc';
import { getUserApiKey } from '../../lib/userSettings';

export interface PageGenerationResponse {
    chapterTitle: string;
    pages: Page[];
}

export async function generatePagesForChapter(
    chapter: Chapter,
    story: Story
): Promise<PageGenerationResponse> {
    try {
        const userApiKey = await getUserApiKey();
        if (!userApiKey) {
            throw new Error('Please add your Gemini API key in Settings before generating pages.');
        }

        const prompt = buildPagesPrompt(chapter, story.characters.filter(char => char.status === 'active'));
        const response = await runGemini(prompt, userApiKey);

        const pageData = safeJsonParse<PageGenerationResponse>(response, 'page generation');

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
        if (error instanceof Error && error.message.includes('API key')) {
            throw error;
        }
        throw new Error('Failed to generate pages for chapter');
    }
}