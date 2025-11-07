import { AppPagination } from "@/components/common";
import { GoalCardModel } from "../_models/type/goalCard";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import GoalCard from "./goalCard";




export const ListGoal = () => {

    const dataGoals: GoalCardModel[] = [
        {
            id: "1",
            title: "Học React nâng cao",
            start_time: "2025-10-01T08:00:00",
            end_time: "2025-11-01T18:00:00",
            category: {
                id: "c1",
                name: "Học tập",
                icon: "📘",
                color: "#00C8FF",
                key: "study",
                label_type: 1,
            },
            shortDescription: "Ôn lại toàn bộ React Hook, Context và tối ưu hiệu suất.",
            labels: [
                { id: "l1", name: "Frontend", icon: "💻", color: "#FFA500", key: "frontend", label_type: 2 },
                { id: "l2", name: "UI/UX", icon: "🎨", color: "#FF4D4D", key: "design", label_type: 3 },
            ],
        },
        {
            id: "2",
            title: "Tối ưu hoá codebase",
            start_time: "2025-11-05T08:00:00",
            end_time: "2025-11-20T18:00:00",
            category: {
                id: "c2",
                name: "Công việc",
                icon: "💼",
                color: "#8BC34A",
                key: "work",
                label_type: 2,
            },
            shortDescription: "Refactor code, cải thiện performance và cấu trúc thư mục.",
            labels: [
                { id: "l3", name: "Clean Code", icon: "🧹", color: "#00BCD4", key: "clean", label_type: 3 },
                { id: "l4", name: "Optimization", icon: "⚡", color: "#FFC107", key: "opt", label_type: 4 },
            ],
        },
        {
            id: "3",
            title: "Rèn luyện thể dục",
            start_time: "2025-10-10T06:00:00",
            end_time: "2025-10-31T07:00:00",
            category: {
                id: "c3",
                name: "Sức khỏe",
                icon: "🏋️",
                color: "#FF9800",
                key: "health",
                label_type: 5,
            },
            shortDescription: "Tập gym 3 buổi/tuần và chạy bộ cuối tuần.",
            labels: [
                { id: "l5", name: "Gym", icon: "💪", color: "#FF5722", key: "gym", label_type: 1 },
                { id: "l6", name: "Cardio", icon: "🏃", color: "#4CAF50", key: "cardio", label_type: 2 },
            ],
        },
        {
            id: "4",
            title: "Học React nâng cao",
            start_time: "2025-10-01T08:00:00",
            end_time: "2025-11-01T18:00:00",
            category: {
                id: "c1",
                name: "Học tập",
                icon: "📘",
                color: "#00C8FF",
                key: "study",
                label_type: 1,
            },
            shortDescription: "Ôn lại toàn bộ React Hook, Context và tối ưu hiệu suất.",
            labels: [
                { id: "l1", name: "Frontend", icon: "💻", color: "#FFA500", key: "frontend", label_type: 2 },
                { id: "l2", name: "UI/UX", icon: "🎨", color: "#FF4D4D", key: "design", label_type: 3 },
            ],
        },
        {
            id: "5",
            title: "Học React nâng cao",
            start_time: "2025-10-01T08:00:00",
            end_time: "2025-11-01T18:00:00",
            category: {
                id: "c1",
                name: "Học tập",
                icon: "📘",
                color: "#00C8FF",
                key: "study",
                label_type: 1,
            },
            shortDescription: "Ôn lại toàn bộ React Hook, Context và tối ưu hiệu suất.",
            labels: [
                { id: "l1", name: "Frontend", icon: "💻", color: "#FFA500", key: "frontend", label_type: 2 },
                { id: "l2", name: "UI/UX", icon: "🎨", color: "#FF4D4D", key: "design", label_type: 3 },
            ],
        },
        {
            id: "6",
            title: "Học React nâng cao",
            start_time: "2025-10-01T08:00:00",
            end_time: "2025-11-01T18:00:00",
            category: {
                id: "c1",
                name: "Học tập",
                icon: "📘",
                color: "#00C8FF",
                key: "study",
                label_type: 1,
            },
            shortDescription: "Ôn lại toàn bộ React Hook, Context và tối ưu hiệu suất.",
            labels: [
                { id: "l1", name: "Frontend", icon: "💻", color: "#FFA500", key: "frontend", label_type: 2 },
                { id: "l2", name: "UI/UX", icon: "🎨", color: "#FF4D4D", key: "design", label_type: 3 },
            ],
        },
    ];

    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("page_size") || "5", 10);

    const [goals, setGoals] = useState<GoalCardModel[]>(dataGoals);

    const paginationData = useMemo(() => {
        const totalGoals = goals.length;
        const totalPages = Math.ceil(totalGoals / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return {
            currentGoals: goals.slice(startIndex, endIndex),
            totalPages,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
        };
    }, [currentPage, pageSize, goals]);

    return (
        <div className="flex flex-col w-full gap-4">
            {paginationData.currentGoals.map((goal) => (
                <GoalCard GoalCard={goal} key={goal.id}
                />
            ))}
            {paginationData.totalPages > 1 && (
                <AppPagination
                    page={currentPage}
                    total_pages={paginationData.totalPages}
                    has_next={paginationData.hasNext}
                    has_prev={paginationData.hasPrev}
                    size={pageSize}
                />
            )}
        </div>
    );
};