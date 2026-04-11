'use client';
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { ThreeDotVertical } from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent } from "@/components/ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEnumMap } from "@/hooks/useEnumMap";
import { FormatDateShort } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface CardBacklogProps {
    id: string;
    title: string;
    state: number;
    avatar: string;
    assignee: string;
    number: number;
    date?: string;
}

const CardBacklog = ({ id, title, state, assignee, number, date }: CardBacklogProps) => {

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
            className={`gap-3 bg-[#1A2332] rounded-2xl border-1 p-3 text-sm m-2 border-[#2A3A4F] transition-opacity cursor-default hover:cursor-pointer`}
        >
            <CardContent className="  p-0 ">
                <div className="flex justify-between items-center gap-2">
                    <p className=" hover:text-blue-500 "
                        onClick={() => { handlePageQueryToModal(ModelType.UPDATE, id) }}
                    >{title}</p>
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button className=" w-2 p-0 bg-transparent text-white hover:bg-[#2A3A4F]">
                                <ThreeDotVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent >
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#F8AF18] hover:text-[#FFFFFF] data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-[#FFFFFF]"
                                onClick={() => { handlePageQueryToModal(ModelType.ASSIGN, id) }}
                            >
                                Gán công việc
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#F8AF18] hover:text-[#FFFFFF] data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-[#FFFFFF]"
                                onClick={() => { handlePageQueryToModal(ModelType.ADDSPRINT, id) }}
                            >
                                Thêm vào sprint
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[#EF4444] cursor-pointer hover:bg-[#F8AF18] hover:text-[#FFFFFF] data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-[#FFFFFF]"
                                onClick={() => { handlePageQueryToModal(ModelType.DELETE, id) }}
                            >
                                Xoá công việc
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className={`p-1 w-max text-xs rounded-lg ${state === 1 ? "" : state === 2 ? "bg-[#2A97EA] text-black" : state === 3 ? "bg-[#F8AF18] text-black" : ""}`}>
                    {useEnumMap(state, "WORK_STATUS")}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={assignee} alt={assignee} />
                            <AvatarFallback className="bg-blue-500 m-0">{assignee.split('@')[0].charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span title={assignee.split('@')[0]}>{assignee.split('@')[0].length > 20 ? assignee.split('@')[0].substring(0, 20) + "..." : assignee.split('@')[0]}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="border-[#2A3A4F] border-2 p-1 px-2 rounded-lg">{number}</div>
                        {FormatDateShort(date)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default CardBacklog;