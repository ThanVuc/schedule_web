import { InfoIcon } from "@/components/icon";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui";

const InfoWorkAIPopover = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <InfoIcon className="text-[#4E95FF] cursor-pointer" />
      </HoverCardTrigger>

      <HoverCardContent
        align="start"
        sideOffset={8}
        collisionPadding={12}
        className="z-[161] w-250 max-h-[400px] bg-white overflow-auto p-4 text-sm leading-relaxed"
      >
        <div className="space-y-3"
        onWheel={(e) => e.stopPropagation()}
        >
          <div className="text-center text-black font-semibold">
            Hướng Dẫn 1 - Công thức Tạo Việc
          </div>

          <div className="text-center text-gray-500">
            Tên công việc + Giờ/Buổi + Độ ưu tiên + Độ khẩn cấp + Độ khó + Mô tả ngắn
          </div>
          <hr />
          <div>
            <p className="font-medium text-black">Tên Công Việc (Bắt buộc)</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Viết rõ ràng, cụ thể. Ví dụ: “Chuẩn bị slide thuyết trình” thay vì chỉ ghi “Slide”.</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-black">Giờ hoặc Buổi (tùy chọn)</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Nếu cần chính xác: ghi giờ cụ thể (9h00, 14h30).</li>
              <li>Nếu chỉ cần khoảng: ghi theo buổi (sáng / chiều / tối), AI sẽ tự sắp xếp.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-black">Độ ưu tiên, Độ khẩn cấp, Độ khó (tùy chọn)</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Nếu ghi cụ thể thì hệ thống sẽ gán như bạn, còn không thì AI sẽ tự suy luận theo tên công việc.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-black">Mô tả ngắn gọn</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Ghi thêm chi tiết để AI hiểu rõ hơn. Ví dụ: “Slide cho buổi họp khách hàng, cần số liệu mới nhất”.</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-black">Ví dụ</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                Mô tả đầy đủ: Chuẩn bị slide thuyết trình bày kế hoạch marketing cho khách hàng
                vào 9h00 sáng, quan trọng, khẩn cấp và rất khó. Slide này dùng cho buổi họp khách
                hàng nên cần số liệu mới nhất.
              </li>
              <li>
                Mô tả siêu ngắn gọn: Làm slide thuyết trình bày kế hoạch marketing cho khách hàng.
              </li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-black">Ghi chú</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                Đây chỉ là gợi ý, bạn có thể sáng tạo và tự nhiên như đang kể lại những gì mình muốn
                làm trong ngày hôm nay cho người khác.
              </li>
              <li>
                Các gợi ý ở trên là các thuộc tính của công việc, nếu bạn không đưa ra mô tả thì AI
                sẽ tự động suy luận và tạo việc cho bạn dựa trên tên và cách dùng từ đã có.
              </li>
              <li>
                Khi viết xong một việc, nên enter xuống dòng để có thể phân biệt các công việc với nhau.
              </li>
            </ul>
          </div>

        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default InfoWorkAIPopover;
