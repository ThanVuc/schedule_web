export interface GoalLabelModel {
    id?: string,
    name: string,
    color: string,
    key: string,
    label_type: number
}

export interface GoalCardModel {
    id: string,
    name: string,
    start_date: string,
    end_date: string,
    short_descriptions: string,
    labels: GoalLabelModel[],
    category: GoalLabelModel
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

export interface GoalTaskModel {
    id?: string;
    name: string;
    is_completed: boolean;
}
export interface GoalLabelsGroup {
    status: GoalLabelModel;
    difficulty: GoalLabelModel;
    priority: GoalLabelModel;
    category: GoalLabelModel;
}

export interface GoalDetailModel {
    id: string;
    name: string;
    short_descriptions?: string;
    detailed_description?: string;
    start_date: number;
    end_date: number;
    goalLabels: GoalLabelsGroup;
    tasks: GoalTaskModel[];
}