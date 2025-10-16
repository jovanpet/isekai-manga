import { generateSeriesOutline } from './seriesOutlineService';
import { generateObjectives } from './objectivesService';
import { generateThreads } from './threadService';
import { storyStore } from '@/store';
import { StoryDetails } from '@/types/story_details';
import { Arc } from '@/types/story/arc';
import { Objective } from '@/types/story/objective';
import { Thread } from '@/types/story/thread';
import { StorylineOption } from './storylineService';

export interface CreateStoryFromStorylineParams {
    storyData: StoryDetails;
    selectedStoryline: StorylineOption;
}

export interface CreateStoryResult {
    storyId: string;
    arcs: Arc[];
    objectives: Objective[];
    threads: Thread[];
}

export async function createStoryFromStoryline({
    storyData,
    selectedStoryline
}: CreateStoryFromStorylineParams): Promise<CreateStoryResult> {
    try {
        const updatedStoryData: StoryDetails = {
            ...storyData,
            title: selectedStoryline.title,
            summary: selectedStoryline.short_summary,
            description: selectedStoryline.detailed_description,
            plot: {
                ...storyData.plot,
                goal: selectedStoryline.goal
            }
        };

        const arcOutlines = await generateSeriesOutline(updatedStoryData);

        const arcs: Arc[] = arcOutlines.map((arcOutline, index) => ({
            id: `arc_${index + 1}`,
            ...arcOutline,
            order: index + 1,
            chapters: []
        }));

        const objectives: Objective[] = await generateObjectives(arcs);
        const threads: Thread[] = await generateThreads({ arcs, objectives });

        const storyId = await storyStore.createStory(
            updatedStoryData,
            arcs,
            objectives,
            threads,
            [updatedStoryData.mainCharacter],
            updatedStoryData.userId
        );

        return {
            storyId,
            arcs,
            objectives,
            threads
        };
    } catch (error) {
        console.error('Error creating story from storyline:', error);
        throw new Error('Failed to create story from storyline');
    }
}