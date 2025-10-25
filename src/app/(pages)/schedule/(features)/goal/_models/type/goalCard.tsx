export interface GoalLabelModel {
    id: string,
    name: string,
    icon: string,
    color: string,
    key: string,
    label_type: number;
}
export interface GoalCardModel {
    id: string;
    title: string;
    start_time: string,
    end_time: string,
    category: GoalLabelModel;
    shortDescription: string;
    labels: GoalLabelModel[];
}