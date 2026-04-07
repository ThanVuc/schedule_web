'use client'
import { DragDropProvider } from '@dnd-kit/react';
import { useState, useEffect, useRef } from "react";
import type { AxiosError } from "axios";

import { BoardColumn, BoardItem } from "./index";
import { WorkColumn, WorkResponse, WorkUpdateWorkMovingRequest } from '@/app/(pages)/te/_models';
import { useAxiosMutation, useToastState } from '@/hooks';
import { boardWorksApiUrl } from '@/api/boardWork';
import { useParams } from 'next/navigation';


interface BoardWorkProps {
    ListWork: WorkResponse[];
    refreshListWork?: () => void;
    disable?: boolean;
}

type WorkMoveResponse = {
    version?: number;
    item?: {
        version?: number;
    };
};

type WorkMoveApiErrorBody = {
    detail?: string;
    errorCode?: string;
    title?: string;
    statusCode?: number;
};

const getMoveWorkErrorMessage = (error: unknown): string => {
    const axiosError = error as AxiosError<WorkMoveApiErrorBody>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    const detail = (typeof data?.detail === "string" ? data.detail : "").trim().toLowerCase();
    const errorCode = (typeof data?.errorCode === "string" ? data.errorCode : "").trim();

    const isCompletedOrCancelledSprintError =
        status === 422 &&
        errorCode === "ts.validation.unprocessable" &&
        detail.includes("cannot update work in completed or cancelled sprint");

    if (isCompletedOrCancelledSprintError) {
        return "Không thể cập nhật công việc vì sprint đã hoàn thành hoặc đã hủy.";
    }

    return "Lỗi xảy ra khi di chuyển công việc, vui lòng thử lại";
};

