import { useAxios } from "@/hooks";
import SelectLabel from "./selectLabel";
import { useState } from "react";
import { WorkLabelModel } from "../(features)/daily/_models/type";
import { LabelApiUrl } from "@/api/label";

interface LabelProps {
    label: string;
    keyIcon: string;
    color: string;
    width?: string;
    height?: string;
    label_type: number;
    classNameContentLabel?: string;
    onchange?: (value: string) => void;
}

export const LabelCategory = ({ label, keyIcon, color, width, height, label_type, classNameContentLabel, onchange }: LabelProps) => {
    const [OpenSelector, setOpenSelector] = useState(false);

    const { data, refetch } = useAxios<{ labels: WorkLabelModel[] }>(
        {
            method: "GET",
            url: `${LabelApiUrl.getListLabels}/${label_type}`,
        },
        [OpenSelector],
        !OpenSelector
    );

    const handleOpenLabel = () => {
        setOpenSelector(!OpenSelector);
        if (refetch) refetch();
    };
    const currentLabel = {
        label, keyIcon, color: color || "#ffffff", width: width ?? "4", height: height ?? "4",
    };

    return (
        <div className="flex">
            <SelectLabel
                onchangeValue={onchange}
                label={currentLabel}
                Open={OpenSelector}
                onOpenChange={handleOpenLabel}
                data={data?.labels ?? []}
                classNameContent={classNameContentLabel}
            />
        </div>
    );
};
