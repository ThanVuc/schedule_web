'use client';
import { useAxios } from "@/hooks";
import SideBarProfile from "../components/sideBarProflie";
import UpdateProfile from "./updateProfile";
import { Profile } from "../models/type/profile.type";
import profileApiUrl from "@/api/profile";
import useToastState from "@/hooks/useToasts";


const ProfilePage = () => {
    const { setToast } = useToastState()
    const { data, error,refetch } = useAxios<Profile>({
        method: "GET",
        url: profileApiUrl.getUserProfile,
    }, undefined);
    if (error) {
        setToast({
            title: "Lỗi",
            message: "Không thể tải thông tin cá nhân",
            variant: "error"
        })
    }
    const formatDate = (inputTime?: number | null): string => {
        if (!inputTime) return ""; // hoặc return "--/--/----"

        // Nếu input là giây thì đổi thành mili giây
        const timestamp =
            inputTime.toString().length === 10 ? inputTime * 1000 : inputTime;

        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };


return (
    <div className="min-h-screen px-10 pb-10">
        <div className="mb-6">
            <h1 className="text-3xl font-bold  text-white">Profile</h1>
            <p className="text-white text-sm mt-1 border-b-2 pb-4 border-dashed border-[#343538] ">
                Quản lý và cập nhật thông tin cá nhân của bạn
            </p>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row">
            <div className="lg:w-2/5 w-full">
                <SideBarProfile
                    CreateAt={formatDate(data?.created_at)}
                    UpdateAt={formatDate(data?.updated_at)}
                    percentage={data?.profile_completed_percentage}
                    Name={data?.fullname || "No name"}
                />
            </div>
            {data &&(<div className="lg:w-4/5 w-full space-y-6">
                <UpdateProfile formItems={data} id={data.id} refetch={refetch ?? (() => {})} />
            </div>)}
        </div>
    </div>
);
};

export default ProfilePage;
