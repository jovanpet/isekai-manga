import * as statics from "./statics";

export interface Outfit {
    name: string;
    description: string;
    image?: string; // outfit-specific image or design sheet
    tags?: string[];
}

export interface Character {
    id: string;
    storyId: string;

    // identity
    name: string;
    gender: statics.Gender;
    species: statics.Species;
    role: statics.CharacterRole;
    characterOccupation?: string;
    previousOccupation?: statics.PreviousOccupations;
    rebirthType?: string;
    age?: number;
    backstory?: string;
    status: 'active' | 'inactive';

    // personality
    personalityTraits: statics.Trait[];

    // appearance
    appearance: {
        hairColor?: statics.HairColor;
        eyeColor?: statics.EyeColor;
        height?: string;
        build?: statics.BodyType;
        distinguishingFeatures?: string;
        skinTone?: statics.SkinTone;
        description?: string;
    };

    referenceImages?: {
        portrait?: string;
        fullBody?: string;
    };

    outfits?: Record<string, Outfit>;
    currentOutfit?: string;

    overpowered: boolean;

    createdAt?: any; // Firebase timestamp
    updatedAt?: any; // Firebase timestamp
}

const random = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomBool = () => Math.random() < 0.5;

export function randomCharacterPreset() {
    return {
        name: `Character${Math.floor(Math.random() * 1000)}`,
        gender: random(Object.values(statics.Gender)),
        species: random(Object.values(statics.Species)),
        role: random(Object.values(statics.CharacterRole)),
        previousOccupation: random(Object.values(statics.PreviousOccupations)),
        characterOccupation: random(statics.ROLES),
        rebirthType: random(statics.REBIRTH_TYPES),
        personalityTraits: [
            random(Object.values(statics.Trait)),

            random(Object.values(statics.Trait))
        ],
        overpowered: randomBool(),
        appearance: {
            hairColor: random(Object.values(statics.HairColor)),
            eyeColor: random(Object.values(statics.EyeColor)),
            build: random(Object.values(statics.BodyType)),
            skinTone: random(Object.values(statics.SkinTone))
        },
        age: Math.floor(Math.random() * 30) + 16
    };
}
