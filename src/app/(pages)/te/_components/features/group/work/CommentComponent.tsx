'use client';
import { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { CommentResponse } from "@/app/(pages)/te/_models/works/Comment";
import { SendIcon } from "@/components/icon/send";


const mockComments: CommentResponse[] = [
    {
        id: "1",
        creator: { id: "user-1", name: "John Doe"},
        content: "Looking good! .",
        created_at: "2024-12-02",
        updated_at: "2024-12-02",
    },
    {
        id: "2",
        creator: { id: "user-2", name: "Jane Smith"},
        content: "Thanks for the feedback!",
        created_at: "2024-12-02",
        updated_at: "2024-12-02",
    },
];
interface CommentComponentProps {
    comments?: CommentResponse[];
}

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const CommentComponent = ({ comments: initialComments }: CommentComponentProps) => {
    const [comments, setComments] = useState<CommentResponse[]>(initialComments || mockComments);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState("");

    const handleAddComment = () => {
        const trimmed = newComment.trim();
        if (!trimmed) return;

        const now = new Date().toISOString();
        const comment: CommentResponse = {
            id: crypto.randomUUID(),
            creator: { id: "me", name: "Me"},
            content: trimmed,
            created_at: now,
            updated_at: now,
        };

        setComments((prev) => [...prev, comment]);
        setNewComment("");
    };

    const handleDeleteComment = (id: string) => {
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    const handleStartEdit = (comment: CommentResponse) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingContent("");
    };

    const handleSaveEdit = (id: string) => {
        const trimmed = editingContent.trim();
        if (!trimmed) return;

        setComments((prev) =>
            prev.map((comment) =>
                comment.id === id
                    ? {
                          ...comment,
                          content: trimmed,
                          updated_at: new Date().toISOString(),
                      }
                    : comment,
            ),
        );

        handleCancelEdit();
    };

    return (
        <div className="space-y-4 p-5">
            <h3 className="text-xl font-semibold">Comments</h3>
            <div className="space-y-3">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="flex gap-3 rounded-xl bg-[#1a2535] p-4"
                    >

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold">
                                    {comment.creator.name}
                                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                                        {formatDate(comment.created_at)}
                                    </span>
                                </span>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-6 shrink-0"
                                        >
                                            <MoreVerticalIcon className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => handleStartEdit(comment)}
                                        >
                                            Chỉnh sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {editingCommentId === comment.id ? (
                                <div className="mt-2 space-y-2">
                                    <Textarea
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        className="min-h-[80px]"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSaveEdit(comment.id);
                                            }
                                        }}
                                    />
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                                            Hủy
                                        </Button>
                                        <Button size="sm" onClick={() => handleSaveEdit(comment.id)}>
                                            Lưu
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {comment.content}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Thêm bình luận..."
                    className="min-h-[42px] max-h-32 resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                        }
                    }}
                />
                <Button
                    size="icon"
                    className="shrink-0  bg-sky-500 hover:bg-sky-600"
                    onClick={handleAddComment}
                >
                    <SendIcon/>
                </Button>
            </div>
        </div>
    );
};

export default CommentComponent;