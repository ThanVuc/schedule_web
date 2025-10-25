import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkLabelModel } from "../(features)/daily/_models/type";
import Label from "./label";
import { BackIcon } from "@/components/icon";

interface SelectLabelProps {
  Open: boolean;
  onOpenChange?: (open: boolean) => void;
  data: WorkLabelModel[];
}

const SelectLabel = ({ Open, onOpenChange, data }: SelectLabelProps) => {
  return (
    <DropdownMenu open={Open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <div></div>
      </DropdownMenuTrigger>
            <div className="mt-2"><BackIcon className="!w-4 !h-4"/></div>
      <DropdownMenuContent side="right">
        <DropdownMenuGroup>
          {data.map(data => (
            <DropdownMenuItem className="flex flex-col items-center justify-center" key={data.id}><Label label={data.name} color={data.color} icon={data.key}/></DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectLabel;
