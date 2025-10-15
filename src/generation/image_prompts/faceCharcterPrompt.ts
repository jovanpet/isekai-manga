import { Character, StoryDetails } from "../../types";

export function buildCharacterImagePrompt(character: Character, storyDetails: StoryDetails) {
    const { name, gender, species, role, age, appearance } = character;

    return `
Facial portrait of a ${gender} ${species} ${role} named ${name}, age ${age}.
${appearance.description ? `Appearance details: ${appearance.description}` : ''}
${appearance.hairColor ? `Hair color: ${appearance.hairColor}.` : ''}
${appearance.eyeColor ? `Eye color: ${appearance.eyeColor}.` : ''}
${appearance.height ? `Height: ${appearance.height}.` : ''}
${appearance.build ? `Build: ${appearance.build}.` : ''}
${appearance.distinguishingFeatures ? `Distinguishing features: ${appearance.distinguishingFeatures}.` : ''}
${appearance.skinTone ? `Skin tone: ${appearance.skinTone}.` : ''}

Influenced by the ${storyDetails.influence} style illustration with just the face, clean ink lines, cel-shaded lighting, detailed clothing textures.
High-resolution, no text or logos, focus on expression and facial details.
`;
}

