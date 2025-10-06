import { SpeedLoopIcon } from "@/components/icon";
import { Inter } from 'next/font/google';
import { cloneElement } from "react";

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
});

interface DifficultyProps {
    type: "Easy" | "Medium" | "Hard";
}

const Difficulty = ({ type }: DifficultyProps) => {
    const Difficulty = {
        Easy: { icon: <SpeedLoopIcon />, label: 'Dễ' },
        Medium: { icon: <SpeedLoopIcon />, label: 'Trung bình' },
        Hard: { icon: <SpeedLoopIcon />, label: 'Khó' },
    };
    const DifficultyClasses = {
        Easy: "text-[#13C540] bg-[#13C540]/20 border-[#13C540]",
        Medium: "text-[#FFEA00] bg-[#FFEA00]/20 border-[#FFEA00]",
        Hard: "text-[#FF5A43] bg-[#FF5A43]/20 border-[#FF5A43]",
    };
    const { icon, label } = Difficulty[type];

    return (
        <div className={`flex justify-center  ${inter.className} gap-2 p-1 text-sm rounded-md border-2 ${DifficultyClasses[type]}`}>
            {cloneElement(icon, { className: "!w-4.5 !h-4.5" })}
            {label}
        </div>
    );
};

export default Difficulty;