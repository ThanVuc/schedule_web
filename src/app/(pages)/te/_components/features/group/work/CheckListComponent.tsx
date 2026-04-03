'use client';
import {
    CreateChecklistItemRequest,
    ChecklistItemResponse,
    UpdateChecklistItemRequest,
    UpdateChecklistItemResponse,
    DeleteChecklistItemResponse,
} from "@/app/(pages)/te/_models/works/CheckList";
import { TrashIcon } from "@/components/icon/trash";
import { Button, Checkbox, Input } from "@/components/ui";
import { useEffect, useMemo, useRef, useState } from "react";

interface CheckListComponentProps {
    checklistItems?: ChecklistItemResponse[];
    onCreateItem?: (payload: CreateChecklistItemRequest) => Promise<ChecklistItemResponse | null>;
    onUpdateItem?: (checklistId: string, payload: UpdateChecklistItemRequest) => Promise<UpdateChecklistItemResponse | null>;
    onDeleteItem?: (checklistId: string) => Promise<DeleteChecklistItemResponse | null>;
}



const CheckListComponent = ({ checklistItems, onCreateItem, onUpdateItem, onDeleteItem }: CheckListComponentProps) => {
    const [items, setItems] = useState<ChecklistItemResponse[]>(checklistItems || []);
    const [newItemName, setNewItemName] = useState("");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const updateTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const latestCompletedRef = useRef<Record<string, boolean>>({});

    const completedCount = useMemo(
        () => items.filter((item) => item.is_completed).length,
        [items],
    );

    useEffect(() => {
        setItems(checklistItems || []);
    }, [checklistItems]);

    useEffect(() => {
        return () => {
            Object.values(updateTimersRef.current).forEach((timer) => clearTimeout(timer));
        };
    }, []);

    const scheduleUpdate = (id: string, nextCompleted: boolean) => {
        latestCompletedRef.current[id] = nextCompleted;

        if (!onUpdateItem) return;

        const currentTimer = updateTimersRef.current[id];
        if (currentTimer) {
            clearTimeout(currentTimer);
        }

        updateTimersRef.current[id] = setTimeout(async () => {
            await onUpdateItem(id, { is_completed: latestCompletedRef.current[id] });
        }, 400);
    };

    const toggleItem = (id: string) => {
        let nextCompleted = false;

        setItems((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;

                nextCompleted = !item.is_completed;
                return {
                    ...item,
                    is_completed: nextCompleted,
                    updated_at: new Date().toISOString(),
                };
            }),
        );

        scheduleUpdate(id, nextCompleted);
    };

    const removeItem = (id: string) => {
        if (onDeleteItem) {
            onDeleteItem(id);
        }
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const addItem = async () => {
        const trimmedName = newItemName.trim();
        if (!trimmedName || isSubmitting) {
            return;
        }

        if (onCreateItem) {
            setIsSubmitting(true);
            const createdItem = await onCreateItem({ name: trimmedName });
            setIsSubmitting(false);

            if (!createdItem) {
                return;
            }

            setItems((prev) => [...prev, createdItem]);
            setNewItemName("");
            return;
        }

        const now = new Date().toISOString();
        const checklistItem: ChecklistItemResponse = {
            id: crypto.randomUUID(),
            name: trimmedName,
            is_completed: false,
            created_at: now,
            updated_at: now,
        };

        setItems((prev) => [...prev, checklistItem]);
        setNewItemName("");
    };

    const startEditItem = (item: ChecklistItemResponse) => {
        setEditingItemId(item.id);
        setEditingName(item.name);
    };

    const cancelEditItem = () => {
        setEditingItemId(null);
        setEditingName("");
    };

    const saveEditItem = async (id: string) => {
        const trimmedName = editingName.trim();
        const currentItem = items.find((item) => item.id === id);

        if (!currentItem) {
            cancelEditItem();
            return;
        }

        if (!trimmedName || trimmedName === currentItem.name) {
            cancelEditItem();
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, name: trimmedName, updated_at: new Date().toISOString() }
                    : item,
            ),
        );

        cancelEditItem();

        if (onUpdateItem) {
            await onUpdateItem(id, { name: trimmedName });
        }
    };
    items.map(item => console.log(item.id))
    return (<>
        <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Checklist</h3>
                <span className="text-sm font-medium">
                    {completedCount} / {items.length}
                </span>
            </div>

            <div className="space-y-3">

                {items.map((item) => (
                    <div key={item.id} className="group flex min-w-0 items-center gap-3">

                        <Checkbox
                            checked={item.is_completed}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="size-[18px] rounded-sm border-slate-400"
                        />
                        {editingItemId === item.id ? (
                            <Input
                                value={editingName}
                                onChange={(event) => setEditingName(event.target.value)}
                                onBlur={() => saveEditItem(item.id)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        saveEditItem(item.id);
                                    }

                                    if (event.key === "Escape") {
                                        event.preventDefault();
                                        cancelEditItem();
                                    }
                                }}
                                autoFocus
                                className="h-8 min-w-0 flex-1 border-none bg-transparent px-0 text-base text-slate-200 shadow-none focus-visible:ring-0"
                            />
                        ) : (
                            <span
                                title="Bấm để chỉnh sửa"
                                onClick={() => startEditItem(item)}
                                className={`min-w-0 flex-1 cursor-text truncate text-base leading-6 ${item.is_completed
                                    ? "text-slate-400 line-through"
                                    : "text-slate-200"
                                    }`}
                            >
                                {item.name}
                            </span>
                        )}
                        <button
                            type="button"
                            aria-label={`Delete ${item.name}`}
                            onClick={() => removeItem(item.id)}
                            className="text-slate-500 transition-colors hover:text-slate-200"
                        >
                            <TrashIcon className="size-4" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Input
                    value={newItemName}
                    onChange={(event) => {
                        setNewItemName(event.target.value)
                    }
                    }
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            addItem();

                        }
                    }}
                    placeholder="Thêm mục checklist..."
                    className="h-9 border-none bg-transparent px-0 text-base text-slate-300 shadow-none placeholder:text-slate-500 focus-visible:ring-0"
                />
                <Button
                    type="button"
                    onClick={addItem}
                    disabled={isSubmitting}
                    className="h-9 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-500"
                >
                    {isSubmitting ? "Đang thêm..." : "Thêm"}
                </Button>
            </div>
        </div>
    </>);
}

export default CheckListComponent;