# Isekai Manga - AI-Powered Story Generator

An AI-powered web application for creating and managing isekai manga stories. Generate complete story outlines, arcs, chapters, and manga pages with the help of Google's Gemini AI.

Publicly Hosted: https://isekai-manga-5c872.web.app/

To use sign up and add your Gemini API key to the Settings tab.

## Features

### 📖 Story Creation
- **Custom Story Configuration**: Define your isekai world, main character, and story parameters
- **AI-Generated Outlines**: Automatically generate story arcs, objectives, and plot threads
- **Character Development**: Create detailed main and supporting characters with rich backstories
- **Genre Flexibility**: Choose from multiple genre tags, influences, and themes

### 📚 Content Generation
- **Incremental Arc Generation**: Generate chapters one arc at a time
- **Chapter Details**: Each chapter includes summary, challenge, resolution, and scene type
- **Page Generation**: Create detailed manga pages with panels, dialogue, and visual descriptions
- **Character Integration**: Automatically track and update character appearances across chapters

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **AI**: Google Gemini 2.5 Flash

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project set up
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd isekai-manga
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                          # Next.js app router pages
│   ├── page.tsx                  # Home page (story creation)
│   ├── story/[id]/              # Story detail pages
│   │   ├── page.tsx             # Story overview with sidebar
│   │   └── chapter/             # Chapter detail pages
│   └── generate-storylines/     # Story outline generation
├── components/                   # React components
│   ├── CreateStoryPage.tsx      # Story creation form
│   └── forms/                   # Form components
├── generation/                   # AI generation logic
│   ├── geminiClient.ts          # Gemini API client
│   ├── prompts/                 # AI prompts
│   │   ├── seriesOutlinePrompt.ts
│   │   ├── objectivesPrompt.ts
│   │   ├── chapterGenerationPrompt.ts
│   │   └── pagesPrompt.ts
│   ├── services/                # Generation services
│   │   ├── seriesOutlineService.ts
│   │   ├── chapterService.ts
│   │   ├── pageService.ts
│   │   └── storyCompletionService.ts
│   └── utils/                   # Utility functions
│       └── jsonParser.ts        # JSON parsing utilities
├── store/                       # Firebase store
│   ├── stories.ts              # Story CRUD operations
│   └── story_details.ts        # Story details operations
├── types/                       # TypeScript types
│   ├── story/                  # Story-related types
│   │   ├── story.ts
│   │   ├── arc.ts
│   │   ├── objective.ts
│   │   └── thread.ts
│   ├── character.ts            # Character types
│   └── story_details.ts        # Story details types
└── lib/                        # Library configurations
    └── firebase.ts             # Firebase initialization
```

## Usage

### Creating a Story

1. **Fill in Story Details**:
   - Choose influence (Original, Anime, Manga, etc.)
   - Select new world type and origin world
   - Pick genre tags (Action, Adventure, Comedy, etc.)
   - Set arc length (Short, Medium, Epic, or Surprise Me)

2. **Define Main Character**:
   - Enter character name
   - Select gender, species, and rebirth type
   - Choose previous occupation and new role
   - Toggle "Overpowered" if applicable

3. **Click "Create Story"**:
   - AI generates story outline with arcs, objectives, and threads
   - Review and approve the generated outline

### Generating Content

1. **Generate Arcs**: Click "Generate Arc X" in the sidebar to create chapters for the next arc
2. **View Chapters**: Click on any chapter to see details
3. **Generate Pages**: Within a chapter, click "Generate Pages" to create manga page layouts
4. **Navigate**: Use the sidebar to quickly jump between sections and arcs

### Managing Stories

- **View All Stories**: Scroll to the bottom of the home page to see all created stories
- **Story Cards**: Each card shows title, summary, genre tags, arc count, and progress
- **Quick Access**: Click any story card to jump directly to that story

## Features in Detail

### Story Arcs
- Each story has 3-24 arcs depending on arc length setting
- Arcs include theme, goal, key twist, and ending hint
- Chapters are generated per arc with detailed summaries

### Chapters
- Scene types: discovery, action, dialogue, training, revelation
- Outcome types: victory, progress, setback, twist
- Includes challenge, resolution, and character choices
- Detailed descriptions for story continuity

### Manga Pages
- Two types: Splash pages (full-page panels) and Multi-panel pages
- Layout types: standard, dynamic, cinematic
- Each panel includes:
  - Description and dialogue
  - Focus characters
  - Camera angles
  - Sound effects
  - Setting hints

### Character System
- Main character with detailed attributes
- Supporting characters introduced per arc
- Character updates tracked across story progression
- Abilities, appearance, and backstory for each character

## AI Generation

The app uses Google Gemini 2.5 Flash for all AI generation:

All prompts are carefully crafted to ensure consistency and quality across the generated content.

## Development

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Database by [Firebase](https://firebase.google.com/)
- UI inspired by [Notion](https://notion.so/)

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for isekai fans everywhere**
