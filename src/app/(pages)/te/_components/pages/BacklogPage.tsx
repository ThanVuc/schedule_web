'use client';

import { H1} from "@/components/common";
import { AddIcon } from "@/components/icon";
import { Button } from "@/components/ui";
import CardBacklog from "../features/group/backlog/CardBacklog";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../_hooks";
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { UpdateBacklogDrawerPage } from "../features/group/backlog/container/UpdateBacklogDrawerPage";
import { DeleteBacklogDialog } from "../features/group/backlog/container/DeleteBacklog";
import { AddToSprintWorkBoardDialog } from "../features/group/backlog/container/AddToSprint";
import { AssignBacklogDialog } from "../features/group/backlog/container/AssignBacklog";
import { useAxios } from "@/hooks";
import { ListSimpleSprintResponse, ListSimpleUserResponse, WorkDetailResponse, WorkResponse } from "../../_models";
import { boardWorksApiUrl } from "@/api/boardWork";
import { useMemo } from "react";
import { CreateWorkBoardDialog } from "../features/group/work/container/CreateWorkBoard";


const BacklogPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { mode, id } = useModalParams();
    const openDialogCreate = mode === ModelType.CREATE;
    const openDialogDelete = mode === ModelType.DELETE;
    const openDialogAssign = mode === ModelType.ASSIGN;
    const openDialogAddToSprint = mode === ModelType.ADDSPRINT;

    const listParams = useMemo(() => {
        const entries = [...searchParams.entries()].filter(([key]) => key !== "mode" && key !== "id");
        return Object.fromEntries(entries);
    }, [searchParams]);


    const { data: getListWork, refetch: refetchListWork } = useAxios<{ items: WorkResponse[] }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetListWork}2c9179a9-a279-4b26-851a-44e16b814d54/works`,
    }, [])
    const { data: GetListUser } = useAxios<{ items: ListSimpleUserResponse[] }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetListUser}2c9179a9-a279-4b26-851a-44e16b814d54/users/simple`,
        params: { ...listParams },
    }, [])
    const { data: getBoardWorkDataById, loading: loadingBoardWork, refetch: refetchBoardWork } = useAxios<{ item: WorkDetailResponse }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetBoardWorks}2c9179a9-a279-4b26-851a-44e16b814d54/works/${id}`
    })
    const { loading: loadingGetListSprint, data: GetListSprint } = useAxios<{ items: ListSimpleSprintResponse[] }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetListSprint}2c9179a9-a279-4b26-851a-44e16b814d54/sprints/simple`,
        params: { ...listParams },
    }, [])

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
        if (open) return;
        closeModal();
    };

    const handleAddToSprintDialogOpenChange = (open: boolean) => {
        if (open) return;
        closeModal();
    };

    const handleAssignDialogOpenChange = (open: boolean) => {
        if (open) return;
        closeModal();
    };

    return (<>
        <div className="p-4">
            <CreateWorkBoardDialog
                open={openDialogCreate}
                loading={loadingGetListSprint}
                listSprint={GetListSprint?.items}
                onOpenChange={handleCreateDialogOpenChange}
                refreshListWork={refetchListWork}

            />
            <DeleteBacklogDialog
                onOpenChange={handleDeleteDialogOpenChange}
                open={openDialogDelete}
                refreshListWork={refetchListWork}
            />
            <AddToSprintWorkBoardDialog
                onOpenChange={handleAddToSprintDialogOpenChange}
                open={openDialogAddToSprint}
                getBoardWorkDataById={getBoardWorkDataById?.item}
                GetListSprint={GetListSprint?.items}
                refreshListWork={refetchListWork}
            />
            <AssignBacklogDialog
                onOpenChange={handleAssignDialogOpenChange}
                open={openDialogAssign}
                listUser={GetListUser?.items}
                getBoardWorkDataById={getBoardWorkDataById?.item}
                refreshListWork={refetchListWork}
            />
            <UpdateBacklogDrawerPage
                getBoardWorkDataById={getBoardWorkDataById?.item}
                loadingBoardWork={loadingBoardWork}
                refetchBoardWork={refetchBoardWork}
                GetListSprint={GetListSprint?.items}
                loadingGetListSprint={loadingGetListSprint}
            />


            <div className="flex justify-between p-4">
                <H1 className="font-bold">BackLog</H1>
                <Button className="bg-[#2A97EA] hover:bg-[#2A97EA]/80"
                    onClick={() => { handlePageQueryToModal(ModelType.CREATE) }}
                >
                    <AddIcon />
                    CreateWork
                </Button>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 p-3">
                {getListWork?.items.map((item) => (
                    <CardBacklog
                        key={item.id}
                        id={item.id}
                        date={item.due_date ? new Date(item.due_date).toLocaleDateString() : ""}
                        avatar={item.assignee?.avatar || ""}
                        assignee={item.assignee?.email || "Unassigned"}
                        number={item.story_point}
                        state={item.status}
                        title={item.name}
                    />
                ))}
            </div>
        </div>
    </>);
}

export default BacklogPage;