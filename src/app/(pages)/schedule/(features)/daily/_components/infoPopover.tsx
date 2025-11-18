import { InfoIcon } from "@/components/icon";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui";

interface InfoItem {
  label: "WorkType" | "Status" | "Difficulty" | "Priority" | "Category";
}

const InfoPopover = ({ label }: InfoItem) => {
  const infoData = {
    WorkType: {
      title: "Loại công việc",
      items: [
          { label: "Lặp lại", desc: "Công việc được thực hiện định kỳ, lặp lại theo chu kỳ." },
        { label: "Trong ngày", desc: "Công việc thực hiện chỉ trong ngày hôm đó." },
        { label: "Nhóm", desc: "Công việc được đồng bộ từ các nhóm của bạn, sẽ biến mất khi hoàn thành hoặc xóa trong nhóm." },
      ],
    },
    Status: {
      title: "Trạng thái công việc",
      items: [
        { label: "Chờ làm", desc: "Công việc đã được lên kế hoạch nhưng chưa bắt đầu." },
        { label: "Đang làm", desc: "Công việc đang được thực hiện." },
        { label: "Hoàn thành", desc: "Công việc đã được hoàn thành thành công." },
        { label: "Quá hạn", desc: "Công việc đã vượt quá thời hạn quy định (nhưng vẫn nằm trong ngày)." },
        { label: "Bỏ cuộc", desc: "Công việc đã hết ngày nhưng chưa hoàn thành." },
    ],
    },
    Difficulty: {
      title: "Mức độ khó",
      items: [
        { label: "Dễ", desc: "Công việc đơn giản, không yêu cầu kỹ năng cao và công sức nhiều." },
        { label: "Trung bình", desc: "Công việc có độ phức tạp vừa phải." },
        { label: "Khó", desc: "Công việc yêu cầu sự tập trung cao hoặc thời gian lớn." },
      ],
    },
    Priority: {
      title: "Mức độ ưu tiên",
      items: [
        { label: "Quan trọng & Khẩn cấp", desc: "Ưu tiên cao nhất - cần xử lý ngay lập tức." },
        { label: "Quan trọng & Không khẩn cấp", desc: "Quan trọng nhưng có thể lên kế hoạch thực hiện." },
        { label: "Không quan trọng & Khẩn cấp", desc: "Cần xử lý nhanh nhưng không ảnh hưởng lớn." },
        { label: "Không quan trọng & Không Khẩn cấp", desc: "Ưu tiên thấp nhất - có thể hoãn lại." },
      ],
    },
    Category: {
      title: "Danh mục công việc",
      items: [
        { label: "Công việc", desc: "Nhiệm vụ liên quan đến nghề nghiệp, công ty, kinh doanh hoặc dự án đang làm." },
        { label: "Cá nhân", desc: "Hoạt động riêng tư ngoài công việc." },
        { label: "Học tập", desc: "Các hoạt động học hỏi, nghiên cứu, hoặc đào tạo." },
        { label: "Gia đình", desc: "Công việc nhà và trách nhiệm trong gia đình." },
        { label: "Tài chính", desc: "Quản lý tiền bạc và công việc hành chính." },
        { label: "Sức khoẻ", desc: "Các hoạt động chăm sóc thể chất và tinh thần." },
        { label: "Xã hội", desc: "Các hoạt động chăm sóc thể chất và tinh thần." },
        { label: "Di chuyển", desc: "Việc đi lại từ nơi này đến nơi khác." },
      ],
    },
  };

  const current = infoData[label];

  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <InfoIcon className="text-[#4E95FF] cursor-pointer" />
        </HoverCardTrigger>
        <HoverCardContent className="!z-[161] w-120 p-4">
          <div>
            <div className="text-center font-semibold mb-3">
              <p>{current.title}</p>
            </div>

            <div className="flex flex-col gap-4">
              {current.items.map((item, idx) => (
                <div key={idx} className="flex">
                  <p className="w-25 text-sm font-medium">{item.label}</p>
                  <p className="text-sm flex-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default InfoPopover;
