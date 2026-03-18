'use client'
import { DragDropProvider } from '@dnd-kit/react';
import { useState } from "react";

import {BoardColumn, BoardItem} from "./index";
import { WorkColumn } from '@/app/(pages)/te/_models';



const BoardWork = () => {
    const [initialBoardData, setInitialBoardData] = useState<WorkColumn[]>([
        {
            id: "todo",
            name: "Todo",
            tasks: [
                { id: "task-1", name: "Design login page", description: "", assignee:{ id: "user-1", name: "Jane", avatar: "" }, story_point: 8, status: 1, created_at: "2023-10-01" },
                { id: "task-2", name: "Create API documentation", description: "", assignee: { id: "user-2", name: "Bob", avatar: "" }, story_point: 5, status: 1, created_at: "2023-10-05" },
                { id: "task-3", name: "Setup database schema", description: "", assignee: { id: "user-3", name: "Huan", avatar: "" }, story_point: 3, status: 1, created_at: "2023-10-10" },
            ]
        },
        {
            id: "in-progress",
            name: "In Progress",
            tasks: [
                { id: "task-4", name: "Implement authentication", description: "", assignee: { id: "user-3", name: "Huan", avatar: "" }, story_point: 13, status: 2, created_at: "2023-10-02" },
                { id: "task-5", name: "Integrate payment gateway", description: "", assignee: { id: "user-4", name: "Alice", avatar: "" }, story_point: 8, status: 2, created_at: "2023-10-08" },
            ]
        },
        {
            id: "review",
            name: "Review",
            tasks: [
                { id: "task-8", name: "Code review for authentication", description: "", assignee: { id: "user-2", name: "Bob", avatar: "" }, story_point: 5, status: 3, created_at: "2023-10-15" },
            ]
        },
        {
            id: "completed",
            name: "Completed",
            tasks: [
                { id: "task-6", name: "Project scaffolding", description: "", assignee: { id: "user-2", name: "Bob", avatar: "" }, story_point: 2, status: 4, created_at: "2023-09-25" },
                { id: "task-7", name: "Gather requirements", description: "", assignee: { id: "user-1", name: "Jane", avatar: "" }, story_point: 1, status: 4, created_at: "2023-09-20" },
            ]
        }
    ]);
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
            
            movedTask.status = newData[overColIndex].name as any;

            const insertIndex = overTaskIndex >= 0 ? overTaskIndex : overTasks.length;
            overTasks.splice(insertIndex, 0, movedTask);

            return newData;
        });
    };

    return (
        <DragDropProvider onDragOver={handleDragOver}>
            <div className="flex gap-4">
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
                                name={task.assignee.name}
                                number={task.story_point}
                                state={task.status}
                                date={task.created_at}
                            />
                        ))}
                    </BoardColumn>
                ))}
            </div>
        </DragDropProvider>
    );
}

export default BoardWork;