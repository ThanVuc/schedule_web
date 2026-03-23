'use client';
import { Button, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { BoardWork } from "../features/group/work/index";
import { AddIcon } from "@/components/icon";
import { DrawerPage } from ".";
import { CreateWorkBoardDialog } from "../features/group/work/container/CreateWorkBoard";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../_hooks";
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { DeleteWorkBoardDialog } from "../features/group/work/container/DeleteWorkBoard";
import { AssignWorkBoardDialog } from "../features/group/work/container/AssignWorkBoard";


const BoardWorkPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { mode} = useModalParams();
    const openDialogCreate = mode === ModelType.CREATE;
    const openDialogDelete = mode === ModelType.DELETE;
    const openDialogAssign = mode === ModelType.ASSIGN;
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
    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`/te/group/work?${params.toString()}`, { scroll: false });
    }
    return (<>
        <CreateWorkBoardDialog
            onConfirm={() => { }}
            open={openDialogCreate}
        />
        <DeleteWorkBoardDialog
            onOpenChange={closeModal}
            open={openDialogDelete}
        />
        <AssignWorkBoardDialog
            onConfirm={() => { }}
            onOpenChange={closeModal}
            open={openDialogAssign}
        />
        <div className="flex justify-between items-center mb-13">
            <div className="flex items-center  gap-15">
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
            <Button className="mb-4 bg-[#2A97EA] border-[#2A97EA] hover:bg-[#0c6ab2] text-white"
                onClick={() => handlePageQueryToModal(ModelType.CREATE)}
            >
                <AddIcon />
                Thêm công việc
            </Button>
        </div>
        <div>
            <BoardWork />
            <DrawerPage />
        </div>
    </>);
}

export default BoardWorkPage;