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
    pages: Page[];
}

export interface Page {
    id: string;
    order: number;
    pageType: "multi" | "splash";   // "splash" = full-page panel
    layoutType?: "standard" | "action" | "dialogue"; // only for multi
    description: string;            // what’s happening
    emotion?: string;
    panel?: Panel;                  // only if splash
    panels?: Panel[];               // only if multi
}

export interface Panel {
    id: string;
    order: number;
    description: string;
    dialogue?: string;
    emotion?: string;
    focusCharacters?: string[];
    settingHint?: string;
    cameraAngle?: string;
    soundEffect?: string;
}
