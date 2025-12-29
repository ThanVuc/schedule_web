"use client";
import { AddIcon, ClearIcon, TrashIcon } from "@/components/icon";
import { Button, Checkbox, Input, Label, Progress } from "@/components/ui";
import { useState } from "react";
import { miniTask } from "../../_models/miniTask.model";
import { AppAlertDialog } from "@/components/common/alertDialog";

interface MiniTaskProps {
    value?: miniTask[];
    onChange?: (value: miniTask[]) => void;
    disable?: boolean;
    type?: 'Goal' | 'Work';
}

const MiniTask = ({ value = [], onChange, disable, type = 'Work' }: MiniTaskProps) => {
    const [openInput, setOpenInput] = useState(false);
    const [newInput, setNewInput] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const MAX_TASKS = 5;

    const types = {
        Goal: {
            title: "Chia nhỏ mục tiêu",
            addButton: "Thêm mục tiêu con",
            placeholder: "Nhập mục tiêu cần thêm",
            dialogTitle: "Xác nhận xóa tất cả mục tiêu con",
            dialogDescription: "Bạn có chắc chắn muốn xóa tất cả các mục tiêu con? Hành động này không thể hoàn tác."
        },
        Work: {
            title: "Chia nhỏ công việc",
            addButton: "Thêm công việc con",
            placeholder: "Nhập công việc cần thêm",
            dialogTitle: "Xác nhận xóa tất cả công việc con",
            dialogDescription: "Bạn có chắc chắn muốn xóa tất cả các công việc con? Hành động này không thể hoàn tác."
        }
    };

    const currentType = types[type];

    const handleAddTask = () => {
        if (newInput.trim() === "") return;
        if (value.length >= MAX_TASKS) return;

        const newTask: miniTask = {
            is_completed: false,
            name: newInput.trim(),
        };
        onChange?.([...value, newTask]);
        setNewInput("");

        if (value.length + 1 < MAX_TASKS) {
            setOpenInput(true);
        } else {
            setOpenInput(false);
        }
    };

    const handleDeleteTask = (e: React.MouseEvent, index: number) => {
        const updated = value.filter((_, i) => i !== index);
        e.preventDefault();
        onChange?.(updated);
    };

    const handleDeleteAll = async () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        onChange?.([]);
        setShowDeleteDialog(false);
    };

    const handleToggleComplete = (index: number, checked: boolean) => {
        const updated = [...value];
        updated[index].is_completed = checked;
        onChange?.(updated);
    };

    const handleDoubleClick = (index: number) => {
        if (disable) return;
        setEditingIndex(index);
        setEditValue(value[index].name);
        setOpenInput(false);
    };

    const handleSaveEdit = (index: number) => {
        if (editValue.trim() === "") {
            setEditingIndex(null);
            setEditValue("");
            return;
        }

        const updated = [...value];
        updated[index].name = editValue.trim();
        onChange?.(updated);
        setEditingIndex(null);
        setEditValue("");

        if (value.length < MAX_TASKS) {
            setOpenInput(true);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Label className="text-lg mb-5 text-[#E6E6E2] font-bold">
                    {currentType.title}
                </Label>
                <Button
                    className="border-1 border-[#FF8080] bg-[#FF8080]/20 text-[#FF8080] hover:bg-[#FF8080]/60 disabled:opacity-0"
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
                            className="w-5 h-5 border-white/60 border-3 disabled:opacity-80"
                            checked={item.is_completed}
                            onCheckedChange={(checked) => handleToggleComplete(index, !!checked)}
                            disabled={disable || editingIndex === index}
                        />
                        {editingIndex === index ? (
                            <Input
                                className="flex-1 disabled:opacity-80"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSaveEdit(index);
                                    } else if (e.key === "Escape") {
                                        setEditingIndex(null);
                                        setEditValue("");
                                    }
                                }}
                                onBlur={() => handleSaveEdit(index)}
                                autoFocus
                                disabled={disable}
                            />
                        ) : (
                            <span
                                className={
                                    item.is_completed
                                        ? "line-through text-gray-400 flex-1 cursor-pointer"
                                        : "flex-1 cursor-pointer"
                                }
                                onDoubleClick={() => handleDoubleClick(index)}
                            >
                                {item.name}
                            </span>
                        )}
                        <Button
                            disabled={disable || editingIndex === index}
                            className="bg-transparent hover:bg-transparent disabled:opacity-0"
                            onClick={(e) => handleDeleteTask(e, index)}>
                            <TrashIcon
                                className="!w-5 !h-5 text-[#FF6B6B] cursor-pointer"
                            />
                        </Button>
                    </div>
                ))}
                {openInput && (
                    <div className="flex items-center gap-5 border-b border-white/20 mb-5 pb-2">
                        <Checkbox className="w-5 h-5 border-white/60 border-3" disabled />
                        <Input
                            className="disabled:opacity-80"
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
                    </div>
                )}
                <div className="mt-3">
                    {(!disable || value.length > MAX_TASKS) && (
                        <Button
                            className="flex items-center bg-[#3DF875]/20 hover:bg-[#3DF875]/40 border-[#3DF875] text-[#3DF875] border rounded-sm p-5 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="button"
                            onClick={() => setOpenInput(true)}
                            disabled={value.length >= MAX_TASKS || disable}
                        >
                            <AddIcon className="!w-4 !h-4 mr-2" />
                            {value.length >= MAX_TASKS
                                ? "Đã đạt giới hạn (5)"
                                : currentType.addButton}
                        </Button>
                    )}
                </div>
            </div>
            <AppAlertDialog
                open={showDeleteDialog}
                setOpen={setShowDeleteDialog}
                title={currentType.dialogTitle}
                description={currentType.dialogDescription}
                onSubmit={handleConfirmDelete}
                submitText="Xóa tất cả"
                cancelText="Hủy"
            />
        </>
    );
};

export default MiniTask;