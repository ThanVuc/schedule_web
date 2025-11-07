import { useEffect, useState } from "react";
import { GoalCardDetail, GoalTaskStruct } from "../_models/type/goalCard";
import { AddIcon } from "@/components/icon";
import { WorkLabel } from "../../../_components";

type Mode = "view" | "update";

interface GoalFormProps {
    mode: Mode;
    detail: GoalCardDetail;
    onClose: () => void;
    onSave: (updatedDetail: GoalCardDetail) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ mode, detail, onClose, onSave }) => {
    const [formDetail, setFormDetail] = useState<GoalCardDetail>(detail);
    const [newTaskName, setNewTaskName] = useState<string>("");

    useEffect(() => {
        setFormDetail(detail);
        setNewTaskName("");
    }, [detail]);

    const disabled = mode === "view";
    const goal = formDetail.GoalCardModel[0];
    if (!goal) return null;

    const handleFieldChange =
        (field: keyof typeof goal) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const updatedGoal = { ...goal, [field]: e.target.value };
                setFormDetail({ ...formDetail, GoalCardModel: [updatedGoal] });
            };

    const handleTaskToggle = (taskId: string) => {
        const updatedTasks = formDetail.list.map((t) =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        );
        setFormDetail({ ...formDetail, list: updatedTasks });
    };

    const handleAddTask = () => {
        const name = newTaskName.trim();
        if (!name) return;
        const newTask: GoalTaskStruct = {
            id: Date.now().toString(),
            name,
            isCompleted: false,
            goalId: goal.id,
        };
        setFormDetail({
            ...formDetail,
            list: [...formDetail.list, newTask],
        });
        setNewTaskName("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formDetail);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <div className="bg-[#232936] p-6 rounded shadow-lg w-full max-w-3xl">
                <h2 className="text-2xl mb-4 flex items-center gap-2">
                    {mode === "view" ? "Xem Chi Tiết Mục Tiêu" : "Chỉnh Sửa Mục Tiêu"}
                    <AddIcon />
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 flex gap-4">
                    <div className="w-[60%]">
                        <p className="py-4">Thông tin cơ bản</p>
                        <div>
                            <span>Tên mục tiêu</span>
                            <input
                                type="text"
                                value={goal.title}
                                onChange={handleFieldChange("title")}
                                disabled={disabled}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div className="py-2 flex gap-2">
                            <div className="flex border rounded-lg w-[50%] items-center">
                                <p className="border-r-2 h-full flex pr-2 items-center">Từ</p>
                                <input type="text"
                                    value={goal.start_time}
                                    onChange={handleFieldChange("start_time")}
                                    disabled={disabled}
                                    className=" p-2 rounded"
                                />
                            </div>
                            <div className="flex border rounded-lg w-[50%]">
                                <p className="border-r-2 h-full flex pr-2 items-center">Đến</p>
                                <input type="choose"
                                    value={goal.end_time}
                                    onChange={handleFieldChange("start_time")}
                                    disabled={disabled}
                                    className=" p-2 rounded"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p>Nhãn dán</p>
                            {goal.labels.map((label) => (
                                <div key={label.id} className="flex">
                                    <WorkLabel label={label.name} label_type={label.label_type} icon={label.icon} color={label.color} />

                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block font-medium mb-2">Chia nhỏ công việc</label>
                            <ul className="space-y-1 max-h-40 overflow-auto">
                                {formDetail.list.map((task: GoalTaskStruct) => (
                                    <li key={task.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={task.isCompleted}
                                            onChange={() => handleTaskToggle(task.id)}
                                            disabled={disabled}
                                            className="mr-2"
                                        />
                                        <span
                                            className={task.isCompleted ? "line-through text-gray-500" : ""}
                                        >
                                            {task.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {!disabled && (
                                <div className="flex gap-2 mt-3">
                                    <input
                                        type="text"
                                        value={newTaskName}
                                        onChange={(e) => setNewTaskName(e.target.value)}
                                        placeholder="Tên task mới..."
                                        className="flex-1 border p-2 rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTask}
                                        disabled={newTaskName.trim() === ""}
                                        className="px-4 py-2 bg-green-600 rounded-lg"
                                    >
                                        Thêm công việc con
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-[40%]">
                        <p className="py-4">Mô tả mục tiêu</p>
                        <div>
                            <label className="block font-medium">Mô tả ngắn</label>
                            <textarea
                                value={goal.shortDescription}
                                onChange={handleFieldChange("shortDescription")}
                                disabled={disabled}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Mô tả chi tiết</label>
                            <textarea
                                value={goal.desCription || ""}
                                onChange={handleFieldChange("desCription")}
                                disabled={disabled}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>
                </form>
                <div className="flex justify-center space-x-2 mt-4 gap-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        {mode === "view" ? "Đóng" : "Hủy"}
                    </button>
                    {mode === "update" && (
                        <button
                            type="submit"
                            onClick={onClose}
                            className="px-4 py-2 bg-yellow-600 text-white rounded"
                        >
                            Lưu mục tiêu
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoalForm;