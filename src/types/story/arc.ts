export interface Arc {
    id: string;
    title: string;
    order: number;
    theme: string;
    goal: string;
    keyTwist: string;
    endingHint: string;
    chapters: Chapter[]
}

export interface Chapter {
    chapterTitle: string;
    sceneType: string;
    summary: string;
    detailed_description: string;
    challenge: string;
    resolution: string;
    outcomeType: 'progress' | 'setback' | 'twist' | 'victory';
    choices: string[];
}