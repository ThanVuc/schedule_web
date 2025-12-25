
export type CreateWorkMutationResponseType = {
    is_success: boolean;
    message: string;
    errorCode?: string;
}

export type DeleteWorkMutationResponseType = {
    is_success: boolean;
    message: string;
    errorCode?: string;

}

export type UpdateWorkMutationResponseType = {
    is_success: boolean;
    message: string;
    errorCode?: string;
}


export interface UpsertWorkRequest {
    name: string;
    start_date: number;
    end_date: number;
    goal_id: string | undefined;
    type_id: string;
    status_id: string;
    difficulty_id: string;
    priority_id: string;
    category_id: string;
    short_descriptions: string;
    detailed_description: string;
    notifications: notifications[];
    sub_tasks: SubTask[];
}
export interface ViewUpWorkRequest {
    name: string;
    start_date: number;
    end_date: number;
    goal_id: string | undefined;
    labels: labelDefault;
    short_descriptions: string;
    detailed_description: string;
    notifications: notifications[];
    sub_tasks: SubTask[];
}
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



export interface notifications {
    trigger_at: number;
    is_send_mail: boolean;
    is_active: boolean;
    link: string;
}
export interface SubTask {
    id?: string;
    name: string;
    is_completed: boolean;
}