export interface GoalLabelModel {
    id: string;
    name: string;
    color: string;
    key: string;
    label_type: number;
}

export interface GoalTask {
    id: string;
    name: string;
    is_completed: boolean;
}

export interface GoalLabelsGrouped {
    status?: GoalLabelModel[];
    difficulty?: GoalLabelModel[];
    priority?: GoalLabelModel[];
}

export interface GoalCardModel {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    category: GoalLabelModel[];
    short_descriptions: string;
    detailed_description: string;
    goalLabels: GoalLabelsGrouped;
}

export interface GoalCardDetail {
    items: GoalCardModel[];
    task: GoalTask[];
}

export interface GoalsResponse {
    items: GoalCardModel[];
    total_goals: number;
    total_pages: number;
    page_size: number;
    page: number;
    has_prev: boolean;
    has_next: boolean;
}