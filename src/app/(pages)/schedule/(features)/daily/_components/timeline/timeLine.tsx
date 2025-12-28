"use client";

import {
  CloudIcon,
  MoonIcon,
  MorningIcon,
  StarIcon,
  SunIcon,
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
  [DaySection.MORNING]: { start: 0, end: 600 },
  [DaySection.AFTERNOON]: { start: 600, end: 840 },
  [DaySection.EVENING]: { start: 840, end: 1080 },
  [DaySection.NIGHT]: { start: 1080, end: 1320 },
  [DaySection.MIDNIGHT]: { start: 1320, end: 1440 },
};

const SECTION_INDEX: Record<DaySection, number> = {
  [DaySection.MORNING]: 0,
  [DaySection.AFTERNOON]: 1,
  [DaySection.EVENING]: 2,
  [DaySection.NIGHT]: 3,
  [DaySection.MIDNIGHT]: 4,
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

      if (minutes >= 0 && minutes < 600)
        setHighlight(DaySection.MORNING);
      else if (minutes >= 600 && minutes < 840)
        setHighlight(DaySection.AFTERNOON);
      else if (minutes >= 840 && minutes < 1080)
        setHighlight(DaySection.EVENING);
      else if (minutes >= 1080 && minutes < 1320)
        setHighlight(DaySection.NIGHT);
      else
        setHighlight(DaySection.MIDNIGHT);
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

      const sectionPercent =
        ((minutes - start) / (end - start)) * 100;
      const safePercent = Math.max(0, Math.min(100, sectionPercent));

      const sectionHeight = 100 / 5;
      const globalPercent =
        sectionIndex * sectionHeight +
        (safePercent / 100) * sectionHeight;
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
      key: DaySection.MORNING,
      label: "Sáng",
      hour: "0:00 - 10:00",
      icon: <MorningIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-blue_2s_infinite_ease-in-out]",
    },
    {
      key: DaySection.AFTERNOON,
      label: "Trưa",
      hour: "10:00 - 14:00",
      icon: <SunIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-yellow_2s_infinite_ease-in-out]",
    },
    {
      key: DaySection.EVENING,
      label: "Chiều",
      hour: "14:00 - 18:00",
      icon: <CloudIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-red_2s_infinite_ease-in-out]",
    },
    {
      key: DaySection.NIGHT,
      label: "Tối",
      hour: "18:00 - 22:00",
      icon: <MoonIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-purple_2s_infinite_ease-in-out]",
    },
    {
      key: DaySection.MIDNIGHT,
      label: "Khuya",
      hour: "22:00 - 24:00",
      icon: <StarIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-midnight_2s_infinite_ease-in-out]",
    },
  ];

  const percentStep = Math.max(0, Math.min(100, Math.round(percent / 5) * 5));

  const bgFilter = "!bg-[#CED0D2] text-black";
  const bgHighlight =
    "bg-[#2A97EA] animate-[glow-blue_2s_infinite_ease-in-out] hover:bg-[#2A97EA] text-black";

  return (
    <div className="pr-8">
      <div className="relative flex flex-col gap-45 items-center h-full">
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] bg-blue-500 h-300" />
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] h-300 bg-blue-500">
          <div
            className={`${styles.progress} ${styles[`p-${percentStep}`]}`}
          />
        </div>

        {items.map((item) => (
          <div
            key={item.key}
            className="flex flex-col gap-2 items-center relative z-10"
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
