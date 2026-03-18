'use client';
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { ThreeDotVertical } from "@/components/icon";
import { Button, Card, CardContent } from "@/components/ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSortable } from '@dnd-kit/react/sortable';
import { useRouter, useSearchParams } from "next/navigation";

interface BoardItemProps {
    id: string;
    index: number;
    title: string;
    state: number;
    name: string;
    number: number;
    date?: string;
    column: string;
}

const BoardItem = ({ id, index, title, state, name, number, date, column }: BoardItemProps) => {
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

    router.push(`/te/group/work?${params.toString()}`, { scroll: false });
  }
    return (
        <Card
            ref={ref}
            className={`gap-3 bg-[#1A2332] rounded-2xl border-1 p-3 text-sm m-3 w-80 border-[#2A3A4F] transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'} cursor-default hover:cursor-pointer`}
        >
            <CardContent className="  p-0 ">
                <div className="flex justify-between items-center gap-2">
                    <p className=" hover:text-blue-500 "
                    onClick={()=>{handlePageQueryToModal(ModelType.UPDATE, id)}}
                    >{title}</p>
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button className=" w-2 p-0 bg-transparent text-white hover:bg-[#2A3A4F]">
                                <ThreeDotVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent >
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#F8AF18] hover:text-[#FFFFFF] data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-[#FFFFFF]"
                            onClick={()=>{handlePageQueryToModal(ModelType.ASSIGN, id)}}
                            >
                                Cấp quyền
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[#EF4444] cursor-pointer hover:bg-[#F8AF18] hover:text-[#FFFFFF] data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-[#FFFFFF]"
                            onClick={()=>{handlePageQueryToModal(ModelType.DELETE, id)}}
                            >
                                Xoá công việc
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className={`p-1 w-max text-xs rounded-lg ${state === 1 ? "" : state === 2 ? "bg-[#2A97EA] text-black" : state === 3 ? "bg-[#F8AF18] text-black" : ""}`}>
                    {state}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <div>
                        {name}
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="border-[#2A3A4F] border-2 p-1 px-2 rounded-lg">{number}</div>
                        {date}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default BoardItem;