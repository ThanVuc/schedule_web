import { JSX} from "react";
import { WorkCardModel } from "../../models/workCard.model";
import WorkCard from "../workCard";

interface SessionBlockProps {
  icon: JSX.Element;
  title: string;
  time: string;
  tasks: WorkCardModel[];
}
const SessionBlock = ({icon,title,time,tasks}: SessionBlockProps) => {

  return (
    <div className="flex flex-col gap-5 border-t-2 border-b-2 py-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center border-2 border-[#2A97EA] rounded-full h-10 w-10">
          {icon}
        </div>
        <div className="text-xs font-bold">
          <p>{title}</p>
          <p>{time}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 ">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <WorkCard key={task.id} workCard={task} />
          ))
        ) : (
          <div className="flex items-center justify-center text-sm italic text-slate-400">
            <p>không có công việc trong khoảng thời gian này</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionBlock;