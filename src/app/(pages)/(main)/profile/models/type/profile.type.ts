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
    profile_completed_percentage: number
}

export interface PresignedUrlRequest {
    public_url?: string
    is_delete?: boolean
}

export interface PresignedUrlResponse {
    presign_url: string
    public_url: string
    object_key: string
}
