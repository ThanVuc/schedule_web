'use client';
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { ThreeDotVertical } from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent } from "@/components/ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSortable } from '@dnd-kit/react/sortable';
import { useRouter, useSearchParams } from "next/navigation";
import { FormatDateShort } from "@/utils/timeFormat";
import { useEnumMap } from "@/hooks/useEnumMap";

interface BoardItemProps {
    id: string;
    index: number;
    title: string;
    state: number;
    name: string;
    number: number;
    date?: string;
    column: string;
    disable?: boolean;
    avatar?: string;
}

const BoardItem = ({ id, index, title, state, name, number, date, column, disable, avatar }: BoardItemProps) => {
    const { ref, isDragging } = useSortable({
        id,
        index,
        type: 'item',
        accept: 'item',
        group: column
    });
  const searchParams = useSearchParams();
  const router = useRouter();
  const handlePageQueryToModal = (mode: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);
    if (id) {
      params.set("id", id)
    } else {
      params.delete("id");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }
    return (
        <Card
            ref={ref}
            className={`gap-3 bg-[#1A2332] rounded-2xl border-1 p-3 mb-3 text-sm w-80 border-[#2A3A4F] transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'} cursor-default hover:cursor-pointer`}
        >
            <CardContent className=" p-0 ">
                <div className="flex items-start justify-between gap-2">
                    <p
                    onClick={()=>{handlePageQueryToModal(ModelType.UPDATE, id)}}
                    className="min-w-0 flex-1 overflow-hidden break-words leading-5 line-clamp-2 hover:text-blue-500"
                    >{title}</p>
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button className=" w-2 p-0 bg-transparent text-white hover:bg-[#2A3A4F]">
                                <ThreeDotVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent  >
                            <DropdownMenuItem disabled={disable} className="cursor-pointer hover:bg-[#F8AF18] hover:text-[#FFFFFF] data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-[#FFFFFF]"
                            onClick={()=>{handlePageQueryToModal(ModelType.ASSIGN, id)}}
                            >
                                Phân công
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={disable} className="text-[#EF4444] cursor-pointer hover:bg-[#F8AF18] hover:text-[#FFFFFF] data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-[#FFFFFF]"
                            onClick={()=>{handlePageQueryToModal(ModelType.DELETE, id)}}
                            >
                                Xoá công việc
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className={`p-1 w-max text-xs rounded-lg ${state === 1 ? "bg-[#FFFFFF]/90 text-black px-3" : state === 2 ? "bg-[#2A97EA] text-black px-3" : state === 3 ? "bg-[#F8AF18] text-black px-3" : "bg-[#00FF4C] text-black px-3"}`}>
                    {useEnumMap(state, "WORK_STATUS")}
                </div>
                <div className="mt-2 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={avatar} alt={avatar} />
                            <AvatarFallback className="bg-blue-500">{name.split('@')[0].charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span title={name.split('@')[0]}>{name.split('@')[0].length > 20 ? name.split('@')[0].substring(0, 20) + "..." : name.split('@')[0]}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <div className="border-[#2A3A4F] border-2 p-1 px-2 rounded-lg">{number}</div>
                        <div className="text-xs text-gray-400">{FormatDateShort(date)}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default BoardItem;