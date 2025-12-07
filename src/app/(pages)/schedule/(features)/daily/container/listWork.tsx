import { useAxios } from "@/hooks";
import { worksApiUrl } from "@/api/work";
import { AppSearch } from "@/components/common";
import { WorkCardListModel } from "../_models/type";
import { useEffect, useMemo } from "react";
import useToastState from "@/hooks/useToasts";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { DownIcon, FilterIcon } from "@/components/icon";
import UpsertSchedule from "./upsertWork";
import { Session } from "../_components";
import { DaySection } from "../../../_constant/common";

interface ListWorkProps {
    activeTime: DaySection | null;
}

const ListWork = ({ activeTime }: ListWorkProps) => {
    const searchParams = useSearchParams();

    const listParams = useMemo(() => {
        const entries = [...searchParams.entries()].filter(([key]) => key !== "mode" && key !== "id");
        return Object.fromEntries(entries);
    }, [searchParams]);
    const { data, error, refetch, loading } = useAxios<WorkCardListModel>({
        method: "GET",
        url: worksApiUrl.getWork,
        params: { ...listParams },
    });
    const { setToast } = useToastState();

    useEffect(() => {
        if (error) {
            setToast({
                title: "Lỗi hệ thống",
                message: "Không thể tải dữ liệu lịch làm việc",
                variant: "error",
                closeable: false
            });
        }
    }, [error]);
    return (<>
        <div className="flex justify-between mb-3">
            <div><AppSearch className="flex-2s" placeholder="Tìm kiếm Theo tên, danh mục, mô tả ngắn" /></div>
            <div>
                <Button className="bg-null text-white hover:bg-null"> <FilterIcon />  Filter<DownIcon /></Button>
            </div>
        </div>
        <UpsertSchedule refetch={refetch} />
        <div>
            <Session morningTasks={data?.morning} afternoonTasks={data?.noon} eveningTasks={data?.afternoon} nightTasks={data?.night} midnightTasks={data?.evening} session={activeTime} />
        </div>
    </>);
}

export default ListWork;