export interface WorkLabelModel {
    id: string,
    name: string,
    color: string,
    key: string,
    label_type: number
}
export interface WorkCardModel {
    id: string;
    name: string;
    start_date: number;
    end_date: number;
    category: WorkLabelModel;
    goal: string;
    short_descriptions: string;
    detailed_description: string;
    labels: WorkLabelModel[];
}
export interface WorkCardListModel {
    works: WorkCardModel[];
}