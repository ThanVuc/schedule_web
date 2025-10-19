export interface ILabel{
    id: string,
    name: string,
    meaning: string,
    note: string,
    color:string,
    label_type: number,
    key: string
};
export interface ILabelGroup{
    type: number,
    labels: ILabel[]
};