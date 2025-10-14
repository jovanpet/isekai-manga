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

Return JSON only:
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
`;
}
