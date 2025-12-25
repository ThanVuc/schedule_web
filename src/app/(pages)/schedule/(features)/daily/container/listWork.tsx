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
import { DaySection, DaySectionText } from "../../../_constant/common";

interface ListWorkProps {
    activeTime: DaySection | null;
}

const ListWork = ({ activeTime }: ListWorkProps) => {
    const searchParams = useSearchParams();

    const listParams = useMemo(() => {
        const entries = [...searchParams.entries()].filter(([key]) => key !== "mode" && key !== "id");
        return Object.fromEntries(entries);
    }, [searchParams]);
    const { data, error, refetch } = useAxios<WorkCardListModel>({
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

    const getSessionFromDate = (timestamp: number): DaySectionText => {
        const date = new Date(timestamp);
        const hour = date.getHours();

        if (hour >= 0 && hour < 10) return DaySectionText.MORNING;   
        if (hour >= 10 && hour < 14) return DaySectionText.NOON;        
        if (hour >= 14 && hour < 18) return DaySectionText.AFTERNOON;   
        if (hour >= 18 && hour < 22) return DaySectionText.NIGHT;      
        return DaySectionText.EVERNIGHT;                              
    };

    const works = data?.works ?? [];

    const sessionData = useMemo(() => {
        const morning: typeof works = [];
        const noon: typeof works = [];
        const afternoon: typeof works = [];
        const night: typeof works = [];
        const evernight: typeof works = [];

        works.forEach((w) => {
            const section = getSessionFromDate(w.start_date);
            switch (section) {
                case DaySectionText.MORNING:
                    morning.push(w);
                    break;
                case DaySectionText.NOON:
                    noon.push(w);
                    break;
                case DaySectionText.AFTERNOON:
                    afternoon.push(w);
                    break;
                case DaySectionText.NIGHT:
                    night.push(w);
                    break;
                case DaySectionText.EVERNIGHT:
                    evernight.push(w);
                    break;
            }
        });

        return { morning, noon, afternoon, night, evernight };
    }, [data]);
    return (<>
        <div className="flex justify-between mb-3">
            <div><AppSearch className="flex-2s" placeholder="Tìm kiếm Theo tên, danh mục, mô tả ngắn" /></div>
            <div>
                <Button className="bg-null text-white hover:bg-null"> <FilterIcon />  Filter<DownIcon /></Button>
            </div>
        </div>
        <UpsertSchedule refetch={refetch} />
        <div>
            <Session morningTasks={sessionData?.morning} afternoonTasks={sessionData?.noon} eveningTasks={sessionData?.afternoon} nightTasks={sessionData?.night} midnightTasks={sessionData?.evernight} session={activeTime} />
        </div>
    </>);
}

export default ListWork;