"use client";

import { useState } from "react";
import { DaySection } from "../../_constant/common";
import { Session, TimeLine } from "./_components";
import { Title } from "../../_components/title";


const DailySchedulePage = () => {

    const [activeTime, setActiveTime] = useState<DaySection | null>(null);

    return (
        <div className="flex gap-7 h-full">
            <TimeLine activeTime={activeTime} setActiveTime={setActiveTime} />
            <div className="flex-1">
                <Title>Lịch Trình Hằng Ngày</Title>
                <Session afternoonTasks={[]} eveningTasks={[]} nightTasks={[]} midnightTasks={[]} morningTasks={[]} session={activeTime} />
            </div>
        </div>
    );
}

export default DailySchedulePage;