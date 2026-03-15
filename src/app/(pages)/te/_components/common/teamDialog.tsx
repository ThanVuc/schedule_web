"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AlertTriangleIcon, CheckCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export {
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export type DialogSize = "sm" | "md" | "lg"

const dialogSizeClasses: Record<DialogSize, string> = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-lg",
    lg: "sm:max-w-3xl",
}
export interface DialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    warnOnClose?: boolean
}

export function Dialog({
    warnOnClose = false,
    onOpenChange,
    ...props
}: DialogProps) {
    const [showExitAlert, setShowExitAlert] = React.useState(false)
    const resolveClose = React.useRef<((confirmed: boolean) => void) | null>(null)

    const handleOpenChange = React.useCallback(
        async (open: boolean) => {
            if (!open && warnOnClose) {
                const confirmed = await new Promise<boolean>((resolve) => {
                    resolveClose.current = resolve
                    setShowExitAlert(true)
                })
                if (!confirmed) return
            }
            onOpenChange?.(open)
        },
        [warnOnClose, onOpenChange],
    )

    return (
        <>
            <DialogPrimitive.Root data-slot="dialog" onOpenChange={handleOpenChange} {...props} />

            {showExitAlert && (
                <ExitConfirmAlert
                    onConfirm={() => { setShowExitAlert(false); resolveClose.current?.(true); resolveClose.current = null }}
                    onCancel={() => { setShowExitAlert(false); resolveClose.current?.(false); resolveClose.current = null }}
                />
            )}
        </>
    )
}

import {
    DialogContent as BaseDialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui"

export interface DialogContentProps extends React.ComponentProps<typeof BaseDialogContent> {
    size?: DialogSize
}

export function DialogContent({
    size = "md",
    className,
    ...props
}: DialogContentProps) {
    return (
        <BaseDialogContent
            className={cn(dialogSizeClasses[size], className)}
            {...props}
        />
    )
}

function AlertCard({ children }: { children: React.ReactNode }) {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0" />

            <DialogPrimitive.Content
                className={cn(
                    "fixed left-1/2 top-1/2 z-[201] w-full max-w-sm -translate-x-1/2 -translate-y-1/2",
                    "rounded-lg border bg-background p-6 shadow-xl focus:outline-none",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                )}
            >
                <VisuallyHidden>
                    <DialogPrimitive.Title>Dialog</DialogPrimitive.Title>
                </VisuallyHidden>

                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    )
}

export function ExitConfirmAlert({
    onConfirm,
    onCancel,
}: {
    onConfirm: () => void
    onCancel: () => void
}) {
    return (
        <DialogPrimitive.Root open onOpenChange={(open) => { if (!open) onCancel() }}>
            <AlertCard>
                <div className="flex items-start gap-3">
                    <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-amber-500" />
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold text-foreground">Hủy các thay đổi?</p>
                        <p className="text-sm text-muted-foreground">
                            Bạn có thông tin chưa được lưu. Nếu đóng bây giờ, các thay đổi của bạn sẽ bị mất.
                        </p>
                    </div>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                    <Button onClick={onCancel} className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Tiếp tục chỉnh sửa</Button>
                    <Button onClick={onConfirm} className="inline-flex h-9 items-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Hủy các thay đổi</Button>
                </div>
            </AlertCard>
        </DialogPrimitive.Root>
    )
}

export function SubmitConfirmModal({
    title = "Xác nhận",
    description = "Bạn có chắc chắn muốn thực hiện hành động này không?",
    confirmLabel = "Xác nhận",
    cancelLabel = "Hủy",
    onConfirm,
    onCancel,
}: {
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void
}) {
    return (
        <DialogPrimitive.Root open onOpenChange={(open) => { if (!open) onCancel() }}>
            <AlertCard>
                <div className="flex items-start gap-3">
                    <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div className="flex flex-col gap-1">
                        <p className="font-semibold text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                    <Button onClick={onCancel} className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">{cancelLabel}</Button>
                    <Button onClick={onConfirm} className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">{confirmLabel}</Button>
                </div>
            </AlertCard>
        </DialogPrimitive.Root>
    )
}

export interface UseDialogSubmitOptions {
    onSubmit: () => void | Promise<void>
    confirmSubmit?: boolean
    confirmTitle?: string
    confirmDescription?: string
    confirmLabel?: string
    cancelLabel?: string
}

export function useDialogSubmit({
    onSubmit,
    confirmSubmit = false,
    confirmTitle,
    confirmDescription,
    confirmLabel,
    cancelLabel,
}: UseDialogSubmitOptions) {
    const [showConfirm, setShowConfirm] = React.useState(false)

    const handleSubmit = React.useCallback(() => {
        if (confirmSubmit) {
            setShowConfirm(true);
        } else {
            onSubmit();
        }
    }, [confirmSubmit, onSubmit]);

    const confirmModal = showConfirm ? (
        <SubmitConfirmModal
            title={confirmTitle}
            description={confirmDescription}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            onConfirm={() => { setShowConfirm(false); onSubmit() }}
            onCancel={() => setShowConfirm(false)}
        />
    ) : null

    return { handleSubmit, confirmModal }
}