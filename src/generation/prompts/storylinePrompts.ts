import { Character, StoryDetails } from "@/types";
import * as helper from "../helper";

export function buildStorylinePrompt(story: StoryDetails) {
    return `
You are a creative Isekai story generator.

Given the story setup and main character, produce 3 possible storyline options.

Story Setup:
${helper.formatMandatoryFieldsStory(story)}
${helper.formatAdditionalFieldsStory(story)}

Main Character:
${helper.formatMandatoryFieldsCharacter(story.mainCharacter)}
${helper.formatAdditionalFieldsCharacter(story.mainCharacter)}

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