"use client";

import { useState } from "react";
import { Session, TimeLine } from "../_components";


const DailySchedulePage = () => {

    const [activeTime, setActiveTime] = useState<null | string>(null);

    return <div className="flex gap-7 h-full">
        <TimeLine activeTime={activeTime} setActiveTime={setActiveTime} />
        <div className="flex-1">
            <Session afternoonTasks={[]} eveningTasks={[]} nightTasks={[]} midnightTasks={[]} morningTasks={[]} session={activeTime || undefined} />
        </div>
         </div>;
}

export default DailySchedulePage;