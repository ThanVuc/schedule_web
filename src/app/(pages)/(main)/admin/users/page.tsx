"use client";

import useToastState from "@/hooks/useToasts";
import NotificationsButton from "../../_components/notification";

const UsersPage = () => {
    const { setToast } = useToastState();
    return (
        <>
            <button
                onClick={() =>
                    setToast({
                        title: "Thành công",
                        message: "Bạn đã lưu thành công!",
                    })
                }
            >
                Hiện toast
            </button>
        </>
    );
};


export default UsersPage;

