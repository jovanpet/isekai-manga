import { Character } from "@/types";

export function buildCharacterTypePrompt(character: Character) {
    return `
You are a professional character designer for fantasy manga and light novels.

Below is a list of characters with basic attributes.
For each one, create a rich "Character Type" profile.

INPUT CHARACTERS:
${JSON.stringify(character, null, 2)}

---

### OUTPUT REQUIREMENTS

For each character, return an object with:

{
  "name": "string",
  "abilities": ["string"],                 // 2–3 named techniques or talents
  "appearance": {
    "hairColor"?: statics.HairColor,
    "eyeColor"?: statics.EyeColor,
    "height"?: "string",
    "build"?: statics.BodyType,
    "distinguishingFeatures"?: "string",
    "skinTone"?: statics.SkinTone,
    "description"?: "string"
  }
    outfit:{
            name: "string",
            description: "string"
    }
}

Guidelines:
- Keep power levels consistent with role and species.
- Stay in Isekai/fantasy tone — light novel style.
- Ensure gender/species traits influence design.
- Keep all text concise and JSON-friendly.

Return JSON array ONLY.
`;
}
