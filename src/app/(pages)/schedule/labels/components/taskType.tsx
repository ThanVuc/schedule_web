import { DateIcon, LoopIcon, TeamIcon } from "@/components/icon";
import { Inter } from 'next/font/google';
import { cloneElement } from "react";

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
});

interface TaskTypeProps {
    type: "Repeat" | "Group" | "Daily";
}

const TaskType = ({ type }: TaskTypeProps) => {
    const TaskType = {
        Repeat: { icon: <LoopIcon />, label: 'Lặp lại' },
        Group: { icon: <TeamIcon />, label: 'Nhóm' },
        Daily: { icon: <DateIcon />, label: 'Hằng ngày' },
    };
    const TaskTypeClasses = {
        Repeat: "text-[#00C8FF] bg-[#00C8FF]/20 border-[#00C8FF]",
        Group: "text-[#FF5EEF] bg-[#FF5EEF]/20 border-[#FF5EEF]",
        Daily: "text-[#E8E8E8] bg-[#E8E8E8]/20 border-[#E8E8E8]",
    };
    const { icon, label } = TaskType[type];

    return (
        <div className={`flex justify-center  ${inter.className} gap-2 p-1 text-sm rounded-md border-2 ${TaskTypeClasses[type]}`}>
            {cloneElement(icon, { className: "!w-4.5 !h-4.5" })}
            {label}
        </div>
    );
};

export default TaskType;