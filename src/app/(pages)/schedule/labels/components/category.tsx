import { BookIcon, FamilyIcon, FinanceIcon, HealthIcon, PlantIcon, SocialIcon, TravelIcon, WorkIcon } from "@/components/icon";
import { Inter } from 'next/font/google';
import { cloneElement } from "react";

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
});

interface CategoryProps {
    type: "Work" | "Personal" | "Study" | "Family" | "Finance" | "Health" | "Social" | "Travel";
}

const Category = ({ type }: CategoryProps) => {
    const categories = {
        Work: { icon: <WorkIcon />, color: '#3B82F6', label: 'Công việc' },
        Personal: { icon: <PlantIcon />, color: '#22C55E', label: 'Cá nhân' },
        Study: { icon: <BookIcon />, color: '#A855F7', label: 'Học tập' },
        Family: { icon: <FamilyIcon />, color: '#FB923C', label: 'Gia đình' },
        Finance: { icon: <FinanceIcon />, color: '#FACC15', label: 'Tài chính' },
        Health: { icon: <HealthIcon />, color: '#F43F5E', label: 'Sức khoẻ' },
        Social: { icon: <SocialIcon />, color: '#06B6D4', label: 'Xã hội' },
        Travel: { icon: <TravelIcon />, color: '#06B6D4', label: 'Di chuyển' },
    };

    const { icon, color, label } = categories[type];

    return (
        <div className={`flex justify-center text-[${color}] ${inter.className} gap-2 p-0.5 text-sm rounded-md border-2 border-[${color}] bg-[${color}]/20`}>
            {cloneElement(icon, { className: "!w-4.5 !h-4.5" })}
            {label}
        </div>
    );
};
    
export default Category;