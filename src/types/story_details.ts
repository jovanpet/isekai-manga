import { Character } from "./character";
import * as statics from "./statics";

export interface Plot {
    goal: string;                   // main objective or motivation
    conflict: string;               // main opposition
    themes?: statics.Theme[];       // optional recurring motifs ("identity", "redemption")
    tone?: statics.Tone;            // emotional tone ("melancholic", "hopeful", "dark comedy")
    moralQuestion?: string;         // deeper meaning or moral core
}

export interface StoryDetails {
    id: string;
    title: string;
    plot: Plot;
    influence: statics.Influence;
    newWorldType: string;
    originWorld: string;
    genreTags: statics.GenreTag[];
    description?: string;
    summary?: string;
    totalArcs: number;
    status: statics.StoryStatus;
    createdAt: string;
    updatedAt: string;
    userId?: string;
    mainCharacter: Character;
}

const random = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomBool = () => Math.random() < 0.5;

export function randomStoryPreset() {
    const influence = random(Object.values(statics.Influence));
    const tone = random(Object.values(statics.Tone));
    const themes = [random(Object.values(statics.Theme)), random(Object.values(statics.Theme))];

    return {
        title: random(statics.TITLES),
        influence,
        newWorldType: random(statics.WORLDS),
        originWorld: random(statics.WORLDS),
        overpowered: randomBool(),
        genreTags: [random(Object.values(statics.GenreTag)), statics.GenreTag.Fantasy],
        totalPages: 100,
        plot: {
            premise: random(statics.PREMISES),
            goal: random(statics.GOALS),
            conflict: random(statics.CONFLICTS),
            themes,
            tone,
        },
    };
}