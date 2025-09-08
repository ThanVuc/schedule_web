'use client';

import { DateInput } from "@/components/common";
import Image from "next/image";
import img from "../../../../../../public/assets/e145d5f684c1d0a465722a583e09904e.jpg";
interface SideBarProfileProps {
    Name: string;
    percentage?: number;
    CreateAt: string;
    UpdateAt: string;
}
const SideBarProfile = ({ Name, percentage, CreateAt, UpdateAt }: SideBarProfileProps) => {
    const clampedPercentage = Math.max(0, Math.min(percentage || 0, 100));
    const getProgressClass = (percentage: number) => {
        const rounded = Math.round(percentage / 10) * 10;
        return `progress-${Math.min(100, Math.max(0, rounded))}`;
    };

    return (
        <div className="w-full   p-3 rounded-xl flex flex-col items-center border-1 border-[#ffff]/10">
            <div className="mt-4 text-center">
                <div className="font-bold text-lg text-white">{Name}</div>
            </div>
            <div className="p-1 text-[#14FA61] bg-[#14FA61]/30 rounded-2xl m-3 mb-3 px-6 ">
                Active
            </div>
            <div className="w-70 h-70 border-15 border-[#4C4D50] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                <Image src={img} alt="Profile Picture" width={240} height={240} className="rounded-full" />
            </div>
            <div className="w-full mt-6">
                <p className="font-extralight font-poppins  text-white/50 mb-1 flex justify-between">Hoàn thiện hồ sơ <span className="text-[#14FA61]/70 font-bold text-sm mb-1text-right">{clampedPercentage}%</span>
                </p>

                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div className={`progress-bar ${getProgressClass(clampedPercentage)}`} />
                </div>
            </div>
            <div className="w-full mt-3 space-y-2">
                <DateInput
                    label="Thời gian tạo tài khoản"
                    inputProps={{
                        placeholder: "dd/MM/yyyy",
                        className: " border-none !bg-transparent disabled:text-white ",
                    }}
                    className="text-gray-400 text-sm border-b"
                    defaultValue={CreateAt ?? ""}
                    disabled={true}
                />
            </div>
            <div className="w-full mt-4 space-y-2">
                <DateInput
                    label="Thời gian cập nhật tài khoản"
                    inputProps={{
                        placeholder: "dd/MM/yyyy",

                        className: " border-none !bg-transparent disabled:text-white",
                    }}
                    className=" text-gray-400 text-sm border-b"
                    defaultValue={UpdateAt ?? ""}
                    disabled={true}
                />

            </div>
        </div>
    );
};

export default SideBarProfile;
