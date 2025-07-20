"use client";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog";

export interface AppDialogProps {
  trigger: React.ReactNode;
  onSubmit?: (data: unknown) => void;
  onClose?: () => void;
  setOpen?: (open: boolean) => void;
  open?: boolean;
  className?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  children?: React.ReactNode;
  width?: "large" | "medium" | "small";
  height?: "large" | "medium" | "small";
  submitButtonText?: string | null;
  cancelButtonText?: string;
}

export const AppDialog = ({
  trigger,
  onSubmit,
  onClose,
  className = "",
  dialogTitle = "",
  dialogDescription = "",
  children,
  width = "large",
  height = "large",
  open = false,
  setOpen = () => { },
  submitButtonText = "Lưu",
  cancelButtonText = "Hủy Bỏ",
}: AppDialogProps) => {

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open && onClose) {
      onClose();
    }
  }
  const dialogWidthClass = width === "large" ? "w-[90%]" : width === "medium" ? "w-[60%]" : "w-[40%]";
  const dialogHeightClass = height === "large" ? "h-[90vh]" : height === "medium" ? "h-[70vh]" : "h-[50vh]";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} >
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent
        className={`z-160 flex flex-col justify-between ${dialogWidthClass} ${dialogHeightClass} !max-w-none max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        <div>
          <DialogHeader className="mb-4">
            <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="p-2">
            {children}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelButtonText}</Button>
          </DialogClose>
          {submitButtonText && (
            <Button type="button" onClick={() => {
              if (onSubmit) {
                onSubmit({});
              }
            }}>{submitButtonText}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
