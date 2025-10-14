import { Story } from "@/types/story/story";

export function buildThreadSeedsPrompt(seriesOutline: Story) {
    const arcsJSON = JSON.stringify(seriesOutline.arcs, null, 2);
    const objJSON = JSON.stringify(seriesOutline.objectives, null, 2);

    return `
You are a narrative architect for a serialized Isekai manga.

Below is the current series outline and its objectives.

ARCS:
${arcsJSON}

OBJECTIVES:
${objJSON}

---

### DEFINITIONS
**Threads** are storylines or mysteries that persist across arcs.

Types:
- **Major Threads**: shape the core of the plot (e.g. "Lotus King", "Demon Debt").
  Introduced in early arcs, resolved near the end.
- **Minor Threads**: enrich side stories (e.g. "Missing Compass", "Merchant Rivalry").
  Introduced and resolved within 1–2 arcs.

---

### TASK
1. Propose 3–5 Major Threads and 4–8 Minor Threads.
2. For each, provide:
   - title
   - short summary (1–2 sentences)
   - status ("seed")
   - importance ("major" or "minor")
   - arcIntroduced and arcsResolved (by title - single arc each)
3. Tie them logically to objectives or arcs.

Return valid JSON ONLY:
[
  {
    "title": "string",
    "summary": "string",
    "importance": "major | minor",
    "status": "seed",
    "arcIntroduced": "Arc 1 title",
    "arcsResolved": "Arc 5 title",
    "relatedObjectives": ["Objective title"]
  }
]
`;
}
