import { InfoIcon } from "@/components/icon";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const InfoAdditional = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <InfoIcon className="text-[#4E95FF] cursor-pointer" />
      </HoverCardTrigger>

      <HoverCardContent
        align="start"
        sideOffset={8}
        collisionPadding={12}
        className="z-[161] w-[250px] max-h-[400px] bg-white p-4 text-sm leading-relaxed"
      >
        <div
          className="space-y-3 overflow-y-auto max-h-[360px]"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="text-center font-semibold text-black">
            Hướng Dẫn 2
          </div>

          <div className="text-gray-600">
            Bạn có thể cung cấp thêm ngữ cảnh làm việc thực tế của bản thân để AI tạo ra công việc chính xác hơn. Ví dụ:
          </div>

          <ul className="list-decimal pl-5 text-gray-700 space-y-1">
            <li>
              Tôi phải đi làm từ 8h sáng tới 17h chiều, nên không sắp những công việc cá nhân vào những khung giờ đó.
            </li>
            <li>
              Tôi không cần tạo sub-tasks cho các công việc dễ.
            </li>
            <li>
              Tôi muốn có detail description cho các công việc khó.
            </li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default InfoAdditional;