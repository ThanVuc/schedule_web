import { AppPagination } from "@/components/common";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import GoalCard from "./goalCard";
import { useAxios } from "@/hooks";
import GoalApiUrl from "@/api/goal";
import { GoalsResponse } from "../_models/type";


interface ListGoalProps {
    triggerRefetch?: number;
}

export const ListGoal: React.FC<ListGoalProps> = ({ triggerRefetch }) => {
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("page_size") || "5", 10);

    const { data, error, loading } = useAxios<GoalsResponse>({
        method: "GET",
        url: GoalApiUrl.getListGoals,
    }, [triggerRefetch]);

    const view = useMemo(() => {
        const goals = data?.items ?? [];
        const page = data?.page ?? currentPage;
        const page_size = data?.page_size ?? pageSize;
        const totalPages = data?.total_pages ?? 1;
        const hasNext = data?.has_next ?? false;
        const hasPrev = data?.has_prev ?? false;
        const totalGoals = data?.total_goals ?? 0;

        return { goals, page, pageSize: page_size, totalPages, hasNext, hasPrev, totalGoals };
    }, [data, currentPage, pageSize]);



    if (loading) {
        return (
            <div className="w-full p-4 text-sm text-gray-500">
                Đang tải danh sách mục tiêu...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 text-sm text-red-500">
                Có lỗi khi tải dữ liệu mục tiêu.
            </div>
        );
    }

    if (!view.goals.length) {
        return (
            <div className="w-full p-4 text-sm text-gray-500">
                Chưa có mục tiêu nào.
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col w-full gap-4">
                {view.goals.map((goal) => (
                    <GoalCard
                        GoalCard={goal}
                        key={goal.id}
                    />
                ))}

                {view.totalPages > 1 && (
                    <AppPagination
                        page={view.page}
                        total_pages={view.totalPages}
                        has_next={view.hasNext}
                        has_prev={view.hasPrev}
                        size={view.pageSize}
                    />
                )}
            </div>


        </>
    );
};