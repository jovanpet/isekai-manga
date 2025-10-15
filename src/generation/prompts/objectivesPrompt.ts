import { Arc } from "@/types";

export function buildObjectivesPrompt(arcs: Arc[]) {
    const arcCount = arcs.length;
    const arcsJSON = JSON.stringify(arcs, null, 2);
    const numberOfMajorObjectives = Math.floor(arcCount * 0.3);
    const numberOfMinorObjectives = Math.floor(arcCount * 0.7);

    return `
You are a professional story planner designing narrative milestones
for a serialized Isekai manga.

TASK:
Create max ${numberOfMajorObjectives} major and ${numberOfMinorObjectives} minor clear OBJECTIVES that the protagonist
must complete before achieving their final goal. The objectives should be very specific and include details about specificity

Below is the current series outline with arcs:

${arcsJSON}

### DEFINITIONS

**Major Arcs**
- Move the story toward the final goal.
- Contain major world-changing events.
- Often introduce or resolve key threads.
- Be clear on the objectives and exactly a tangible achievement.

**Minor Arcs**
- Provide side quests, training arcs, relationship growth, or world exploration.
- Support or foreshadow Major Arcs.
- May resolve minor threads or optional objectives.

Guidelines:
- Each objective should map to one or more arcs.
- Describe the tangible achievement ("Earn the Tide-Oath", "Unite the Coastal Houses").
- Mix "main" and "optional" objectives if appropriate.
- Keep titles short (3-6 words) and cinematic.
- Each objective's description should be 1-2 sentences.

Return JSON only:

[
  {
    "title": "string",
    "description": "string",
    "relatedArcs": ["Arc 1 title", "Arc 2 title"],
    "type": "main | optional"
  }
]
`;
}
