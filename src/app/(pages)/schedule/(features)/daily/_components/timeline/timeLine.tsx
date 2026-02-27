"use client";

import {
  CloudIcon,
  MoonIcon,
  MorningIcon,
  StarIcon,
  SunIcon,
  CloudyNightIcon,
} from "@/components/icon";
import { Button } from "@/components/ui";
import { useEffect, useState } from "react";
import styles from "./timeLine.module.css";
import { DaySection } from "@/app/(pages)/schedule/_constant/common";

interface TimeLineProps {
  activeTime: DaySection | null;
  setActiveTime: (time: DaySection | null) => void;
}

const SECTION_TIME: Record<DaySection, { start: number; end: number }> = {
  [DaySection.NIGHT]: { start: 0, end: 240 },            // 00:00 - 04:00
  [DaySection.EARLY_MORNING]: { start: 240, end: 480 }, // 04:00 - 08:00
  [DaySection.MORNING]: { start: 480, end: 720 },       // 08:00 - 12:00
  [DaySection.AFTERNOON]: { start: 720, end: 960 },     // 12:00 - 16:00
  [DaySection.EVENING]: { start: 960, end: 1200 },      // 16:00 - 20:00
  [DaySection.LATE_EVENING]: { start: 1200, end: 1440 } // 20:00 - 24:00
};


const SECTION_INDEX: Record<DaySection, number> = {
  [DaySection.NIGHT]: 0,
  [DaySection.EARLY_MORNING]: 1,
  [DaySection.MORNING]: 2,
  [DaySection.AFTERNOON]: 3,
  [DaySection.EVENING]: 4,
  [DaySection.LATE_EVENING]: 5,
};


const TimeLine = ({ activeTime, setActiveTime }: TimeLineProps) => {
  const ButtonActive =
    "border-2 p-5 w-15 h-15 rounded-full bg-[#0B1120] hover:scale-[1.1] hover:bg-[#0B1120] border-blue-400 text-white";
  const timeLineTitle = "absolute right-10 text-xs font-semibold";
  const timeLineHour = "absolute left-10 w-22 text-xs font-semibold";

  const [percent, setPercent] = useState(0);
  const [highlight, setHighlight] = useState<DaySection | null>(null);

  useEffect(() => {
    const updateHighlight = () => {
      const minutes = new Date().getHours() * 60 + new Date().getMinutes();

      if (minutes < 240) setHighlight(DaySection.NIGHT);
      else if (minutes < 480) setHighlight(DaySection.EARLY_MORNING);
      else if (minutes < 720) setHighlight(DaySection.MORNING);
      else if (minutes < 960) setHighlight(DaySection.AFTERNOON);
      else if (minutes < 1200) setHighlight(DaySection.EVENING);
      else setHighlight(DaySection.LATE_EVENING);
    };

    updateHighlight();
    const timer = setInterval(updateHighlight, 60_000);
    return () => clearInterval(timer);

  }, []);
  useEffect(() => {
    if (!highlight) return;

    const updatePosition = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const { start, end } = SECTION_TIME[highlight];
      const sectionIndex = SECTION_INDEX[highlight];
      const minutesIntoSection = minutes - start;
      const sectionDuration = end - start;
      const sectionPercent = Math.max(
        0,
        Math.min(1, minutesIntoSection / sectionDuration)
      );

      const TOTAL_SECTION = Object.keys(SECTION_INDEX).length;

      const globalPercent =
        sectionIndex * (100 / TOTAL_SECTION) +
        sectionPercent * (100 / TOTAL_SECTION);



      setPercent(globalPercent);
    };

    updatePosition();
    const timer = setInterval(updatePosition, 60_000);
    return () => clearInterval(timer);
  }, [highlight]);

  const handleTimeClick = (section: DaySection) => {
    setActiveTime(activeTime === section ? null : section);
  };

  const items = [
    {
      key: DaySection.NIGHT,
      label: "Đêm",
      hour: "00:00 - 04:00",
      icon: <CloudyNightIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-midnight_2s_infinite_ease-in-out]",
    },
    {
      key: DaySection.EARLY_MORNING,
      label: "Sáng sớm",
      hour: "04:00 - 08:00",
      icon: <MoonIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-purple_2s_infinite_ease-in-out]",
    },
    {
      key: DaySection.MORNING,
      label: "Sáng",
      hour: "08:00 - 12:00",
      icon: <MorningIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-blue_2s_infinite_ease-in-out]",
    },
    {
      key: DaySection.AFTERNOON,
      label: "Chiều",
      hour: "12:00 - 16:00",
      icon: <SunIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-yellow_2s_infinite_ease-in-out]",
    },
    {
      key: DaySection.EVENING,
      label: "Tối",
      hour: "16:00 - 20:00",
      icon: <CloudIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-red_2s_infinite_ease-in-out]",
    },
    {
      key: DaySection.LATE_EVENING,
      label: "Khuya",
      hour: "20:00 - 00:00",
      icon: <StarIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-midnight_2s_infinite_ease-in-out]",
    },
  ];


  const bgFilter = "!bg-[#CED0D2] text-black";
  const bgHighlight =
    "bg-[#2A97EA] animate-[glow-blue_2s_infinite_ease-in-out] hover:bg-[#2A97EA] text-black";

  return (
    <div className="pr-8">
      <div className="relative flex flex-col gap-30 items-center h-full">
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] bg-blue-500 h-300" />
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] h-300 bg-blue-500">
          <div
            className={styles.progress}
            style={{ height: `${percent}%` }}
          />
        </div>
        {items.map((item) => (
          <div
            key={item.key}
            className="flex flex-col gap-2 items-center relative z-2"
          >
            <Button
              className={`${ButtonActive}
                ${activeTime === item.key ? bgFilter : ""}
                ${highlight === item.key ? bgHighlight : ""}
                ${item.glow}`}
              onClick={() => handleTimeClick(item.key)}
            >
              {item.icon}
            </Button>
            <div className="text-white">
              <p className={timeLineTitle}>{item.label}</p>
              <p className={timeLineHour}>{item.hour}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
