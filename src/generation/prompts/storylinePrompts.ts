import { Character, Story } from "@/types";

export function buildStorylinePrompt(story: Story, mainCharacter: Character) {
    return `
You are a creative Isekai story generator.

Given the story setup and main character, produce 3 possible storyline options.

Story Setup:
world type: ${story.newWorldType}
genre tags: ${story.genreTags.join(", ")}
${formatAdditionalFieldsStory(story)}

Main Character:
name: ${mainCharacter.name}
gender: ${mainCharacter.gender}
rebirth type: ${mainCharacter.rebirthType}
pre recreation occupation: ${mainCharacter.previousOccupation}
post reincarnation species: ${mainCharacter.species}
post reincarnation occupation: ${mainCharacter.characterOccupation}
overpowered: ${mainCharacter.overpowered}
${formatAdditionalFieldsCharacter(mainCharacter)}

Output JSON only, with this exact structure:
[
  {
    "title": "string",
    "hook": "string",
    "short_summary": "string",
    "detailed_description": "string",
    "goal": "string"
  }
]
Keep summaries short and cinematic, like an anime season synopsis.
`
}

function formatAdditionalFieldsStory(story: Story) {
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

function formatAdditionalFieldsCharacter(character: Character) {
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