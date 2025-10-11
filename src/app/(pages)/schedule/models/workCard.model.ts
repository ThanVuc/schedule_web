export interface WorkLabelModel {
    id: string,
    name: string,
    icon: string,
    color: string
}
export interface WorkCardModel {
    id: string;
    title: string;
    start_time: string,
    end_time: string,
    category: WorkLabelModel;
    goal: string;
    shortDescription: string;
    labels: WorkLabelModel[];
}