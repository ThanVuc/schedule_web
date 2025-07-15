import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface DialogProps {
    title: string
    description?: string
    trigger: string | React.ReactNode
    content: React.ReactNode
    onSubmit?: () => void
    submitText?: string
    cancelText?: string
    className?: string
}

export function AppDialog({
    title,
    description,
    trigger,
    submitText = "Submit",
    cancelText = "Cancel",
    className = "",
    content,
    onSubmit,
    }: DialogProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">{trigger}</Button>
        </DialogTrigger>
        <DialogContent className={className}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {content}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{cancelText}</Button>
            </DialogClose>
            <DialogClose asChild>
                <Button variant="secondary" onClick={() => onSubmit?.()}>{submitText}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
