"use client";
import { AddIcon, ClearIcon, TrashIcon } from "@/components/icon";
import { Button, Checkbox, Input, Label, Progress } from "@/components/ui";
import { useState, useEffect } from "react";
import { miniTask } from "../../_models/miniTask.model";
import { useConfirmDialog } from "@/hooks";

interface MiniTaskProps {
    value?: miniTask[];
    onChange?: (value: miniTask[]) => void;
    disable?: boolean
}

const MiniTask = ({ value = [], onChange, disable }: MiniTaskProps) => {
    const [openInput, setOpenInput] = useState(false);
    const [newInput, setNewInput] = useState("");
    const { confirm, dialog } = useConfirmDialog();

    const MAX_TASKS = 5;

    useEffect(() => {
        if (value.length === 0) {
            setOpenInput(false);
            setNewInput("");
        }
    }, [value]);

    const handleAddTask = () => {
        if (newInput.trim() === "") return;
        if (value.length >= MAX_TASKS) return;

        const newTask: miniTask = {
            is_completed: false,
            name: newInput.trim(),
        };
        onChange?.([...value, newTask]);
        setNewInput("");
        setOpenInput(false);
    };

    const handleDeleteTask = (e: React.MouseEvent, index: number) => {
        const updated = value.filter((_, i) => i !== index);
        e.preventDefault();
        onChange?.(updated);
    };

    const handleDeleteAll = async () => {
        if (value.length === 0)
            return;
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        onChange?.([]);
    };

    const handleToggleComplete = (index: number, checked: boolean) => {
        const updated = [...value];
        updated[index].is_completed = checked;
        onChange?.(updated);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Label className="text-lg mb-5 text-[#E6E6E2] font-bold">
                    Chia nhỏ công việc
                </Label>
                <Button
                    className="border-1 border-[#FF8080] bg-[#FF8080]/20 text-[#FF8080] hover:bg-[#FF8080]/60"
                    type="button"
                    disabled={disable}
                    onClick={handleDeleteAll}
                >
                    <ClearIcon />
                    <p>Xoá tất cả</p>
                </Button>
            </div>
            <div className="ml-8">
                <div className="flex items-center gap-3">
                    <p className="font-bold">
                        {value.length > 0
                            ? Math.round((value.filter((item) => item.is_completed).length / value.length) * 100)
                            : 0}
                        %
                    </p>
                    <Progress
                        className="[&>div]:bg-[#01BC39]"
                        value={
                            (value.filter((item) => item.is_completed).length / value.length) * 100 || 0
                        }
                    />
                </div>
                {value.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 border-b border-white/10 py-2"
                    >
                        <Checkbox
                            className="w-5 h-5 border-white/60 border-3"
                            checked={item.is_completed}
                            onCheckedChange={(checked) => handleToggleComplete(index, !!checked)}
                            disabled={disable}
                        />
                        <span
                            className={
                                item.is_completed ? "line-through text-gray-400 flex-1" : "flex-1"
                            }
                        >
                            {item.name}
                        </span>
                        <Button
                            disabled={disable}
                            className="bg-transparent hover:bg-transparent"
                            onClick={(e) => handleDeleteTask(e, index)}>
                            <TrashIcon
                                className="!w-5 !h-5 text-[#FF6B6B] cursor-pointer "
                            />
                        </Button>
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
                            disabled={disable}
                        />
                        <TrashIcon
                            className="!w-7 !h-7 text-[#FF6B6B] cursor-pointer"
                            onClick={() => {
                                setOpenInput(false);
                                setNewInput("");
                            }}
                        />
                    </div>
                )}
                <div className="mt-3">
                    <Button
                        className="flex items-center bg-[#3DF875]/20 hover:bg-[#3DF875]/40 border-[#3DF875] text-[#3DF875] border rounded-sm p-5 disabled:opacity-40 disabled:cursor-not-allowed"
                        type="button"
                        onClick={() => setOpenInput(true)}
                        disabled={value.length >= MAX_TASKS || disable}
                    >
                        <AddIcon className="!w-4 !h-4 mr-2" />
                        {value.length >= MAX_TASKS
                            ? "Đã đạt giới hạn (5)"
                            : "Thêm công việc con"}
                    </Button>
                </div>
            </div>
            {dialog}
        </>
    );
};

export default MiniTask;