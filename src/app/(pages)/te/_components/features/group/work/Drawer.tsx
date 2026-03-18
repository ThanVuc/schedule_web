'use client';
import { CloseIcon } from "@/components/icon";
import { DrawerTrigger, Drawer, DrawerContent, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
interface DrawerComponentProps {
    trigger?: React.ReactNode;
    onSubmit?: (data: unknown) => void;
    onClose?: () => void;
    setOpen?: (open: boolean) => void;
    open?: boolean;
    className?: string;
    children?: React.ReactNode;
    submitButtonText?: string | null;
    cancelButtonText?: string;
    BottomComponent?: React.ReactNode;
}

export const DrawerComponent = ({ trigger,
    onClose, setOpen = () => {}, open, className = "", children }: DrawerComponentProps) => {
    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open && onClose) {
            onClose();
        }
    };
    return (<>
        <div>
            <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
                <DrawerTrigger asChild>
                    {trigger}
                </DrawerTrigger>
                <DrawerContent className={`${className} h-screen overflow-hidden`}>
                    <div className="border-b-3 border-[#000000] pb-2">
                        <div className="flex justify-between m-4">
                            <DrawerTitle className="text-lg font-bold">Thông tin công việc</DrawerTitle>
                            <DrawerClose asChild>
                                <CloseIcon />
                            </DrawerClose>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    </>);
}