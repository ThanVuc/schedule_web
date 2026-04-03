'use client';
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, Button, Textarea } from "@/components/ui";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import {
    CommentResponse,
    CreateCommentRequest,
    DeleteChecklistItemResponse,
    UpdateCommentRequest,
    UpdateCommentResponse,
} from "@/app/(pages)/te/_models/works/Comment";
import { SendIcon } from "@/components/icon/send";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useAxiosMutation, useToastState } from "@/hooks";
import { CommentListApiUrl } from "@/api/commentList";
import { useModalParams } from "@/app/(pages)/te/_hooks";

interface CommentComponentProps {
    listComments?: CommentResponse[];
    onRefreshComments?: () => void | Promise<void>;
}

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Just now";

    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const CommentComponent = ({ listComments, onRefreshComments }: CommentComponentProps) => {
    const { id } = useModalParams();
    const { setToast } = useToastState();
    
    const [comments, setComments] = useState<CommentResponse[]>(listComments || []);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState("");

    const { sendRequest: createComment } = useAxiosMutation<CommentResponse, CreateCommentRequest>({
        method: "POST",
        url: `${CommentListApiUrl.CreateComment}2c9179a9-a279-4b26-851a-44e16b814d54/works/${id}/comments`,
        headers: { "Content-Type": "application/json" }
    });

    const { sendRequest: updateComment } = useAxiosMutation<UpdateCommentResponse, UpdateCommentRequest>({
        method: "PATCH",
        url: `${CommentListApiUrl.UpdateComment}2c9179a9-a279-4b26-851a-44e16b814d54/works/${id}/comments`,
        headers: { "Content-Type": "application/json" }
    });

    const { sendRequest: deleteComment } = useAxiosMutation<DeleteChecklistItemResponse, unknown>({
        method: "DELETE",
        url: `${CommentListApiUrl.DeleteComment}2c9179a9-a279-4b26-851a-44e16b814d54/works/${id}/comments`,
        headers: { "Content-Type": "application/json" }
    });

    useEffect(() => {
        setComments(listComments || []);
    }, [listComments]);

    const handleAddComment = async () => {
        const trimmed = newComment.trim();
        if (!trimmed || isSubmitting) return;

        setIsSubmitting(true);
        const { data, error } = await createComment({ content: trimmed } as CreateCommentRequest);
        setIsSubmitting(false);

        if (error) {
            setToast({
                title: "Lỗi",
                message: "Không thể tạo comment.",
                variant: "error",
            });
            return;
        }

        setToast({
            title: "Thành công",
            message: "Đã thêm comment.",
            variant: "success",
        });

        setNewComment("");

        if (onRefreshComments) {
            await onRefreshComments();
            return;
        }

        if (data) {
            setComments((prev) => [...prev, data]);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        const { error } = await deleteComment(undefined, commentId);

        if (error) {
            setToast({
                title: "Lỗi",
                message: "Không thể xóa comment.",
                variant: "error",
            });
            return;
        }

        setToast({
            title: "Thành công",
            message: "Đã xóa comment.",
            variant: "success",
        });
        
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    const handleStartEdit = (comment: CommentResponse) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingContent("");
    };

    const handleSaveEdit = async (commentId: string) => {
        const trimmed = editingContent.trim();
        const currentComment = comments.find((comment) => comment.id === commentId);
        
        if (!trimmed || !currentComment) return;
        
        if (trimmed === currentComment.content) {
            handleCancelEdit();
            return;
        }

        const { error } = await updateComment({ content: trimmed } as UpdateCommentRequest, commentId);

        if (error) {
            setToast({
                title: "Lỗi",
                message: "Không thể cập nhật comment.",
                variant: "error",
            });
            return;
        }

        setToast({
            title: "Thành công",
            message: "Đã cập nhật comment.",
            variant: "success",
        });
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === commentId
                    ? {
                          ...comment,
                          content: trimmed,
                          updated_at: new Date().toISOString(),
                      }
                    : comment
            )
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
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage alt="ảnh đại diện" src={comment.creator?.avatar} />
                                        <AvatarFallback>
                                            {comment.creator?.email?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>

                                    <span className="text-sm font-semibold">
                                        {comment.creator?.email || "Unknown"}
                                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                                            {formatDate(comment.created_at)}
                                        </span>
                                    </span>
                                </div>

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
                                        <DropdownMenuItem onClick={() => handleStartEdit(comment)}>
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
                                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
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
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                        }
                    }}
                />
                <Button
                    size="icon"
                    className="shrink-0 bg-sky-500 hover:bg-sky-600"
                    onClick={handleAddComment}
                    disabled={isSubmitting}
                >
                    <SendIcon />
                </Button>
            </div>
        </div>
    );
};

export default CommentComponent;