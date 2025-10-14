import { Arc } from './arc';
import { StoryDetails } from '@/types/story_details';
import { Objective } from './objective';
import { Thread } from './thread';
import { Character } from '../character';

export interface Story {
    id: string;
    arcs: Arc[];
    objectives: Objective[];
    threads: Thread[];
    characters: Character[];
    storyDetailsId: string;
}
