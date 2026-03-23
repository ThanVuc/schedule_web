'use client';
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { ThreeDotVertical } from "@/components/icon";
import { Button, Card, CardContent } from "@/components/ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";

interface CardBacklogProps {
    id: string;
    title: string;
    state: number;
    name: string;
    number: number;
    date: string;
    avatar?: string;

}

const CardBacklog = ({ id, title, state, name, number, date, avatar }: CardBacklogProps) => {

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
            className={`gap-3 bg-[#1A2332] rounded-2xl border-1 p-3 text-sm m-2 border-[#2A3A4F] transition-opacity cursor-default hover:cursor-pointer`}
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
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#F8AF18] hover:text-[#FFFFFF] data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-[#FFFFFF]"
                            onClick={()=>{handlePageQueryToModal(ModelType.ADDSPRINT, id)}}
                            >
                                Thêm vào sprint
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
                    <div className="flex items-center gap-2">
                        {avatar ? (
                            <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#2A97EA] flex items-center justify-center text-white font-bold">
                                {name.charAt(0)}
                            </div>
                        )}
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

 
export default CardBacklog;