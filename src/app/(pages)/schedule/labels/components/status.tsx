import {  Assign, Circle, DoneIcon, Progress, UnHappy } from "@/components/icon";
import { Inter } from 'next/font/google';
import { cloneElement } from "react";

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
});

interface StatusProps {
    type: "NotStarted" | "InProgress" | "Completed" | "Overdue" | "GiveUp";
}

const Status = ({ type }: StatusProps) => {
    const Status = {
        NotStarted: { icon: <Circle />, label: 'Chờ làm' },
        InProgress: { icon: <Progress />, label: 'Đang tiến hành' },
        Completed: { icon: <DoneIcon />, label: 'Hoàn thành' },
        Overdue: { icon: <Assign />, label: 'Quá hạn' },
        GiveUp: { icon: <UnHappy />, label: 'Từ bỏ' },
    };
    const StatusClasses = {
        NotStarted: "text-[#FFEA00] bg-[#FFEA00]/20 border-[#FFEA00]",
        InProgress: "text-[#00C8FF] bg-[#00C8FF]/20 border-[#00C8FF]", 
        Completed: "text-[#00FF00] bg-[#00FF00]/20 border-[#00FF00]",
        Overdue: "text-[#FF7C7E] bg-[#FF7C7E]/20 border-[#FF7C7E]",
        GiveUp: "text-[#ED1E02] bg-[#ED1E02]/20 border-[#ED1E02]"
    };
    const { icon, label } = Status[type];

    return (
        <div className={`flex justify-center  ${inter.className} gap-2 p-1 text-sm rounded-md border-2 ${StatusClasses[type]}`}>
            {cloneElement(icon, { className: "!w-4.5 !h-4.5" })}
            {label}
        </div>
    );
};
    
export default Status;