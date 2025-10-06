import { Inter } from "next/font/google";

interface PriorityLevelProps {
    type: "High" | "Medium" | "Low" | "Peaceful";
}


const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
});

const PriorityLevel = ({ type }: PriorityLevelProps) => {
     const priorityClasses = {
        High: "text-[#FF5A43] bg-[#FF5A43]/20 border-[#FF5A43]",
        Medium: "text-[#13C540] bg-[#13C540]/20 border-[#13C540]", 
        Low: "text-[#FFEA00] bg-[#FFEA00]/20 border-[#FFEA00]",
        Peaceful: "text-[#B9B9B9] bg-[#B9B9B9]/20 border-[#B9B9B9]"
    };

    const priorityLabels = {
        High: "Quan trọng & Khẩn cấp",
        Medium: "Quan trọng & Không khẩn cấp", 
        Low: "Không quan trọng & Khẩn cấp",
        Peaceful: "Không quan trọng & Không khẩn cấp"
    };
    
    return (
        <div  className={`flex justify-center  ${inter.className} gap-2 p-1 text-sm rounded-md border-2 ${priorityClasses[type]}`}> {priorityLabels[type]}</div>
    );
}

export default PriorityLevel;