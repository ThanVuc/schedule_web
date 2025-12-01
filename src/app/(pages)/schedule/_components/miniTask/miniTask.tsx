"use client";
import { AddIcon, TrashIcon } from "@/components/icon";
import { Button, Checkbox, Input, Label, Progress } from "@/components/ui";
import { useState, useEffect } from "react";
import { miniTask } from "../../_models/miniTask.model";

interface MiniTaskProps {
    value?: miniTask[];
    onChange?: (value: miniTask[]) => void;
}

const MiniTask = ({ value = [], onChange }: MiniTaskProps) => {
    const [openInput, setOpenInput] = useState(false);
    const [dataList, setDataList] = useState<miniTask[]>(value);
    const [newInput, setNewInput] = useState("");

    const MAX_TASKS = 5;

    useEffect(() => {
        onChange?.(dataList);
    }, [dataList]);

    const handleAddTask = () => {
        if (newInput.trim() === "") return;
        if (dataList.length >= MAX_TASKS) return;

        const newTask: miniTask = {
            is_completed: false,
            name: newInput.trim(),
        };
        setDataList([...dataList, newTask]);
        setNewInput("");
        setOpenInput(false);
    };

    const handleDeleteTask = (index: number) => {
        const updated = dataList.filter((_, i) => i !== index);
        setDataList(updated);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Label className="text-lg mb-5 text-[#E6E6E2] font-bold">
                    Chia nhỏ công việc
                </Label>
                <Button className="border-1 border-[#FF8080] bg-[#FF8080]/20 text-[#FF8080] hover:bg-[#FF8080]/60"
                type="button"
                onClick={() => setDataList([])}
                >
                    Xoá tất cả
                </Button>
            </div>

            <div className="ml-8">
                <div className="flex items-center gap-3">
                    <p className="font-bold">
                        {dataList.length > 0
                            ? Math.round((dataList.filter((item) => item.is_completed).length / dataList.length) * 100)
                            : 0}
                        %
                    </p>
                    <Progress
                        className="[&>div]:bg-[#01BC39]"
                        value={
                            (dataList.filter((item) => item.is_completed).length / dataList.length) * 100 || 0
                        }
                    />
                </div>
                {dataList.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 border-b border-white/10 py-2"
                    >
                        <Checkbox
                            className="w-5 h-5 border-white/60 border-3"
                            checked={item.is_completed}
                            onCheckedChange={(checked) => {
                                const updated = [...dataList];
                                updated[index].is_completed = !!checked;
                                setDataList(updated);
                            }}
                        />
                        <span
                            className={
                                item.is_completed ? "line-through text-gray-400 flex-1" : "flex-1"
                            }
                        >
                            {item.name}
                        </span>
                        <TrashIcon
                            className="!w-5 !h-5 text-[#FF6B6B] cursor-pointer"
                            onClick={() => handleDeleteTask(index)}
                        />
                    </div>
                ))}
                {openInput && (
                    <div className="flex items-center gap-5 border-b border-white/20 mb-5 pb-2">
                        <Checkbox className="w-5 h-5 border-white/60 border-3" disabled />
                        <Input
                            placeholder="Nhập công việc cần thêm"
                            value={newInput}
                            onChange={(e) => setNewInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddTask();
                                }
                            }}
                        />
                        <TrashIcon
                            className="!w-7 !h-7 text-[#FF6B6B] cursor-pointer"
                            onClick={() => setOpenInput(false)}
                        />
                    </div>
                )}
                <div className="mt-3">
                    <Button
                        className="flex items-center bg-[#3DF875]/20 hover:bg-[#3DF875]/40 border-[#3DF875] text-[#3DF875] border rounded-sm p-5 disabled:opacity-40 disabled:cursor-not-allowed"
                        type="button"
                        onClick={() => setOpenInput(true)}
                        disabled={dataList.length >= MAX_TASKS}
                    >
                        <AddIcon className="!w-4 !h-4 mr-2" />
                        {dataList.length >= MAX_TASKS
                            ? "Đã đạt giới hạn (5)"
                            : "Thêm công việc con"}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default MiniTask;
