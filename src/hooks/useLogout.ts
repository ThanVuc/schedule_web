"use client";

import { authApiUrl } from "@/api";
import { useAxiosMutation } from "./useAxios";
import useToastState from "./useToasts";

export const useLogout = () => {
    const { sendRequest } = useAxiosMutation({
        url: authApiUrl.logout,
        method: 'POST',
    })
    const { setToast } = useToastState();

    const logout = async () => {
        try {
            const { error } = await sendRequest();
            if (error) {
                throw new Error(error.message);
            }
            setToast({
                title: "Đăng xuất thành công",
                message: "Bạn đã đăng xuất khỏi tài khoản của mình",
                variant: "success",
            });
        } catch (error) {
            console.error("Logout error:", error);
            setToast({
                title: "Đăng xuất thất bại",
                message: "Đã có lỗi xảy ra, vui lòng thử lại",
                variant: "error",
            });
        }
    }

    return { logout };
}