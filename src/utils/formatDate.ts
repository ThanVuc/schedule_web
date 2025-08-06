export const formatDate = (value: string) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "Chưa cập nhật";
    return date.toLocaleDateString("vi-VN");
};
