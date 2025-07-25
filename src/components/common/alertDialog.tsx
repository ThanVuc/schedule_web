"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export interface AlertDialogProps {
  title: string
  description?: string
  trigger?: string | React.ReactNode
  onSubmit?: () => void
  submitText?: string
  cancelText?: string
  className?: string
  open?: boolean
  setOpen?: (open: boolean) => void
  onClose?: () => void
}

export function AppAlertDialog(
  {
    title,
    description,
    trigger,
    submitText = "Tiếp Tục",
    cancelText = "Hủy Bỏ",
    className = "",
    onSubmit,
    open = false,
    setOpen = () => {},
    onClose,
  }: AlertDialogProps
) {

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open && onClose) {
      onClose();
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <AlertDialogTrigger asChild>
          {typeof trigger === "string" ? (
            <Button variant="destructive" className="w-full">{trigger}</Button>
          ) : (
            trigger
          )}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className={`z-200 ${className}`}>
        <AlertDialogHeader>
          <AlertDialogTitle >{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={() => onSubmit && onSubmit()} >{submitText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
