'use client';
import { ThreeDots } from "@/components/icon";
import { useEffect, useState } from "react";
import { WorkLabel } from "../../../_components";
import { ILabelGroup } from "../_models/type/label.type";
import axios from "axios";

export const CardTypeLabel = () => {
    const [labels, setLabel] = useState<ILabelGroup[]>([])
    useEffect(() => {
        axios.get<ILabelGroup[]>('https://qa-api.eplatform.online/api/v1/labels/label-per-types')
            .then((res) => {
                setLabel(res.data)
            }).catch((err) => {
                console.log(err)
            });
    }, [])
    const typeConfig: Record<number, { name: string; title: string }> = {
        1: { name: "Loại công việc", title: "Phân loại các công việc trong hệ thống" },
        2: { name: "Trạng thái", title: "Trạng thái các công việc trong hệ thống" },
        3: { name: "Độ khó", title: "Đánh giá mức độ phức tạp và khó khăn của công việc" },
        4: { name: "Độ ưu tiên", title: "Được quy định theo ma trận Eisenhower" },
        5: { name: "Danh mục", title: "Danh mục các công việc" },
        6: { name: "Bản nháp", title: "Lưu tạm thời các công việc trong hệ thống" }
    };
    const [openGroups, setOpenGroups] = useState<number[]>([]);
    const handleClick = (groupType: number) => {
        setOpenGroups(prev => {
            if (prev.includes(groupType)) {
                return prev.filter(g => g !== groupType);
            } else {
                return [...prev, groupType];
            }
        });
    };
    return (
        <div className="flex flex-col gap-4">
            {labels.map(group => {
                const config = typeConfig[group.type] || { name: "Unknown", title: "Không xác định" };
                const isOpen = openGroups.includes(group.type);
                return (
                    <div key={group.type} className="py-2 px-2">
                        <div className="flex flex-col rounded-[10px] border border-[#3C414D] bg-[#232936] p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold px-2">{config.name}</span>
                                <ThreeDots
                                    className={`cursor-pointer ${isOpen ? 'text-blue-400' : ''}`}
                                    onClick={() => handleClick(group.type)}
                                />
                            </div>
                            <p className="px-2 pt-4 text-md">
                                {config.title}
                            </p>
                            {isOpen && (
                                <div className="px py-4 gap-y-6 flex gap-[2%] flex-wrap">
                                    {group.labels.map(label => (
                                        <div
                                            key={label.id}
                                            className="px-6 py-4 rounded-[10px] border border-[#3C414D] w-full sm:w-[48%] md:w-[32%]"
                                        >
                                            <span className="flex pb-2">
                                                <WorkLabel
                                                    key={label.label_type}
                                                    label={label.name}
                                                    icon={label.key}
                                                    color={label.color}
                                                />
                                            </span>
                                            <div className="pt-4 text-[0.8rem] space-y-1">
                                                <p className="font-bold">Ý nghĩa:</p>
                                                <p className="text-[#CECFD2]">{label.meaning}</p>
                                                <p className="font-bold pt-4">Ghi chú:</p>
                                                <p className="text-[#CECFD2]">{label.note}</p>
                                            </div>
                                        </div>
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