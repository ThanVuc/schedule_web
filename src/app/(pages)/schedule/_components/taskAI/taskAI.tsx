import { Button } from "@/components/ui/button";
import { AddIcon, ClearIcon, TrashIcon } from "@/components/icon";
import { useState } from "react";
import { Input } from "@/components/ui";
import { AppAlertDialog } from "@/components/common";

interface TaskAIProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  disable?: boolean;
}

const TaskAI = ({ value = [], onChange, disable }: TaskAIProps) => {
  const [newInput, setNewInput] = useState("");
  const [openInput, setOpenInput] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const MAX_TASKS = 20;

  const types = {
    dialogTitle: "Xác nhận xóa tất cả công việc",
    dialogDescription:
      "Bạn có chắc chắn muốn xóa tất cả các công việc? Hành động này không thể hoàn tác.",
  };

  const handleAddTask = () => {
    if (newInput.trim() === "") return;
    if (value.length >= MAX_TASKS) return;

    onChange?.([...value, newInput.trim()]);
    setNewInput("");

    setOpenInput(value.length + 1 < MAX_TASKS);
  };

  const handleDeleteTask = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const updated = value.filter((_, i) => i !== index);
    onChange?.(updated);
  };

  const handleDeleteAll = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onChange?.([]);
    setShowDeleteDialog(false);
  };

  const handleDoubleClick = (index: number) => {
    if (disable) return;
    setEditingIndex(index);
    setEditValue(value[index]);
    setOpenInput(false);
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim() === "") {
      setEditingIndex(null);
      setEditValue("");
      return;
    }

    const updated = [...value];
    updated[index] = editValue.trim();
    onChange?.(updated);

    setEditingIndex(null);
    setEditValue("");

    if (value.length < MAX_TASKS) setOpenInput(true);
  };

  return (
    <div>
      <div>
        <div
          className={`${value.length >= 4 ? "max-h-[180px] overflow-y-auto" : ""
            }`}
        >
          {value.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-1 border-b border-[#ffffff]/30"
              onDoubleClick={() => handleDoubleClick(index)}
            >
              {editingIndex === index ? (
                <Input
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(index);
                    if (e.key === "Escape") setEditingIndex(null);
                  }}
                  onBlur={() => handleSaveEdit(index)}
                />
              ) : (
                <p className="truncate max-w-[400px]">{item}</p>
              )}

              <TrashIcon
                className="!w-4 !h-4 cursor-pointer text-red-500"
                onClick={(e) => handleDeleteTask(e, index)}
              />
            </div>
          ))}
        </div>

        {openInput && (
          <div className="flex items-center mt-3 gap-5 border-b border-white/20 mb-5 pb-2">
            <Input
              className="disabled:opacity-80"
              placeholder="Nhập yêu cầu AI"
              value={newInput}
              onChange={(e) => setNewInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTask();
                  setOpenInput(false);
                }
              }}
              disabled={disable}
            />
            <TrashIcon
              className="!w-5 !h-5 text-[#FF6B6B] cursor-pointer"
              onClick={() => {
                setOpenInput(false);
                setNewInput("");
              }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4 mt-4">
        {(!disable || value.length < MAX_TASKS) && (
          <Button
            className="flex items-center bg-[#3DF875]/20 hover:bg-[#3DF875]/40 border-[#3DF875] text-[#3DF875] border rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={() => setOpenInput(true)}
            disabled={value.length >= MAX_TASKS || disable}
          >
            <AddIcon className="!w-4 !h-4 mr-2" />
            Thêm yêu cầu AI
          </Button>
        )}

        {value.length > 0 && (<Button
          className="border-1 border-[#FF8080] bg-[#FF8080]/20 text-[#FF8080] hover:bg-[#FF8080]/60 disabled:opacity-0"
          type="button"
          disabled={disable}
          onClick={handleDeleteAll}
        >
          <ClearIcon />
          <p>Xoá tất cả</p>
        </Button>)}
      </div>

      <AppAlertDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        title={types.dialogTitle}
        description={types.dialogDescription}
        onSubmit={handleConfirmDelete}
        submitText="Xóa tất cả"
        cancelText="Hủy"
      />
    </div>
  );
};

export default TaskAI;
