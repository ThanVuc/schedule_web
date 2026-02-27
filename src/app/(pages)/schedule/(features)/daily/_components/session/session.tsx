import { CloudIcon, CloudyNightIcon, MoonIcon, MorningIcon, StarIcon, SunIcon } from "@/components/icon";
import SessionBlock from "./blockSession";
import { useEffect, useState } from "react";
import { DaySection } from "../../../../_constant/common";
import { WorkCardModel } from "../../_models/type";
import LazyLoad from "../lazyLoad";
interface SessionProps {
  nightTasks?: WorkCardModel[];
  earlyMorningTasks?: WorkCardModel[];
  morningTasks?: WorkCardModel[];
  afternoonTasks?: WorkCardModel[];
  eveningTasks?: WorkCardModel[];
  lateEveningTasks?: WorkCardModel[];
  session?: DaySection | null;
  loading?: boolean;
}

const Session = ({ morningTasks = [], afternoonTasks = [], eveningTasks = [], nightTasks = [], lateEveningTasks = [], earlyMorningTasks = [], session, loading = false }: SessionProps) => {
  const [activeSession, setActiveSession] = useState<DaySection | null>(null);
  useEffect(() => {
    setActiveSession(session || null);
  }, [session]);
  return (
    <div className="flex flex-col gap-10">

      {
        (activeSession === DaySection.NIGHT || activeSession === null) && (<LazyLoad><SessionBlock loading={loading} icon={<CloudyNightIcon className="!w-6 !h-6" />} title="Đêm" time="00:00 - 04:00" tasks={nightTasks} /></LazyLoad>)
      }
      {
        (activeSession === DaySection.EARLY_MORNING || activeSession === null) && (<LazyLoad><SessionBlock loading={loading} icon={<MoonIcon className="!w-6 !h-6" />} title="Sáng sớm" time="04:00 - 08:00" tasks={earlyMorningTasks} /></LazyLoad >)
      }
      {
        (activeSession === DaySection.MORNING || activeSession === null) && (<LazyLoad><SessionBlock loading={loading} icon={<MorningIcon className="!w-6 !h-6" />} title="Sáng" time="08:00 - 12:00" tasks={morningTasks} /></LazyLoad>)
      }
      {
        (activeSession === DaySection.AFTERNOON || activeSession === null) && (<LazyLoad><SessionBlock loading={loading} icon={<SunIcon className="!w-6 !h-6" />} title="Chiều" time="12:00 - 16:00" tasks={afternoonTasks} /></LazyLoad>)
      }
      {
        (activeSession === DaySection.EVENING || activeSession === null) && (<LazyLoad><SessionBlock loading={loading} icon={<CloudIcon className="!w-6 !h-6" />} title="Tối" time="16:00 - 20:00" tasks={eveningTasks} /></LazyLoad>)
      }
      {
        (activeSession === DaySection.LATE_EVENING || activeSession === null) && (<LazyLoad><SessionBlock loading={loading} icon={<StarIcon className="!w-6 !h-6" />} title="Khuya" time="20:00 - 00:00" tasks={lateEveningTasks} /></LazyLoad>)
      }
    </div>
  );
};

export default Session;
