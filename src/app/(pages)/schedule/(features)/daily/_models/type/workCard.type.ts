export interface WorkLabelModel {
    id: string,
    name: string,
    icon: string,
    color: string,
    key: string,
    label_type: number
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
export interface WorkCardListModel {
    morning: WorkCardModel[];
    noon: WorkCardModel[];
    afternoon: WorkCardModel[];
    evening: WorkCardModel[];
    night: WorkCardModel[];
}