import { Character } from "@/types";
import { Chapter } from "@/types/story/arc";

export function buildPagesPrompt(chapter: Chapter, activeCharacters: Character[]) {
    const chapterJSON = JSON.stringify(chapter, null, 2);
    const charsJSON = JSON.stringify(activeCharacters, null, 2);

    return `
You are a manga storyboard artist designing page layouts.

CHAPTER:
${chapterJSON}

ACTIVE CHARACTERS:
${charsJSON}

---

### TASK
Divide the chapter into 4–6 pages.  
Each page can be one of two types:

1. **"multi" page** — 2–6 smaller panels that move the story.
2. **"splash" page** — a single full-page illustration used for a dramatic reveal or emotion peak.
3. Panels can contain multiple people if the story requires it.

---

### RULES
- Use "splash" pages rarely (1 per chapter).
- Splash pages emphasize major moments: power-up, death, new setting, emotional climax.
- Multi pages should include multiple smaller panels.

---

### OUTPUT FORMAT
Return valid JSON:

{
  "chapterTitle": "${chapter.chapterTitle}",
  "pages": [
    {
      "id": "page-1",
      "order": 1,
      "pageType": "multi" | "splash",
      "layoutType": "standard | action | dialogue",  // only for multi
      "description": "string",
      "emotion": "string",
      "panel": {                 // only for splash
        "id": "panel-1",
        "order": 1,
        "description": "string",
        "dialogue": "string",
        "emotion": "string",
        "focusCharacters": ["string"],
        "settingHint": "string",
        "cameraAngle": "string",
        "soundEffect": "string"
      },
      "panels": [                // only for multi
        {
          "id": "panel-1",
          "order": 1,
          "description": "string",
          "dialogue": "string",
          "emotion": "string",
          "focusCharacters": ["string"],
          "settingHint": "string",
          "cameraAngle": "string",
          "soundEffect": "string"
        }
      ]
    }
  ]
}`;
}
