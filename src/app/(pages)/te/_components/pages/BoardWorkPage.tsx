'use client';
import { Button, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { BoardWork } from "../features/group/work/index";
import { AddIcon } from "@/components/icon";
import { DrawerPage } from ".";
import { CreateWorkBoardDialog } from "../features/group/work/container/CreateWorkBoard";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useModalParams } from "../../_hooks";
import { ModelType } from "@/app/(pages)/schedule/_constant";
import { DeleteWorkBoardDialog } from "../features/group/work/container/DeleteWorkBoard";
import { AssignWorkBoardDialog } from "../features/group/work/container/AssignWorkBoard";
import { useAxios } from "@/hooks/useAxios";
import { boardWorksApiUrl } from "@/api/boardWork";
import { ListSimpleSprintResponse, ListSimpleUserResponse, WorkDetailResponse, WorkResponse } from "../../_models";
import { useEffect, useMemo, useRef, useState } from "react";
import { AddToSprintWorkBoardDialog } from "../features/group/backlog/container/AddToSprint";


const BoardWorkPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const groupId = params?.id ?? "";
    const { mode, id } = useModalParams();
    const [disable, setDisable] = useState(false);
    const openDialogCreate = mode === ModelType.CREATE;
    const openDialogDelete = mode === ModelType.DELETE;
    const openDialogAssign = mode === ModelType.ASSIGN;
    const openDialogAddToSprint = mode === ModelType.ADDSPRINT;
    const tabFromUrl = searchParams.get("tab");
    const sprintIdFromUrl = searchParams.get("sprint_id");
    const selectedSprintFilter = sprintIdFromUrl ?? "BackLog";
    const hasInitializedAutoSprintRef = useRef(false);
    const assigneeIdFromUrl = searchParams.get("assignee_id") || "AllAssign";
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
        url: `${boardWorksApiUrl.GetListSprint}${groupId}/sprints/simple`,
        params: { ...listParams },
    }, [])
    const { data: GetListUser } = useAxios<{ items: ListSimpleUserResponse[] }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetListUser}${groupId}/users/simple`,
        params: { ...listParams },
    }, [])
    const { data: getListWork, refetch } = useAxios<{ items: WorkResponse[] }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetListWork}${groupId}/works`,
        params: { ...listParams },

    }, [])
    const { data: getBoardWorkDataById, loading: loadingBoardWork, refetch: refetchBoardWork } = useAxios<{ item: WorkDetailResponse }>({
        method: "GET",
        url: `${boardWorksApiUrl.GetBoardWorks}${groupId}/works/${id}`
    })

    useEffect(() => {
        if (tabFromUrl === "workboard" || sprintIdFromUrl === null) return;

        const params = new URLSearchParams(searchParams.toString());
        params.delete("sprint_id");

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [tabFromUrl, sprintIdFromUrl, searchParams, router]);

    useEffect(() => {
        if (!GetListSprint?.items) return;

        const activeSprint = GetListSprint.items.find(
            (sprint) => Number(sprint.status) === 2
        );
        const activeSprintId = activeSprint?.id;

        if (sprintIdFromUrl) {
            const selectedSprint = GetListSprint.items.find((sprint) => sprint.id === sprintIdFromUrl);
            const selectedSprintStatus = Number(selectedSprint?.status);
            setDisable((selectedSprintStatus === 3 || selectedSprintStatus === 4));
            hasInitializedAutoSprintRef.current = true;
            return;
        }

        setDisable(!activeSprintId);

        if (sprintIdFromUrl !== null || tabFromUrl !== "workboard" || hasInitializedAutoSprintRef.current) return;

        const params = new URLSearchParams(searchParams.toString());
        hasInitializedAutoSprintRef.current = true;
        if (activeSprintId) {
            params.set("sprint_id", activeSprintId);
        } else {
            params.delete("sprint_id");
        }

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [GetListSprint?.items, sprintIdFromUrl, tabFromUrl, searchParams, router]);
    useEffect(() => {
        if (!GetListSprint?.items) return;

    }, [GetListSprint?.items])

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
    const handleAddToSprintDialogOpenChange = (open: boolean) => {
        if (open) return;
        closeModal();
    };
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
        <AddToSprintWorkBoardDialog
            onOpenChange={handleAddToSprintDialogOpenChange}
            open={openDialogAddToSprint}
            getBoardWorkDataById={getBoardWorkDataById?.item}
            GetListSprint={GetListSprint?.items}
            refreshListWork={refetch}
        />
        <div className="flex justify-between items-center mb-2 p-6">
            <div className="flex items-center gap-5">
                <p className="text-2xl font-bold">Bảng công việc</p>
                <div className="flex gap-4">
                    <Select
                        disabled={loadingGetListSprint}
                        value={loadingGetListSprint ? undefined : selectedSprintFilter}
                        onValueChange={(value) => {
                            if (loadingGetListSprint) return;
                            hasInitializedAutoSprintRef.current = true;
                            const params = new URLSearchParams(searchParams.toString());

                            if (value === "BackLog") {
                                params.delete("sprint_id");
                            } else {
                                params.set("sprint_id", value);
                            }

                            router.push(`?${params.toString()}`, { scroll: false });
                        }}
                    >
                        <SelectTrigger className="w-40 data-[placeholder]:text-white">
                            <SelectValue placeholder={loadingGetListSprint ? "Đang tải sprint..." : "Hiện không có Sprint"} defaultValue="BackLog" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="BackLog">BackLog</SelectItem>
                                {GetListSprint?.items.map((sprint) => (
                                    <SelectItem key={sprint.id} value={sprint.id}>
                                        {sprint.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select
                        value={assigneeIdFromUrl}
                        onValueChange={(value) => {
                            const params = new URLSearchParams(searchParams.toString());

                            if (value === "AllAssign") {
                                params.delete("assignee_id");
                            } else {
                                params.set("assignee_id", value);
                            }

                            router.push(`?${params.toString()}`, { scroll: false });
                        }}
                    >
                        <SelectTrigger className="w-40">
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
            <div>
                <Button className="bg-[#2A97EA] border-[#2A97EA] hover:bg-[#0c6ab2] text-white"
                    onClick={() => { handlePageQueryToModal(ModelType.CREATE) }}
                >
                    <AddIcon />
                    Thêm công việc
                </Button>
            </div>
        </div>
        <div className="p-4">
            <BoardWork ListWork={getListWork?.items || []} disable={disable} />
        </div>
        <DrawerPage refetchListWork={refetch}
            getBoardWorkDataById={getBoardWorkDataById?.item}
            loadingBoardWork={loadingBoardWork}
            refetchBoardWork={refetchBoardWork}
            disable={disable}
        />
    </>);
}

export default BoardWorkPage;