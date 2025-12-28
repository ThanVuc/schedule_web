export interface labelDefault{
    category: label,
    difficulty: label,
    priority: label,
    status: label,
    type: label,
}
export interface label{
    id: string,
    name: string,
    color: string,
    key: string,
    label_type: number,
}