"use client";

import { useState } from "react";
import { DaySection } from "../../_constant/common";
import { Session, TimeLine } from "./_components";
import { Title } from "../../_components/title";
import { AddIcon, DateIcon, DownIcon, FilterIcon, FourStarIcon, LoopIcon } from "@/components/icon";
import { Button } from "@/components/ui";
import { AppSearch } from "@/components/common";


const DailySchedulePage = () => {
    const [activeTime, setActiveTime] = useState<DaySection | null>(null);
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
                        <Button className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/80 text-white"> <AddIcon />  Tạo Lịch</Button>
                        <Button className="bg-[#14B8A6] hover:bg-[#14B8A6]/80 text-white"> <LoopIcon />  Khôi Phục</Button>
                        <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#D946EF] hover:to-[#8B5CF6] text-white"> <FourStarIcon />  AI Tạo Lịch</Button>
                    </div>
                </div>
                <div className="flex justify-between mb-3">
                    <div><AppSearch className="flex-2s" placeholder="Tìm kiếm Theo tên, danh mục, mô tả ngắn" /></div>
                    <div>
                        <Button className="bg-null text-white hover:bg-null"> <FilterIcon />  Filter<DownIcon /></Button>
                    </div>
                </div>
                <div>
                    <Session afternoonTasks={[]} eveningTasks={[]} nightTasks={[]} midnightTasks={[]} morningTasks={[]} session={activeTime} />
                </div>
            </div>
        </div>
    );
}

export default DailySchedulePage;