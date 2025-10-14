import { Story } from "@/types/story/story";

export function buildChaptersPrompt(story: Story, arcIndex: number) {
    const currentArcTitle = story.arcs[arcIndex].title;

    // Threads that need to be introduced in this arc
    const threadsToIntroduce = story.threads.filter(
        t => t.arcIntroduced === currentArcTitle && t.status === 'seed'
    );

    // Threads that need to be resolved in this arc
    const threadsToResolve = story.threads.filter(
        t => t.arcsResolved === currentArcTitle && t.status !== 'resolved'
    );

    const arcJSON = JSON.stringify(story.arcs, null, 2);
    const arcToBuild = JSON.stringify(story.arcs[arcIndex], null, 2);
    const objectivesRelated = story.objectives.filter(obj =>
        obj.relatedArcs.includes(currentArcTitle) && obj.status !== 'completed'
    );

    return `
You are a professional light-novel writer structuring a serialized Isekai manga.

THREADS TO INTRODUCE in this arc (change status from 'seed' to 'active'):
${JSON.stringify(threadsToIntroduce, null, 2)}

THREADS TO RESOLVE in this arc (change status from 'active' to 'resolved'):
${JSON.stringify(threadsToResolve, null, 2)}

Focus on expanding this ARC into detailed CHAPTERS.

ARC DETAILS:
${arcToBuild}

all objectives in the series so far:
${JSON.stringify(story.objectives, null, 2)}

OBJECTIVES related to this arc:
${JSON.stringify(objectivesRelated, null, 2)}

previous arc ending:
${previousArcEnding(story, arcIndex)}

all ARCS in the series:
${arcJSON}

---

### TASK
1. Break the arc into 5–8 chapters.
2. MUST introduce the threads listed in "THREADS TO INTRODUCE" during appropriate chapters in this arc.
3. MUST resolve the threads listed in "THREADS TO RESOLVE" during appropriate chapters in this arc.
4. When creating a chapter be aware of introducing new characters and if this person is important to the plot be sure to include them in the importantCharacters array at the end. Be very specific and intentional with chapter summary, very detailed on what happens in the chapter.
Each chapter includes:
   - chapterTitle
   - sceneType ("battle", "travel", "bonding", "training", "discovery", etc.)
   - summary (2–3 sentences)
   - detailed_description of the chapter events
   - challenge
   - resolution
   - outcomeType ("progress", "setback", "twist", or "victory")
3. After all chapters, output a single array called **importantCharacters** listing everyone significant across the entire arc.
   - include: name, gender ("male", "female", "other"), species ("human", "elf", "demon", "beastkin", "spirit", "god", "undead", "android", "fairy", "dragonkin"), role ("protagonist", "companion", "mentor", "rival", "villain", "support"), appearanceHint, role(villain, mentor, companion, support, etc)
4. After this include updates on characters if they are active or not anymore in the whole story, and if their role has changed for instance from companion to rival.
5. Return valid JSON ONLY with this format:

{
  "chapters": [ 
   {
      "chapterTitle": "string",
      "sceneType": "string",
      "summary": "string",
      "challenge": "string",
      "resolution": "string",
      "outcomeType": "progress | setback | twist | victory",
      "choices": ["string"]
   }
  ],
  "importantCharacters": [ 
   {
      "name": "string",
      "gender": "male | female | other",
      "species": "human | elf | demon | beastkin | spirit | god | undead | android | fairy | dragonkin",
      "role": " companion | mentor | rival | villain | support",
      "appearanceHint": "string",
   }
  ],
  "characterUpdates": [ 
   {
      "name": "string",
      "statusChange": "active | inactive",
      "roleChanges": "string"
   }
  ],
}
`;
}


function previousArcEnding(story: Story, arcIndex: number): string {
    if (arcIndex === 0) return "N/A - this is the first arc.";
    return `The previous arc ended with: "${story.arcs[arcIndex - 1].endingHint}"`;
}