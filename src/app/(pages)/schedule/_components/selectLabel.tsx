import { useState } from "react";
import { useLabelIcon } from "@/hooks";
import { WorkLabelModel } from "../(features)/daily/_models/type";
import Label from "./label";
import { BackIcon } from "@/components/icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";
interface SelectLabelProps {
  Open: boolean;
  onOpenChange?: (open: boolean) => void;
  data: WorkLabelModel[];
  classNameContent?: string;
  label: {
    label: string;
    keyIcon: string;
    color: string;
    width: string;
    height: string;
  };
  onclick?: () => void;
  onchangeValue?: (value: string) => void;
  disable?: boolean;
  onchangeObject?: (value: string) => void;
}
const SelectWorkLabel = ({
  Open, onOpenChange, data, classNameContent, label, onclick, onchangeValue, disable, onchangeObject,
}: SelectLabelProps) => {
  const [selected, setSelected] = useState(label);
  const IconComponent = useLabelIcon(selected.keyIcon);

  const formatColor = (color: string) => {
    if (color.startsWith("#")) {
      return `${color}20`;
    }
    return color;
  };
  return (
    <Select
      open={Open}
      onOpenChange={onOpenChange}
      value={selected.label}
      onValueChange={(value) => {
        const newLabel = data.find((x) => x.name === value);
        if (newLabel) {
          setSelected({ label: newLabel.name, keyIcon: newLabel.key, color: newLabel.color, width: label.width, height: label.height, });
        }
        if (onchangeValue) onchangeValue(newLabel?.id || "");
        if (onchangeObject) onchangeObject(newLabel?.key || "");
      }}
    >
      <SelectTrigger className="border-0 p-0 bg-transparent [&>svg]:hidden disabled:opacity-100 disabled:cursor-not-allowed" disabled={disable}>
        <SelectValue>
          <div
            className="flex w-full justify-center gap-2 p-1.5 text-sm rounded-md border-2 items-center"
            style={{
              color: selected.color,
              backgroundColor: formatColor(selected.color),
              borderColor: selected.color,
            }}
          >
            {IconComponent && (
              <IconComponent
                className={`!w-${selected.width} !h-${selected.height}`}
                style={{ color: selected.color }}
              />
            )}
            {selected.label}
          </div>
        </SelectValue>
      </SelectTrigger>
      {
        Open && (<BackIcon className="!w-4 !h-4" />)
      }
      <SelectContent
        side="right"
        className={cn("!w-full ml-3", classNameContent)}
      >
        <SelectGroup className="flex flex-col items-center w-full">
          {data.map((item) => (
            <SelectItem key={item.id} value={item.name} onClick={onclick}>
              <Label
                className="min-w-[7rem] max-w-[9rem] text-center"
                label={item.name}
                color={item.color}
                icon={item.key}
              />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectWorkLabel;