const BoardWork = ({ ListWork,disable }: BoardWorkProps) => {
    const pendingMoveRef = useRef<Set<string>>(new Set());
    const latestVersionRef = useRef<Map<string, number>>(new Map());
    const originalStatusRef = useRef<Map<string, number>>(new Map());
    const params = useParams<{ id: string }>();
    const groupId = params?.id ?? "";
    const { setToast } = useToastState();

    const applyLocalVersion = (work: WorkResponse): WorkResponse => {
        const localVersion = latestVersionRef.current.get(work.id);
        if (typeof localVersion !== "number") return work;
        return { ...work, version: localVersion };
    };

    const buildBoardData = (source: WorkResponse[]): WorkColumn[] => ([
        {
            id: "1",
            name: "Todo",
            tasks: source.filter((work) => work.status === 1).map(applyLocalVersion)
        },
        {
            id: "2",
            name: "In Progress",
            tasks: source.filter((work) => work.status === 2).map(applyLocalVersion)
        },
        {
            id: "3",
            name: "Review",
            tasks: source.filter((work) => work.status === 3).map(applyLocalVersion)
        },
        {
            id: "4",
            name: "Completed",
            tasks: source.filter((work) => work.status === 4).map(applyLocalVersion)
        }
    ]);

    const { sendRequest: updateWorkStatus } = useAxiosMutation<WorkMoveResponse, WorkUpdateWorkMovingRequest>({
        method: "PATCH",
        url: `${boardWorksApiUrl.CRUDWORD}${groupId}/works`,
    })
    const [initialBoardData, setInitialBoardData] = useState<WorkColumn[]>(buildBoardData(ListWork));
    useEffect(() => {
        setInitialBoardData(buildBoardData(ListWork));
    }, [ListWork]);

    const handleDragStart = (event: any) => {
        const movedTaskId = String(event.operation?.source?.id ?? event.active?.id ?? "");
        if (!movedTaskId) return;

        const sourceColumn = initialBoardData.find((column) =>
            column.tasks.some((task) => task.id === movedTaskId)
        );

        if (!sourceColumn?.id) return;

        const sourceStatus = Number(sourceColumn.id);
        if (!Number.isInteger(sourceStatus)) return;

        originalStatusRef.current.set(movedTaskId, sourceStatus);
    };

    const handleDragEnd = async (event: any) => {
        const movedTaskId = String(event.operation?.source?.id ?? event.active?.id ?? "");
        const dropTargetId = String(event.operation?.target?.id ?? event.over?.id ?? "");

        if (!movedTaskId || !dropTargetId) {
            if (movedTaskId) {
                originalStatusRef.current.delete(movedTaskId);
            }
            return;
        }

        const originalStatus = originalStatusRef.current.get(movedTaskId);

        const movedTask = initialBoardData
            .flatMap((column) => column.tasks)
            .find((work) => work.id === movedTaskId) ?? ListWork.find((work) => work.id === movedTaskId);
        if (!movedTask) {
            originalStatusRef.current.delete(movedTaskId);
            return;
        }

        const targetColumn = initialBoardData.find(
            (column) => column.id === dropTargetId
        ) || initialBoardData.find(
            (column) => column.tasks.some((task) => task.id === dropTargetId)
        );

        if (!targetColumn?.id) return;

        const nextStatus = Number(targetColumn.id);
        const isValidStatus = Number.isInteger(nextStatus) && nextStatus >= 1 && nextStatus <= 4;
        if (!isValidStatus) {
            originalStatusRef.current.delete(movedTaskId);
            return;
        }

        const previousStatus = originalStatus ?? movedTask.status;

        if (previousStatus === nextStatus) {
            originalStatusRef.current.delete(movedTaskId);
            return;
        }

        if (typeof movedTask.version !== "number") {
            originalStatusRef.current.delete(movedTaskId);
            return;
        }

        const currentVersion = movedTask.version;
        const moveKey = `${movedTaskId}:${nextStatus}:${currentVersion}`;
        if (pendingMoveRef.current.has(moveKey)) return;
        pendingMoveRef.current.add(moveKey);

        try {
            const { data, error } = await updateWorkStatus(
                {
                    status: nextStatus,
                    version: currentVersion
                },
                movedTaskId,
            );
            if (error) {
                setToast({
                    message: getMoveWorkErrorMessage(error),
                    variant: "error",
                    title: "Di chuyển công việc thất bại"
                });
                return;

            }

            const nextVersion = data?.version ?? data?.item?.version;

            if (typeof nextVersion === "number") {
                latestVersionRef.current.set(movedTaskId, nextVersion);
                setInitialBoardData((prevData) =>
                    prevData.map((column) => ({
                        ...column,
                        tasks: column.tasks.map((task) =>
                            task.id === movedTaskId
                                ? { ...task, version: nextVersion, status: nextStatus }
                                : task
                        )
                    }))
                );
            }
        } finally {
            pendingMoveRef.current.delete(moveKey);
            originalStatusRef.current.delete(movedTaskId);
        }

    };

    const handleDragOver = (event: any) => {
        const activeId = event.operation?.source?.id || event.active?.id;
        const overId = event.operation?.target?.id || event.over?.id;

        if (!activeId || !overId || activeId === overId) return;

        setInitialBoardData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));

            const activeColIndex = newData.findIndex((col: any) =>
                col.tasks.some((task: any) => task.id === activeId)
            );

            const overColIndex = newData.findIndex((col: any) =>
                col.id === overId || col.tasks.some((task: any) => task.id === overId)
            );

            if (activeColIndex === -1 || overColIndex === -1 || activeColIndex === overColIndex) {
                return prevData;
            }

            const activeTasks = newData[activeColIndex].tasks;
            const overTasks = newData[overColIndex].tasks;

            const activeTaskIndex = activeTasks.findIndex((t: any) => t.id === activeId);
            const overTaskIndex = overTasks.findIndex((t: any) => t.id === overId);

            const [movedTask] = activeTasks.splice(activeTaskIndex, 1);

            movedTask.status = Number(newData[overColIndex].id);

            const insertIndex = overTaskIndex >= 0 ? overTaskIndex : overTasks.length;
            overTasks.splice(insertIndex, 0, movedTask);

            return newData;
        });
    };

    return (
        <DragDropProvider onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="board-scroll w-full overflow-x-auto overscroll-x-contain p-2">
                <div className="flex min-w-max gap-4">
                    {initialBoardData.map((column) => (
                        <BoardColumn
                            key={column.id}
                            id={column.id}
                            title={column.name}
                            count={column.tasks.length}
                        >
                            {column.tasks.map((task, index) => (
                                <BoardItem
                                    key={task.id}
                                    column={column.id}
                                    id={task.id}
                                    index={index}
                                    title={task.name}
                                    name={task.assignee.email}
                                    number={task.story_point}
                                    state={task.status}
                                    date={task.created_at}
                                    disable={disable}
                                />
                            ))}
                        </BoardColumn>
                    ))}
                </div>
            </div>
        </DragDropProvider>
    );
}

export default BoardWork;