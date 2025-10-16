import jsPDF from 'jspdf';
import { Story } from '@/types/story/story';
import { StoryDetails } from '@/types/story_details';

export interface GeneratePDFOptions {
    includeObjectives?: boolean;
    includeThreads?: boolean;
    includeCharacters?: boolean;
    includeChapters?: boolean;
}

export function generateStoryPDF(
    story: Story & { details: StoryDetails },
    options: GeneratePDFOptions = {
        includeObjectives: true,
        includeThreads: true,
        includeCharacters: true,
        includeChapters: true
    }
): void {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;

    const checkPageBreak = (requiredSpace: number = 20) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };

    const addWrappedText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
            checkPageBreak();
            doc.text(line, margin, yPosition);
            yPosition += lineHeight;
        });
    };

    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(story.details.title, maxWidth);
    titleLines.forEach((line: string) => {
        doc.text(line, margin, yPosition);
        yPosition += 12;
    });
    yPosition += 10;

    if (story.details.summary) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        const summaryLines = doc.splitTextToSize(story.details.summary, maxWidth);
        summaryLines.forEach((line: string) => {
            checkPageBreak();
            doc.text(line, margin, yPosition);
            yPosition += lineHeight;
        });
        yPosition += 10;
    }

    yPosition += 5;
    addWrappedText('Story Information', 16, true);
    yPosition += 5;
    addWrappedText(`Genre: ${story.details.genreTags.join(', ')}`);
    addWrappedText(`World Type: ${story.details.newWorldType}`);
    addWrappedText(`Influence: ${story.details.influence}`);
    addWrappedText(`Total Arcs: ${story.arcs.length}`);

    if (story.details.description) {
        yPosition += 5;
        addWrappedText('Description:', 12, true);
        addWrappedText(story.details.description);
    }
    yPosition += 10;

    // Main Character
    checkPageBreak(40);
    addWrappedText('Main Character', 16, true);
    yPosition += 5;
    addWrappedText(`Name: ${story.details.mainCharacter.name}`, 12, true);
    addWrappedText(`Gender: ${story.details.mainCharacter.gender}`);
    addWrappedText(`Species: ${story.details.mainCharacter.species}`);
    addWrappedText(`Rebirth Type: ${story.details.mainCharacter.rebirthType}`);
    addWrappedText(`Previous Occupation: ${story.details.mainCharacter.previousOccupation}`);
    addWrappedText(`New Role: ${story.details.mainCharacter.characterOccupation}`);
    if (story.details.mainCharacter.overpowered) {
        addWrappedText('Overpowered: Yes');
    }
    yPosition += 10;

    // Additional Characters
    if (options.includeCharacters && story.characters && story.characters.length > 0) {
        checkPageBreak(40);
        addWrappedText('Characters', 16, true);
        yPosition += 5;

        story.characters.forEach((character) => {
            checkPageBreak(30);
            addWrappedText(`${character.name} (${character.role})`, 12, true);
            addWrappedText(`${character.gender} ${character.species}`);
            if (character.appearance?.description) {
                addWrappedText(`Appearance: ${character.appearance.description}`);
            }
            if (character.personalityTraits && character.personalityTraits.length > 0) {
                addWrappedText(`Traits: ${character.personalityTraits.join(', ')}`);
            }
            yPosition += 5;
        });
        yPosition += 5;
    }

    // Objectives
    if (options.includeObjectives && story.objectives && story.objectives.length > 0) {
        checkPageBreak(40);
        addWrappedText('Story Objectives', 16, true);
        yPosition += 5;

        story.objectives.forEach((objective, index) => {
            checkPageBreak(25);
            addWrappedText(`${index + 1}. ${objective.title} (${objective.type})`, 12, true);
            addWrappedText(objective.description);
            if (objective.relatedArcs && objective.relatedArcs.length > 0) {
                addWrappedText(`Related Arcs: ${objective.relatedArcs.join(', ')}`, 9);
            }
            yPosition += 5;
        });
        yPosition += 5;
    }

    // Threads
    if (options.includeThreads && story.threads && story.threads.length > 0) {
        checkPageBreak(40);
        addWrappedText('Story Threads', 16, true);
        yPosition += 5;

        const majorThreads = story.threads.filter(t => t.importance === 'major');
        const minorThreads = story.threads.filter(t => t.importance === 'minor');

        if (majorThreads.length > 0) {
            addWrappedText('Major Threads', 14, true);
            yPosition += 3;
            majorThreads.forEach((thread, index) => {
                checkPageBreak(25);
                addWrappedText(`${index + 1}. ${thread.title}`, 12, true);
                addWrappedText(thread.summary);
                addWrappedText(`Status: ${thread.status}`, 9);
                yPosition += 5;
            });
        }

        if (minorThreads.length > 0) {
            yPosition += 5;
            addWrappedText('Minor Threads', 14, true);
            yPosition += 3;
            minorThreads.forEach((thread, index) => {
                checkPageBreak(20);
                addWrappedText(`${index + 1}. ${thread.title}`, 12, true);
                addWrappedText(thread.summary);
                yPosition += 3;
            });
        }
        yPosition += 5;
    }

    // Arcs and Chapters
    if (options.includeChapters && story.arcs && story.arcs.length > 0) {
        story.arcs.forEach((arc) => {
            checkPageBreak(50);

            // Arc Header
            addWrappedText(`Arc ${arc.order}: ${arc.title}`, 18, true);
            yPosition += 5;
            addWrappedText(`Theme: ${arc.theme}`, 11, true);
            addWrappedText(`Goal: ${arc.goal}`);
            addWrappedText(`Key Twist: ${arc.keyTwist}`);
            yPosition += 10;

            // Chapters
            if (arc.chapters && arc.chapters.length > 0) {
                addWrappedText(`Chapters (${arc.chapters.length})`, 14, true);
                yPosition += 5;

                arc.chapters.forEach((chapter, chapterIndex) => {
                    checkPageBreak(40);

                    addWrappedText(`Chapter ${chapterIndex + 1}: ${chapter.chapterTitle}`, 13, true);
                    yPosition += 2;
                    addWrappedText(chapter.summary);
                    yPosition += 3;

                    addWrappedText(`Scene: ${chapter.sceneType} | Outcome: ${chapter.outcomeType}`, 9);
                    addWrappedText(`Challenge: ${chapter.challenge}`, 9);
                    addWrappedText(`Resolution: ${chapter.resolution}`, 9);

                    // Pages
                    if (chapter.pages && chapter.pages.length > 0) {
                        yPosition += 3;
                        addWrappedText(`Pages: ${chapter.pages.length}`, 10, true);
                        yPosition += 2;

                        chapter.pages.forEach((page, pageIndex) => {
                            checkPageBreak(15);
                            addWrappedText(`Page ${page.order || pageIndex + 1}:`, 9, true);

                            if (page.pageType === 'splash' && page.panel) {
                                addWrappedText(`${page.panel.dialogue || page.panel.description || 'Visual panel'}`, 9);
                            } else if (page.pageType === 'multi' && page.panels) {
                                page.panels.forEach((panel, panelIndex) => {
                                    addWrappedText(`  Panel ${panel.order || panelIndex + 1}: ${panel.dialogue || panel.description || 'Visual panel'}`, 8);
                                });
                            }
                            yPosition += 2;
                        });
                    }

                    yPosition += 8;
                });
            }
            yPosition += 10;
        });
    }

    const fileName = `${story.details.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_story.pdf`;
    doc.save(fileName);
}
