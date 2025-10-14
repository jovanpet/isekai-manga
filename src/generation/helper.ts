import { Character, StoryDetails } from "@/types";

export function formatMandatoryFieldsStory(story: StoryDetails) {
    return `
world type: ${story.newWorldType}
genre tags: ${story.genreTags.join(", ")}
`;
}

export function formatAdditionalFieldsStory(story: StoryDetails) {
    let fields = "";
    if (story.description) fields += `description: ${story.description}\n`;
    if (story.genreTags) fields += `genre tags: ${story.genreTags}\n`;
    if (story.plot) {
        if (story.plot.moralQuestion) fields += `moral question: ${story.plot.moralQuestion}\n`;
        if (story.plot.themes) fields += `themes: ${story.plot.themes.join(", ")}\n`;
        if (story.plot.tone) fields += `tone: ${story.plot.tone}\n`;
    }
    return fields.trim();
}

export function formatMandatoryFieldsCharacter(character: Character) {
    return `
name: ${character.name}
gender: ${character.gender}
rebirth type: ${character.rebirthType}
pre recreation occupation: ${character.previousOccupation}
post reincarnation species: ${character.species}
post reincarnation occupation: ${character.characterOccupation}
overpowered: ${character.overpowered}
`;
}

export function formatAdditionalFieldsCharacter(character: Character) {
    let fields = "";
    if (character.age) fields += `age: ${character.age}\n`;
    if (character.backstory) fields += `backstory: ${character.backstory}\n`;
    if (character.rebirthType) fields += `rebirth type: ${character.rebirthType}\n`;
    if (character.previousOccupation) fields += `previous occupation: ${character.previousOccupation}\n`;
    if (character.characterOccupation) fields += `current occupation: ${character.characterOccupation}\n`;
    if (character.overpowered) fields += `overpowered: ${character.overpowered}\n`;
    if (character.appearance) {
        const app = character.appearance;
        if (app.hairColor) fields += `hair color: ${app.hairColor}\n`;
        if (app.eyeColor) fields += `eye color: ${app.eyeColor}\n`;
        if (app.height) fields += `height: ${app.height}\n`;
        if (app.build) fields += `build: ${app.build}\n`;
        if (app.distinguishingFeatures) fields += `distinguishing features: ${app.distinguishingFeatures}\n`;
        if (app.skinTone) fields += `skin tone: ${app.skinTone}\n`;
        if (app.description) fields += `appearance description: ${app.description}\n`;
    }
    if (character.personalityTraits && character.personalityTraits.length > 0) fields += `personality traits: ${character.personalityTraits.join(", ")}\n`;

    return fields.trim();
}