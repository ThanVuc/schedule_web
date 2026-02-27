import { useAlertDialog, useAxios, useAxiosMutation, useConfirmDialog } from "@/hooks";
import { worksApiUrl } from "@/api/work";
import { AppAlertDialog, AppSearch } from "@/components/common";
import { WorkCardListModel } from "../_models/type";
import { useEffect, useMemo, useState } from "react";
import useToastState from "@/hooks/useToasts";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { SaveIcon, TrashIcon } from "@/components/icon";
import UpsertSchedule from "./upsertWork";
import { Session } from "../_components";
import { DaySection, DaySectionText } from "../../../_constant/common";
import Recovery from "./recovery";
import GenerateWorkAI from "./generateWorkAI";
import { RefetchProvider } from "../_components/refetchContext";

interface ListWorkProps {
    activeTime: DaySection | null;
}

const ListWork = ({ activeTime }: ListWorkProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { dialog } = useConfirmDialog();
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const { alertDialogProps, setAlertDialogProps } = useAlertDialog();
    const listParams = useMemo(() => {
        const entries = [...searchParams.entries()].filter(([key]) => key !== "mode" && key !== "id");
        return Object.fromEntries(entries);
    }, [searchParams]);
    const { setToast } = useToastState();
    const { data, error, refetch } = useAxios<WorkCardListModel>({
        method: "GET",
        url: worksApiUrl.getWork,
        params: { ...listParams },
    });
    const { sendRequest: acceptWork } = useAxiosMutation({
        method: "POST",
        url: worksApiUrl.acceptWorkDraft,
        headers: {
            "Content-Type": "application/json"
        }
    });
    const { sendRequest: deleteWorkDraft } = useAxiosMutation({
        method: "DELETE",
        url: worksApiUrl.deleteWorkDraft,
        headers: {
            "Content-Type": "application/json"
        }
    });

    useEffect(() => {
        const vietnamOffset = 7 * 60 * 60 * 1000;
        const nowUTC = new Date();
        const nowVietnam = new Date(nowUTC.getTime() + vietnamOffset);
        const startOfDayVietnam = new Date(Date.UTC(
            nowVietnam.getUTCFullYear(),
            nowVietnam.getUTCMonth(),
            nowVietnam.getUTCDate(),
            0, 0, 0, 0
        ));
        const endOfDayVietnam = new Date(Date.UTC(
            nowVietnam.getUTCFullYear(),
            nowVietnam.getUTCMonth(),
            nowVietnam.getUTCDate(),
            23, 59, 59, 999
        ));
        const startOfDayUTC = startOfDayVietnam.getTime() - vietnamOffset;
        const endOfDayUTC = endOfDayVietnam.getTime() - vietnamOffset;

        const params = new URLSearchParams(searchParams.toString());
        params.set("start_date", startOfDayUTC.toString());
        params.set("end_date", endOfDayUTC.toString());

        router.push(`/schedule/daily?${params.toString()}`, { scroll: false });
    }, [data]);

    const DraftWorks = data?.works?.filter((work) => work.draft?.key === "DRAFT") || [];
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
        <AppAlertDialog
            title={alertDialogProps.title}
            description={alertDialogProps.description}
            open={openAlertDialog}
            setOpen={setOpenAlertDialog}
            submitText={alertDialogProps.submitText}
            onSubmit={() => alertDialogProps.onSubmit?.()}
        />
        <div className="flex justify-between mb-3">
            <div><AppSearch className="flex-2" placeholder="Tìm kiếm Theo tên và danh mục" /></div>
        </div>
        {DraftWorks.length > 0 && (<div className="flex justify-end gap-2 mb-3 animate-slide-in">
            <Button className=" bg-[#FF4848]/20 border-2 border-[#FF4848] text-[#FF4848] hover:bg-[#FF4848]/40"
                onClick={() => {
                    setAlertDialogProps({
                        title: "Xác nhận Xoá tất cả công việc",
                        description: "Bạn có chắc chắn muốn xoá tất cả công việc?",
                        submitText: "Xoá",
                        onSubmit: async () => {
                            deleteWorkDraft();
                            setToast({
                                title: "Xoá Công việc",
                                message: "Xoá thành công",
                                variant: "success",
                            });
                            if (refetch) {
                                refetch();
                            }
                        },
                        open: true,
                        setOpen: setOpenAlertDialog,
                    });
                    setOpenAlertDialog(true);
                }}
            > <TrashIcon /> Huỷ tất cả</Button>
            <Button
                className="bg-[#00FF00]/20 border-2 border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/40"
                onClick={() => {
                    setAlertDialogProps({
                        title: "Xác nhận lưu công việc",
                        description: "Bạn có chắc chắn muốn lưu tất cả công việc?",
                        submitText: "Lưu",
                        onSubmit: async () => {
                            acceptWork()
                            setToast({
                                title: "Lưu công việc",
                                message: "Lưu thành công",
                                variant: "success",
                            });
                            if (refetch) {
                                refetch();
                            }
                        },
                        open: true,
                        setOpen: setOpenAlertDialog,
                    });
                    setOpenAlertDialog(true);
                }}
            >
                <SaveIcon /> Lưu tất cả
            </Button>
        </div>)}
        <UpsertSchedule refetch={refetch} />
        <Recovery refetch={refetch} />
        <GenerateWorkAI refetch={refetch} />
        <div>
            <RefetchProvider value={refetch}>
                <Session
                    morningTasks={sessionData?.morning}
                    earlyMorningTasks={sessionData?.earlyMorning}
                    afternoonTasks={sessionData?.afternoon}
                    eveningTasks={sessionData?.evening}
                    nightTasks={sessionData?.night}
                    lateEveningTasks={sessionData?.lateEvening}
                    session={activeTime}
                />
            </RefetchProvider>
            {dialog}
        </div>
    </>);
}

export default ListWork;