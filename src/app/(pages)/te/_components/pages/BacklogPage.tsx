'use client';

import { H3 } from "@/components/common";
import { AddIcon } from "@/components/icon";
import { Button } from "@/components/ui";
import CardBacklog from "../features/group/backlog/CardBacklog";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../_hooks";
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { CreateBacklogDialog } from "../features/group/backlog/container/CreateBacklog";
import { UpdateBacklogDrawerPage } from "../features/group/backlog/container/UpdateBacklogDrawerPage";
import { DeleteBacklogDialog } from "../features/group/backlog/container/DeleteBacklog";
import { AddToSprintWorkBoardDialog } from "../features/group/backlog/container/AddToSprint";
import { AssignBacklogDialog } from "../features/group/backlog/container/AssignBacklog";

const STATIC_BACKLOG_LIST = [
    {
        id: "work-001",
        title: "Thiết kế giao diện trang lịch",
        state: 1,
        name: "Nguyen Van A",
        number: 3,
        date: "23/03/2026",
    },
    {
        id: "work-002",
        title: "Tích hợp API phân quyền",
        state: 2,
        name: "Tran Thi B",
        number: 5,
        date: "25/03/2026",
    },
    {
        id: "work-003",
        title: "Kiểm thử chức năng thông báo",
        state: 3,
        name: "Le Van C",
        number: 2,
        date: "28/03/2026",
    },
];

const BacklogPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { mode } = useModalParams();
    const openDialogCreate = mode === ModelType.CREATE;
    const openDialogDelete = mode === ModelType.DELETE;
    const openDialogAssign = mode === ModelType.ASSIGN;
    const openDialogAddToSprint = mode === ModelType.ADDSPRINT;
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
        <div className="p-4">
            <CreateBacklogDialog
                onConfirm={() => { }}
                open={openDialogCreate}
            />
            <DeleteBacklogDialog
                onOpenChange={closeModal}
                open={openDialogDelete}
            />
            <AddToSprintWorkBoardDialog
                onOpenChange={closeModal}
                open={openDialogAddToSprint}
            />
            <AssignBacklogDialog
                onOpenChange={closeModal}
                open={openDialogAssign}
                onConfirm={() => { }}
            />
            <UpdateBacklogDrawerPage />


            <div className="flex justify-between">
                <H3 className="font-bold">BackLog</H3>
                <Button className="bg-[#2A97EA] hover:bg-[#2A97EA]/80"
                    onClick={() => { handlePageQueryToModal(ModelType.CREATE) }}
                >
                    <AddIcon />
                    CreateWork
                </Button>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2">
                {STATIC_BACKLOG_LIST.map((item) => (
                    <CardBacklog
                        key={item.id}
                        id={item.id}
                        date={item.date}
                        name={item.name}
                        number={item.number}
                        state={item.state}
                        title={item.title}
                    />
                ))}
            </div>
        </div>
    </>);
}

export default BacklogPage;