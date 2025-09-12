export interface Profile {
    id: string;
    fullname: string;
    email: string;
    avatar_url: string;
    bio: string;
    slug: string;
    date_of_birth: Date | number;
    gender: boolean;
    created_at: number;
    updated_at: number;
    sentence: string;
    author: string;
    profile_completed_percentage:number
}