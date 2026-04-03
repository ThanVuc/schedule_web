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
import { useAxios } from "@/hooks/useAxios";
import { boardWorksApiUrl } from "@/api/boardWork";
import { ListSimpleSprintResponse, ListSimpleUserResponse, WorkDetailResponse, WorkResponse } from "../../_models";
import { useEffect, useMemo, useState } from "react";
import { H1 } from "@/components/common";


const BoardWorkPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { mode, id } = useModalParams();
    const openDialogCreate = mode === ModelType.CREATE;
    const openDialogDelete = mode === ModelType.DELETE;
    const openDialogAssign = mode === ModelType.ASSIGN;
    const listParams = useMemo(() => {
        const entries = [...searchParams.entries()].filter(([key]) => key !== "mode" && key !== "id");
        return Object.fromEntries(entries);
    }, [searchParams]);
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
    const { data: GetListSprint, loading: loadingGetListSprint } = useAxios<{ items: ListSimpleSprintResponse[] }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetListSprint}2c9179a9-a279-4b26-851a-44e16b814d54/sprints/simple`,
        params: { ...listParams },
    }, [])
    const { data: GetListUser } = useAxios<{ items: ListSimpleUserResponse[] }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetListUser}2c9179a9-a279-4b26-851a-44e16b814d54/users/simple`,
        params: { ...listParams },
    }, [])
    const { data: getListWork, refetch } = useAxios<{ items: WorkResponse[] }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetListWork}2c9179a9-a279-4b26-851a-44e16b814d54/works`,
        params: { ...listParams },

    }, [])
    const { data: getBoardWorkDataById, loading: loadingBoardWork, refetch: refetchBoardWork } = useAxios<{ item: WorkDetailResponse }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetBoardWorks}2c9179a9-a279-4b26-851a-44e16b814d54/works/${id}`
    })
    useEffect(() => {
        const activeSprintId = GetListSprint?.items?.find((sprint) => sprint.status === 2)?.id;
        if (!activeSprintId) return;

        const currentSprint = searchParams.get("sprint_id");
        if (currentSprint === activeSprintId) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("sprint_id", activeSprintId);
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [GetListSprint?.items, searchParams, router]);

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("mode");
        params.delete("id");
        router.push(`?${params.toString()}`, { scroll: false });
    }

    const handleCreateDialogOpenChange = (open: boolean) => {
        if (open) {
            handlePageQueryToModal(ModelType.CREATE);
            return;
        }

        closeModal();
    };

    const handleDeleteDialogOpenChange = (open: boolean) => {
        if (open) {
            return;
        }

        closeModal();
    };

    const handleAssignDialogOpenChange = (open: boolean) => {
        if (open) {
            return;
        }

        closeModal();
    };
    const [sprintActive, setSprintActive] = useState("");
    if (GetListSprint?.items?.find((sprint) => sprint.status === 2)) {
        setSprintActive(GetListSprint?.items?.find((sprint) => sprint.status === 2)?.id || "");
    }

    return (<>
        <CreateWorkBoardDialog
            open={openDialogCreate}
            loading={loadingGetListSprint}
            listSprint={GetListSprint?.items}
            onOpenChange={handleCreateDialogOpenChange}
            refreshListWork={refetch}

        />
        <DeleteWorkBoardDialog
            open={openDialogDelete}
            onOpenChange={handleDeleteDialogOpenChange}
            refreshListWork={refetch}
        />
        <AssignWorkBoardDialog
            listUser={GetListUser?.items}
            onOpenChange={handleAssignDialogOpenChange}
            refreshListWork={refetch}
            open={openDialogAssign}
            getBoardWorkDataById={getBoardWorkDataById?.item}
        />
        <div className="flex justify-between items-center mb-8 p-6">
            <div className="flex items-center  gap-15">
                <H1 className="text-2xl font-bold mb-4">Bảng công việc</H1>
                <div className="flex gap-4">
                    <Select defaultValue={sprintActive} onValueChange={(value) => {
                        if (value === "AllWork") {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete("sprint_id");
                            router.push(`?${params.toString()}`, { scroll: false });
                        } else {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("sprint_id", value);
                            router.push(`?${params.toString()}`, { scroll: false });
                        }
                    }}>
                        <SelectTrigger >
                            <SelectValue placeholder="Hiện không có Sprint nào đang active" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="AllWork">Công việc không ở trong Sprint</SelectItem>
                                {GetListSprint?.items.map((sprint) => (
                                    <SelectItem key={sprint.id} value={sprint.id}>
                                        {sprint.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="AllAssign" onValueChange={(value) => {

                        const params = new URLSearchParams(searchParams.toString());
                        if (value === "AllAssign") {
                            params.delete("assignee_id");
                            router.push(`?${params.toString()}`, { scroll: false });
                        } else {
                            params.set("assignee_id", value);
                            router.push(`?${params.toString()}`, { scroll: false });
                        }
                    }}>
                        <SelectTrigger >
                            <SelectValue placeholder="Lọc theo người thực hiện" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="AllAssign">Tất cả người thực hiện</SelectItem>
                                {GetListUser?.items.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.email}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button className="mb-4 bg-[#2A97EA] border-[#2A97EA] hover:bg-[#0c6ab2] text-white"
                onClick={() => { handlePageQueryToModal(ModelType.CREATE) }}
            >
                <AddIcon />
                Thêm công việc
            </Button>
        </div>
        <div className="p-4">
            <BoardWork ListWork={getListWork?.items || []} />

        </div>
        <DrawerPage refetchListWork={refetch}
            getBoardWorkDataById={getBoardWorkDataById?.item}
            loadingBoardWork={loadingBoardWork}
            refetchBoardWork={refetchBoardWork}
        />
    </>);
}

export default BoardWorkPage;