'use client';
import SideBarProfile from "../components/sideBarProflie";
import UpdateProfile from "./updateProfile";


const ProfilePage = () => {
    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold  text-white">Profile</h1>
                <p className="text-white text-sm mt-1 border-b-2 pb-4 border-dashed border-[#343538] ">
                    Quản lý và cập nhật thông tin cá nhân của bạn
                </p>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
                <div className="lg:w-2/5 w-full">
                    <SideBarProfile
                        CreateAt="25/1/2023"
                        UpdateAt="12/10/2023"
                        percentage={10}
                        Name="Thái Đại Huân"
                    />
                </div>
                <div className="lg:w-4/5 w-full space-y-6">
                    <UpdateProfile />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
