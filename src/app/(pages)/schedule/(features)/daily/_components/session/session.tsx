import { CloudIcon, CloudyNightIcon, MoonIcon, MorningIcon, StarIcon, SunIcon } from "@/components/icon";
import SessionBlock from "./blockSession";
import { useEffect, useState } from "react";
import { DaySection } from "../../../../_constant/common";
import { WorkCardModel } from "../../_models/type";
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
        (activeSession === DaySection.NIGHT || activeSession === null) && (<SessionBlock loading={loading} icon={<CloudyNightIcon className="!w-6 !h-6" />} title="Đêm" time="00:00 - 04:00" tasks={nightTasks} />)
      }
      {
        (activeSession === DaySection.EARLY_MORNING || activeSession === null) && (<SessionBlock loading={loading} icon={<MoonIcon className="!w-6 !h-6" />} title="Sáng sớm" time="04:00 - 08:00" tasks={earlyMorningTasks} />)
      }
      {
        (activeSession === DaySection.MORNING || activeSession === null) && (<SessionBlock loading={loading} icon={<MorningIcon className="!w-6 !h-6" />} title="Sáng" time="08:00 - 12:00" tasks={morningTasks} />)
      }
      {
        (activeSession === DaySection.AFTERNOON || activeSession === null) && (<SessionBlock loading={loading} icon={<SunIcon className="!w-6 !h-6" />} title="Chiều" time="12:00 - 16:00" tasks={afternoonTasks} />)
      }
      {
        (activeSession === DaySection.EVENING || activeSession === null) && (<SessionBlock loading={loading} icon={<CloudIcon className="!w-6 !h-6" />} title="Tối" time="16:00 - 20:00" tasks={eveningTasks} />)
      }
      {
        (activeSession === DaySection.LATE_EVENING || activeSession === null) && (<SessionBlock loading={loading} icon={<StarIcon className="!w-6 !h-6" />} title="Khuya" time="22:00 - 00:00" tasks={lateEveningTasks} />)
      }
    </div>
  );
};

export default Session;
