import { CloudIcon, MoonIcon, MorningIcon, StarIcon, SunIcon } from "@/components/icon";
import SessionBlock from "./blockSession";
import { useEffect, useState } from "react";
import { DaySection } from "../../../../_constant/common";
import { WorkCardModel } from "../../_models/type";
interface SessionProps {
  morningTasks?: WorkCardModel[];
  afternoonTasks?: WorkCardModel[];
  eveningTasks?: WorkCardModel[];
  nightTasks?: WorkCardModel[];
  midnightTasks?: WorkCardModel[];
  session?: DaySection | null;
  loading?: boolean;
}

const Session = ({ morningTasks = [], afternoonTasks = [], eveningTasks = [], nightTasks = [], midnightTasks = [], session, loading = false }: SessionProps) => {
  const [activeSession, setActiveSession] = useState<DaySection | null>(null);
  useEffect(() => {
    setActiveSession(session || null);
  }, [session]);
  return (
    <div className="flex flex-col gap-10">

      {
        (activeSession === DaySection.MORNING || activeSession === null) && (<SessionBlock loading={loading} icon={<MorningIcon className="!w-6 !h-6" />} title="Sáng" time="0:00 - 10:00" tasks={morningTasks} />)
      }
      {
        (activeSession === DaySection.AFTERNOON || activeSession === null) && (<SessionBlock loading={loading} icon={<SunIcon className="!w-6 !h-6" />} title="Trưa" time="10:00 - 14:00" tasks={afternoonTasks} />)
      }
      {
        (activeSession === DaySection.EVENING || activeSession === null) && (<SessionBlock loading={loading} icon={<CloudIcon className="!w-6 !h-6" />} title="Chiều" time="14:00 - 18:00" tasks={eveningTasks} />)
      }

      {
        (activeSession === DaySection.NIGHT || activeSession === null) && (<SessionBlock loading={loading} icon={<MoonIcon className="!w-6 !h-6" />} title="Tối" time="18:00 - 22:00"  tasks={nightTasks} />)
      }

      {
        (activeSession === DaySection.MIDNIGHT || activeSession === null) && (<SessionBlock loading={loading} icon={<StarIcon className="!w-6 !h-6" />} title="Khuya" time="22:00 - 24:00" tasks={midnightTasks} />)
      }

    </div>
  );
};

export default Session;
