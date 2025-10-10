"use client";

import { CloudIcon, MoonIcon, MorningIcon, StarIcon, SunIcon } from "@/components/icon";
import { Button } from "@/components/ui";
import { useEffect, useState } from "react";
import styles from "./timeLine.module.css";

interface TimeLineProps {
  activeTime: string | null;
  setActiveTime: (time: string | null) => void;
}

const TimeLine = ({ activeTime, setActiveTime }: TimeLineProps) => {
  const ButtonActive =
    "border-2 p-5 w-15 h-15 rounded-full bg-[#0B1120] hover:scale-120 hover:bg-[#0B1120] border-blue-400 text-white";
  const timeLineTitle = "absolute right-10 text-xs font-semibold";
  const timeLineHour = "absolute left-10 w-22 text-xs font-semibold";
  const [percent, setPercent] = useState(0);
  const [highlight, setHighlight] = useState<null | string>(null);


  useEffect(() => {
    const updateHighlight = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour <= 10) setHighlight("morning");
      else if (hour >= 11 && hour <= 14) setHighlight("afternoon");
      else if (hour >= 15 && hour <= 18) setHighlight("evening");
      else if (hour >= 19 && hour <= 22) setHighlight("night");
      else setHighlight("midnight");
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


  const handleMorningClick = () => {
    setActiveTime(activeTime === "morning" ? null : "morning");
  };

  const handleAfternoonClick = () => {
    setActiveTime(activeTime === "afternoon" ? null : "afternoon");
  };

  const handleEveningClick = () => {
    setActiveTime(activeTime === "evening" ? null : "evening");
  };

  const handleNightClick = () => {
    setActiveTime(activeTime === "night" ? null : "night");
  };

  const handleMidnightClick = () => {
    setActiveTime(activeTime === "midnight" ? null : "midnight");
  };

  const items = [
    {
      key: "morning",
      label: "Sáng",
      hour: "6:00-10:00",
      icon: <MorningIcon className="!w-11 !h-20 " />,
      glow: "hover:animate-[glow-blue_2s_infinite_ease-in-out]",
      onClick: handleMorningClick,
    },
    {
      key: "afternoon",
      label: "Trưa",
      hour: "11:00-14:00",
      icon: <SunIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-yellow_2s_infinite_ease-in-out]",
      onClick: handleAfternoonClick,
    },
    {
      key: "evening",
      label: "Chiều",
      hour: "15:00-18:00",
      icon: <CloudIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-red_2s_infinite_ease-in-out]",
      onClick: handleEveningClick,
    },
    {
      key: "night",
      label: "Tối",
      hour: "19:00-22:00",
      icon: <MoonIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-purple_2s_infinite_ease-in-out]",
      onClick: handleNightClick,
    },
    {
      key: "midnight",
      label: "Khuya",
      hour: "23:00-5:00",
      icon: <StarIcon className="!w-11 !h-20" />,
      glow: "hover:animate-[glow-midnight_2s_infinite_ease-in-out]",
      onClick: handleMidnightClick,
    },
  ];
  const percentStep = Math.max(0, Math.min(100, Math.round(percent / 5) * 5));
  const bgFilter = "!bg-[#CED0D2] text-black";
  const bgHighlight =
    "bg-[#2A97EA] animate-[glow-blue_2s_infinite_ease-in-out] hover:bg-[#2A97EA] text-black";

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
