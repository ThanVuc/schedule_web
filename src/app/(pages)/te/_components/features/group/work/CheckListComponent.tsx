'use client';
import {
    CreateChecklistItemRequest,
    ChecklistItemResponse,
    UpdateChecklistItemRequest,
    UpdateChecklistItemResponse,
} from "@/app/(pages)/te/_models/works/CheckList";
import { TrashIcon } from "@/components/icon/trash";
import { Button, Checkbox, Input } from "@/components/ui";
import { useEffect, useMemo, useRef, useState } from "react";

interface CheckListComponentProps {
    items?: ChecklistItemResponse[];
    onCreateItem?: (payload: CreateChecklistItemRequest) => Promise<ChecklistItemResponse | null>;
    onUpdateItem?: (
        checklistId: string,
        payload: UpdateChecklistItemRequest,
    ) => Promise<UpdateChecklistItemResponse | null>;
}

const data: ChecklistItemResponse[] = [
    {
        id: "1",
        name: "Design login page",
        is_completed: false,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    {
        id: "2",
        name: "Implement authentication API",
        is_completed: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
    }]

const CheckListComponent = ({ items: initialItems = data, onCreateItem, onUpdateItem }: CheckListComponentProps) => {
    const [items, setItems] = useState<ChecklistItemResponse[]>(initialItems);
    const [newItemName, setNewItemName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const updateTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const latestCompletedRef = useRef<Record<string, boolean>>({});

    const completedCount = useMemo(
        () => items.filter((item) => item.is_completed).length,
        [items],
    );

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
                        <span title={item.name} className={`min-w-0 flex-1 truncate text-base leading-6 ${item.is_completed
                            ? "text-slate-400 line-through"
                            : "text-slate-200"
                            }`}>
                            {item.name}
                        </span>
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
                    onChange={(event) => setNewItemName(event.target.value)}
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