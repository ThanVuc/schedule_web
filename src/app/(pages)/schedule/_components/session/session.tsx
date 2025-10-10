import { CloudIcon, MoonIcon, MorningIcon, StarIcon, SunIcon } from "@/components/icon";
import { WorkCardModel } from "../../models/workCard.model";
import SessionBlock from "./blockSession";
import { useEffect, useState } from "react";

interface SessionProps {
  morningTasks?: WorkCardModel[];
  afternoonTasks?: WorkCardModel[];
  eveningTasks?: WorkCardModel[];
  nightTasks?: WorkCardModel[];
  midnightTasks?: WorkCardModel[];
  session?: string;

}

const Session = ({ morningTasks = [], afternoonTasks = [], eveningTasks = [], nightTasks = [], midnightTasks = [], session }: SessionProps) => {
  const [activeSession, setActiveSession] = useState<string | null>(null);
    useEffect(() => {
    setActiveSession(session || null);
  }, [session]);
  return (
    <div className="flex flex-col gap-10">

      {
        (activeSession === "morning" || activeSession === null) && (<SessionBlock icon={<MorningIcon className="!w-6 !h-6" />} title="Sáng" time="6:00 - 10:00" tasks={morningTasks} />)
      }
      {
      (activeSession === "afternoon" || activeSession === null) && (<SessionBlock icon={<SunIcon className="!w-6 !h-6" />} title="Trưa" time="10:00 - 14:00" tasks={afternoonTasks} />)
      }
      {
      (activeSession === "evening"|| activeSession === null) && (<SessionBlock icon={<CloudIcon className="!w-6 !h-6" />} title="Chiều" time="14:00 - 18:00" tasks={eveningTasks} />)
      }

      {
      (activeSession === "night" || activeSession === null) && (<SessionBlock icon={<MoonIcon className="!w-6 !h-6" />} title="Tối" time="18:00 - 22:00" tasks={nightTasks} />)
      }

      {
      (activeSession === "midnight" || activeSession === null) && (<SessionBlock icon={<StarIcon className="!w-6 !h-6" />} title="Đêm" time="22:00 - 2:00" tasks={midnightTasks} />)
      }

    </div>
  );
};

export default Session;
