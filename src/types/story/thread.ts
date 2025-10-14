export interface Thread {
    title: string;
    summary: string;
    importance: 'major' | 'minor';
    status: 'seed' | 'active' | 'resolved';
    arcIntroduced: string;
    arcsResolved: string;
    relatedObjectives: string[];
}