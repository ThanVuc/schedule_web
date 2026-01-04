"use client";
import { AppPagination, AppSearch } from "@/components/common";
import { useEffect, useMemo, useState } from "react";
import GoalCard from "../_components/goalCard";
import { useAxios, useToastState } from "@/hooks";
import GoalApiUrl from "@/api/goal";
import { GoalsResponse } from "../_models/type/goalCard.type";
import Spinner from "@/components/common/spinner";
import { DeleteGoal } from "./deleteGoal";
import UpsertGoal from "./upsertGoal";
import { FilterIcon, TargetIcon } from "@/components/icon";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui";
import { WorkLabelModel } from "../../daily/_models/type";
import LabelApiUrl from "@/api/label";
import { LabelType } from "../_constant/common";
import { useRouter, useSearchParams } from "next/navigation";


export const ListGoal = () => {

    const searchParams = useSearchParams();
    const router = useRouter();
    const listParams = useMemo(() => {
        const entries = [...searchParams.entries()].filter(([key]) => key !== "mode" && key !== "id");
        return Object.fromEntries(entries);
    }, [searchParams]);

    const { data: statusLabelData } = useAxios<{ labels: WorkLabelModel[] }>(
        {
            method: "GET",
            url: `${LabelApiUrl.getListLabels}/${LabelType.LabelStatus}`,
        },
        []
    );

    const [isLoading, setIsLoading] = useState(true);

    const { data, error, loading, refetch } = useAxios<GoalsResponse>({
        method: "GET",
        url: GoalApiUrl.getListGoals,
        params: { ...listParams },
    });

    const { setToast } = useToastState();

    useEffect(() => {
        if (data && isLoading) {
            setIsLoading(false);
        }
    }, [data, isLoading]);

    useEffect(() => {
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể tải danh sách mục tiêu",
                variant: "error"
            });
        }
    }, [error]);

    const handleFilterStatus = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete("status_id");
        } else {
            params.set("status_id", value);
        }
        const queryString = params.toString();
        router.replace(`/schedule/goal?${queryString}`, { scroll: false });
    }

    const view = useMemo(() => {
        const goals = data?.items ?? [];
        const page = data?.page ?? 1;
        const page_size = data?.page_size ?? 10;
        const totalPages = data?.total_pages ?? 1;
        const hasNext = data?.has_next ?? false;
        const hasPrev = data?.has_prev ?? false;
        const totalGoals = data?.total_goals ?? 0;

        return { goals, page, pageSize: page_size, totalPages, hasNext, hasPrev, totalGoals };
    }, [data]);

    if (loading && isLoading) {
        return <div className="flex justify-center h-screen items-center"><Spinner /></div>
    }


    return (
        <>
            <div className="h-full flex justify-between w-full py-4">
                <AppSearch
                    key="search-goal"
                    className="flex-2"
                    placeholder="Tìm kiếm theo tên mục tiêu"
                />
                <div className="flex gap-2">
                    <Select
                        value={searchParams.get("status_id") ?? "all"}
                        onValueChange={(value) => handleFilterStatus(value)}>
                        <SelectTrigger className="w-[180px]">
                            <FilterIcon className="size-4 mr-2" />
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Trạng thái</SelectLabel>
                                <SelectItem key="all" value="all">Tất cả</SelectItem>
                                {
                                    statusLabelData?.labels.map((status) => (
                                        <SelectItem
                                            key={status.id}
                                            value={status.id}
                                        >{status.name}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col w-full gap-4">
                {loading && (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                )}
                {!loading && view.goals.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <TargetIcon className="size-8" />
                        <h3 className="text-xl font-semibold text-gray-400">
                            Không có mục tiêu nào
                        </h3>
                        <p className="text-gray-500 text-center max-w-md">
                            {listParams.search
                                ? `Không tìm thấy mục tiêu nào với từ khóa "${listParams.search}"`
                                : listParams.status_id
                                    ? `Chưa có mục tiêu nào với trạng thái "${statusLabelData?.labels.find(s => s.id === listParams.status_id)?.name || 'này'}"`
                                    : "Chưa có mục tiêu nào được tạo. Hãy tạo mục tiêu đầu tiên của bạn!"
                            }
                        </p>
                    </div>
                )}
                {!loading && view.goals.length > 0 && view.goals.map((goal) => (
                    <GoalCard
                        GoalCard={goal}
                        key={goal.id}
                    />
                ))}
                {!loading && view.totalPages > 1 && (
                    <AppPagination
                        page={view.page}
                        total_pages={view.totalPages}
                        has_next={view.hasNext}
                        has_prev={view.hasPrev}
                        size={view.pageSize}
                    />
                )}
            </div>
            <DeleteGoal refetch={refetch} />
            <UpsertGoal refetch={refetch} />

        </>
    );
};
