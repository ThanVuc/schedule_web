import { useAxios, useLabelIcon } from "@/hooks";
import SelectLabel from "./selectLabel";
import { useState } from "react";
import { WorkLabelModel } from "../(features)/daily/_models/type";
import { LabelApiUrl } from "@/api/label";

interface LabelProps {
  label: string;
  icon: string;
  color: string;
  width?: string;
  height?: string;
  label_type: number;
}

export const WorkCategory = ({ label, icon, color, width, height,label_type }: LabelProps) => {
  const IconComponent = useLabelIcon(icon);
      const [OpenSelector, setOpenSelector] = useState(false);
      const { data, refetch } = useAxios<{ labels: WorkLabelModel[] }>({
              method: "GET",
              url: `${LabelApiUrl.getListLabels}/${label_type}`,
              
          }, [OpenSelector], !OpenSelector);
      const handleOpenLabel = () => {
          setOpenSelector(!OpenSelector);
          if (refetch) {
              refetch();
          }
      }
  return (
       <div className="flex">
            <div
                className="flex justify-center gap-2 p-1.5 text-sm rounded-md border-2 items-center"
                style={{
                    color: color,
                    backgroundColor: `${color}20`,
                    borderColor: color,
                }}
                onClick={handleOpenLabel}
            >
                {IconComponent && <IconComponent className={`!w-${width} !h-${height}`} />}
                {label}
            </div>
            <div>
                {OpenSelector && (
                    <SelectLabel
                        Open={OpenSelector}
                        onOpenChange={setOpenSelector}
                        data={data ? data.labels : []}
                    />
                )}
            </div>
       </div>
  );
};
