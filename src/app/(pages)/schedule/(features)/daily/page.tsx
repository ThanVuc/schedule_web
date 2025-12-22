"use client";

import { useState } from "react";
import { DaySection } from "../../_constant/common";
import { TimeLine } from "./_components";
import { Title } from "../../_components/title";
import { AddIcon, DateIcon, FourStarIcon, LoopIcon } from "@/components/icon";
import { Button } from "@/components/ui";

import { useRouter, useSearchParams } from "next/navigation";
import ListWork from "./container/listWork";


const DailySchedulePage = () => {
    const [activeTime, setActiveTime] = useState<DaySection | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const handlePageQueryToModal = (mode: string, id?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", mode);
        if (id) {
            params.set("id", id)
        } else {
            params.delete("id");
        }

        router.push(`/schedule/daily?${params.toString()}`, { scroll: false });
    }
    return (
        <div className="flex gap-7 h-full">
            <TimeLine activeTime={activeTime} setActiveTime={setActiveTime} />
            <div className="flex-1">
                <div className="block md:flex justify-between space-between mb-5">
                    <div className="flex gap-2 p-3">
                        <Title>Lịch Trình Hằng Ngày</Title>
                        <DateIcon />
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white"
                            onClick={() => { handlePageQueryToModal("create") }}
                        > <AddIcon />  Tạo Lịch</Button>
                        <Button className="bg-[#14B8A6] hover:bg-[#14B8A6]/80 text-white"> <LoopIcon />  Khôi Phục</Button>
                        <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#D946EF] hover:to-[#8B5CF6] text-white"> <FourStarIcon />  AI Tạo Lịch</Button>
                    </div>
                </div>
                <ListWork activeTime={activeTime} />
            </div>
        </div>
    );
}

export default DailySchedulePage;