import { Button, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { BoardWork } from "./index";
import { AddIcon } from "@/components/icon";

const BoardWorkPage = () => {
    return (<>
        <div className="flex justify-between items-center mb-20">
            <div className="flex items-center  gap-20">
                <h1 className="text-2xl font-bold mb-4">Bảng công việc</h1>
                <div className="flex gap-4">
                    <Select defaultValue="AllSprint">
                        <SelectTrigger >
                            <SelectValue placeholder="Lọc theo Sprint" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="AllSprint">All Sprint</SelectItem>
                                <SelectItem value="sprint1">Sprint 1</SelectItem>
                                <SelectItem value="sprint2">Sprint 2</SelectItem>
                                <SelectItem value="sprint3">Sprint 3</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="AllAssign">
                        <SelectTrigger >
                            <SelectValue placeholder="Lọc theo người thực hiện" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="AllAssign">Tất cả người thực hiện</SelectItem>
                                <SelectItem value="Assign1">Người thực hiện 1</SelectItem>
                                <SelectItem value="Assign2">Người thực hiện 2</SelectItem>
                                <SelectItem value="Assign3">Người thực hiện 3</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button className="mb-4 bg-[#2A97EA] border-[#2A97EA] hover:bg-[#0c6ab2] text-white">
                <AddIcon />
                Thêm công việc
            </Button>
        </div>
        <div>
            <BoardWork />
        </div>
    </>);
}

export default BoardWorkPage;