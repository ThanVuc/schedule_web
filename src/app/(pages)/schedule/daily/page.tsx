"use client";

import { useState } from "react";
import { Session, TimeLine } from "../_components";
import { DaySection } from "../constant/common";


const DailySchedulePage = () => {

    const [activeTime, setActiveTime] = useState<DaySection | null>(null);

    return <div className="flex gap-7 h-full">
        <TimeLine activeTime={activeTime} setActiveTime={setActiveTime} />
        <div className="flex-1">
            <Session afternoonTasks={[]} eveningTasks={[]} nightTasks={[]} midnightTasks={[]} morningTasks={[]} session={activeTime} />
        </div>
         </div>;
}

export default DailySchedulePage;