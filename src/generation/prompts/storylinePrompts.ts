export function buildStorylinePrompt(story: any, mainCharacter: any) {
    return `
You are a creative Isekai story generator.

Given the story setup and main character, produce 3 possible storyline options.

Story Setup:
world type: ${story.newWorldType}
genre tags: ${story.genreTags.join(", ")}
${formatAdditionalFieldsStory(story.plot)}

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
    "description": "string"
  }
]
Keep summaries short and cinematic, like an anime season synopsis.
`
}

function formatAdditionalFieldsStory(plot: any) {
    let fields = "";
    if (plot.premise) fields += `premise: ${plot.premise}\n`;
    if (plot.goal) fields += `goal: ${plot.goal}\n`;
    if (plot.conflict) fields += `conflict: ${plot.conflict}\n`;
    if (plot.themes && plot.themes.length > 0) fields += `themes: ${plot.themes.join(", ")}\n`;
    if (plot.tone) fields += `tone: ${plot.tone}\n`;
    if (plot.moralQuestion) fields += `moral question: ${plot.moralQuestion}\n`;
    return fields.trim();
}

function formatAdditionalFieldsCharacter(character: any) {
    let fields = "";
    if (character.class) fields += `class: ${character.class}\n`;
    if (character.age) fields += `age: ${character.age}\n`;
    if (character.backstory) fields += `backstory: ${character.backstory}\n`;
    if (character.appearance?.description) fields += `appearance: ${character.appearance.description}\n`;
    if (character.distinguishingFeatures) fields += `distinguishing features: ${character.distinguishingFeatures}\n`;
    if (character.originWorld) fields += `origin world: ${character.originWorld}\n`;
    if (character.currentWorld) fields += `current world: ${character.currentWorld}\n`;
    return fields.trim();
}