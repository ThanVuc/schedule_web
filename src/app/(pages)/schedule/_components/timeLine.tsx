"use client";

import { CloudIcon, MoonIcon, MorningIcon, StarIcon, SunIcon } from "@/components/icon";
import { Button } from "@/components/ui";
import { useEffect, useState } from "react";
import styles from "./timeLine.module.css";
import { DaySection } from "../constant/common";

interface TimeLineProps {
  activeTime: DaySection | null;
  setActiveTime: (time: DaySection | null) => void;
}

const TimeLine = ({ activeTime, setActiveTime }: TimeLineProps) => {
  const ButtonActive = "border-2 p-5 w-15 h-15 rounded-full bg-[#0B1120] hover:scale-120 hover:bg-[#0B1120] border-blue-400 text-white";
  const timeLineTitle = "absolute right-10 text-xs font-semibold";
  const timeLineHour = "absolute left-10 w-22 text-xs font-semibold";
  const [percent, setPercent] = useState(0);
  const [highlight, setHighlight] = useState<null | DaySection>(null);

  useEffect(() => {
    const updateHighlight = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour <= 10) setHighlight(DaySection.MORNING);
      else if (hour >= 11 && hour <= 14) setHighlight(DaySection.AFTERNOON);
      else if (hour >= 15 && hour <= 18) setHighlight(DaySection.EVENING);
      else if (hour >= 19 && hour <= 22) setHighlight(DaySection.NIGHT);
      else setHighlight(DaySection.MIDNIGHT);
    };
    updateHighlight();
    const timer = setInterval(updateHighlight, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const minutesFromSix = (minutes - 6 * 60 + 1440) % 1440;
      const percentOfCycle = (minutesFromSix / 1440) * 100;
      setPercent(percentOfCycle);
    };

    updatePosition();
    const timer = setInterval(updatePosition, 60 * 1000);
    return () => clearInterval(timer);
  }, []);


  const handleTimeClick = (section: DaySection) => {
  setActiveTime(activeTime === section ? null : section);
};

  const items = [
    {
      key: DaySection.MORNING,
      label: "Sáng",
      hour: "6:00-10:00",
      icon: <MorningIcon className="!w-11 !h-20 " />,
      glow: "hover:animate-[glow-blue_2s_infinite_ease-in-out]",
      onClick: () => handleTimeClick(DaySection.MORNING),
    },
    {
      key: DaySection.AFTERNOON,
      label: "Trưa",
      hour: "11:00-14:00",
      icon: <SunIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-yellow_2s_infinite_ease-in-out]",
      onClick: () => handleTimeClick(DaySection.AFTERNOON),
    },
    {
      key: DaySection.EVENING,
      label: "Chiều",
      hour: "15:00-18:00",
      icon: <CloudIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-red_2s_infinite_ease-in-out]",
      onClick: () => handleTimeClick(DaySection.EVENING),
    },
    {
      key: DaySection.NIGHT,
      label: "Tối",
      hour: "19:00-22:00",
      icon: <MoonIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-purple_2s_infinite_ease-in-out]",
      onClick: () => handleTimeClick(DaySection.NIGHT),
    },
    {
      key: DaySection.MIDNIGHT,
      label: "Khuya",
      hour: "23:00-5:00",
      icon: <StarIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-midnight_2s_infinite_ease-in-out]",
      onClick: () => handleTimeClick(DaySection.MIDNIGHT),
    },
  ];
  const percentStep = Math.max(0, Math.min(100, Math.round(percent / 5) * 5));
  const bgFilter = "!bg-[#CED0D2] text-black";
  const bgHighlight = "bg-[#2A97EA] animate-[glow-blue_2s_infinite_ease-in-out] hover:bg-[#2A97EA] text-black";
  return (
    <div className="pr-8">
      <div className="relative flex flex-col gap-30 items-center h-full">
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] bg-blue-500 h-250" />
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] h-250 bg-blue-500">
          <div className={`${styles.progress} ${styles[`p-${percentStep}`]}`} />
        </div>

        {items.map((item) => (
          <div
            key={item.key}
            className="flex flex-col gap-2 items-center relative z-10"
          >
            <Button
              className={`${ButtonActive} ${activeTime === item.key ? bgFilter : ""
                } ${highlight === item.key ? bgHighlight : ""} 
                 ${item.glow}`}
              onClick={item.onClick}
            >
              {item.icon}
            </Button>
            <div className="flex gap-6 text-white">
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
