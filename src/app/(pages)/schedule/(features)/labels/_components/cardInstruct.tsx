export const CardInstruct = () => {
    return (
        <div className="flex flex-col rounded-lg border p-4 pl-8 font-bold">
            <p className="text-md">Hướng dẫn sử dụng</p>
            <ul className="pl-8 py-6 list-disc list-inside space-y-2 text-[0.8rem]">
                <li>Mỗi công việc có thể có nhiều nhãn dán từ các danh mục khác nhau</li>
                <li>Màu sắc của nhãn giúp nhận biết nhanh chóng tình trạng và mức độ ưu tiên</li>
                <li>Sử dụng kết hợp các nhãn để có cái nhìn tổng quan về công việc</li>
                <li>Thường xuyên cập nhật trạng thái để đảm bảo thông tin chính xác</li>
                <li>Ở các nhãn độ khó, không phải tuyệt đối là việc càng khó càng tốn thời gian, chỉ mang tính tương đối</li>
            </ul>
        </div>
    );
}
