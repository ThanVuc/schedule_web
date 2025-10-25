'use client';
import { ThreeDot } from "@/components/icon";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui";
import { useAxios } from "@/hooks";
import Label from "../../../_components/label";
import { Metadata, LabelPerType } from "../_models/type";
import LabelApiUrl from "@/api/label";

export const CardTypeLabel = () => {
    const typeConfig: Record<number, { name: string; title: string }> = {
        1: { name: "Loại công việc", title: "Phân loại các công việc trong hệ thống" },
        2: { name: "Trạng thái", title: "Trạng thái các công việc trong hệ thống" },
        3: { name: "Độ khó", title: "Đánh giá mức độ phức tạp và khó khăn của công việc" },
        4: { name: "Độ ưu tiên", title: "Được quy định theo ma trận Eisenhower" },
        5: { name: "Danh mục", title: "Danh mục các công việc" },
        6: { name: "Bản nháp", title: "Lưu tạm thời các công việc trong hệ thống" }
    };
    const [openGroups, setOpenGroups] = useState<number[]>([]);
    const { data, error, loading } = useAxios<Metadata>({
        method: "GET",
        url: LabelApiUrl.getInformationLabels
    });
    const groups = useMemo<LabelPerType[]>(() => {
        return data?.label_per_types ?? [];
    }, [data]);

    if (loading) return (loading)
    if (error) return (error)
    if (!data) return null;

    return (
        <div className="flex flex-col gap-4">
            {groups.map(group => {
                const config = typeConfig[group.type] || { name: "Unknown", title: "Không xác định" };
                const isOpen = openGroups.includes(group.type);

                return (
                    <div key={group.type} className="py-2 px-2">
                        <div className="flex flex-col rounded-[10px] border border-[#3C414D] bg-[#232936] p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold px-2">{config.name}</span>
                                <ThreeDot
                                    className={`cursor-pointer ${isOpen ? 'text-blue-400' : ''}`}
                                    onClick={() =>
                                        setOpenGroups(prev =>
                                            prev.includes(group.type)
                                                ? prev.filter(g => g !== group.type)
                                                : [...prev, group.type]
                                        )
                                    }
                                />
                            </div>

                            <p className="px-2 pt-4 text-md">{config.title}</p>

                            {isOpen && (
                                <div className="px py-4 gap-y-6 flex gap-[2%] flex-wrap">
                                    {group.labels.map(label => (
                                        <Card
                                            key={label.id}
                                            className="px-6 py-4 rounded-[10px] border bg-transparent border-[#3C414D] w-full sm:w-[48%] md:w-[32%]"
                                        >
                                            <span className="flex">
                                                <Label
                                                    label={label.name}
                                                    icon={label.key}
                                                    color={label.color}
                                                    widthIcon={4}
                                                    textSize="[0.8rem]"
                                                />
                                            </span>
                                            <div className="text-[0.8rem] space-y-1">
                                                <p className="font-bold">Ý nghĩa:</p>
                                                <p className="text-[#CECFD2]">{label.meaning}</p>
                                                <p className="font-bold pt-4">Ghi chú:</p>
                                                <p className="text-[#CECFD2]">{label.note}</p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};