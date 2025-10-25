export interface ILabel{
    id: string,
    name: string,
    meaning: string,
    note: string,
    color:string,
    label_type: number,
    key: string
};
export interface LabelPerType{
    type: number,
    labels: ILabel[]
};
export interface LabelsResponse {
  label_per_types: LabelPerType[]
  error: any
}
