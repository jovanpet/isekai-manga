export interface Objective {
    title: string;
    description: string;
    relatedArcs: string[];
    type: 'main' | 'optional';
    status: 'pending' | 'in-progress' | 'completed';
}