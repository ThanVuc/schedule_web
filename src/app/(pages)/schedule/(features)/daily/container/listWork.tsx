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
import Recovery from "./recovery";

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

        if (hour >= 0 && hour < 4) return DaySectionText.NIGHT;
        if (hour >= 4 && hour < 8) return DaySectionText.EARLY_MORNING;
        if (hour >= 8 && hour < 12) return DaySectionText.MORNING;
        if (hour >= 12 && hour < 16) return DaySectionText.AFTERNOON;
        if (hour >= 16 && hour < 20) return DaySectionText.EVENING;
        return DaySectionText.LATE_EVENING;
    };

    const works = data?.works ?? [];

    const sessionData = useMemo(() => {
        const night: typeof works = [];
        const earlyMorning: typeof works = [];
        const morning: typeof works = [];
        const afternoon: typeof works = [];
        const evening: typeof works = [];
        const lateEvening: typeof works = [];

        works.forEach((w) => {
            const section = getSessionFromDate(w.start_date);
            switch (section) {
                case DaySectionText.NIGHT:
                    night.push(w);
                    break;
                case DaySectionText.EARLY_MORNING:
                    earlyMorning.push(w);
                    break;
                case DaySectionText.MORNING:
                    morning.push(w);
                    break;
                case DaySectionText.AFTERNOON:
                    afternoon.push(w);
                    break;
                case DaySectionText.EVENING:
                    evening.push(w);
                    break;
                case DaySectionText.LATE_EVENING:
                    lateEvening.push(w);
                    break;
            }
        });

        return { morning, earlyMorning, afternoon, night, evening, lateEvening };
    }, [data]);
    return (<>
        <div className="flex justify-between mb-3">
            <div><AppSearch className="flex-2s" placeholder="Tìm kiếm Theo tên, danh mục, mô tả ngắn" /></div>
            <div>
                <Button className="bg-null text-white hover:bg-null"> <FilterIcon />  Filter<DownIcon /></Button>
            </div>
        </div>
        <UpsertSchedule refetch={refetch} />
        <Recovery refetch={refetch} />
        <div>
            <Session
                morningTasks={sessionData?.morning}
                earlyMorningTasks={sessionData?.earlyMorning}
                afternoonTasks={sessionData?.afternoon}
                eveningTasks={sessionData?.evening}
                nightTasks={sessionData?.night}
                lateEveningTasks={sessionData?.lateEvening}
                session={activeTime}
            />


        </div>
    </>);
}

export default ListWork;