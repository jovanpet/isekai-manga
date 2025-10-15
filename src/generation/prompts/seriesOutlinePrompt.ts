import { Character, StoryDetails } from "@/types";
import * as helper from "../helper";

export function buildSeriesOutlinePrompt(story: StoryDetails, mainCharacter: Character) {

    return `
You are an isekai manga editor outlining a full series.

Story setup:
${helper.formatMandatoryFieldsStory(story)}
${helper.formatAdditionalFieldsStory(story)}

Main character:
${helper.formatMandatoryFieldsCharacter(mainCharacter)}
${helper.formatAdditionalFieldsCharacter(mainCharacter)}

The user wants a ${story.totalArcs} story.

Create a complete outline that fits this scope.
Each arc should move the protagonist toward their ultimate goal (${story.plot?.goal}).

Return ONLY valid JSON in this exact format (no additional text or explanations):

{
  "arcs": [
    {
      "title": "string",
      "theme": "string",
      "goal": "string",
      "keyTwist": "string",
      "tone": "string",
      "endingHint": "string"
    }
  ]
}

IMPORTANT:
- All string values must be properly quoted
- No trailing commas
- No comments in the JSON
- Return only the JSON object, nothing else
`;
}
