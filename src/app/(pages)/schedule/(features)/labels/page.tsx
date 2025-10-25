import { LabelIcon } from "@/components/icon";
import { Title } from "../../_components/title";
import { CardInstruct, CardTypeLabel } from "./_components";

const LabelInformationPage = () => {
    return (
        <div className="flex flex-col size-auto gap-6">
            <div className="flex gap-2 items-center pt-6 px-4">
                <Title>Thông Tin Nhãn Dán</Title>
                <LabelIcon />
            </div>
            <CardTypeLabel />
            <CardInstruct />
        </div>
    )
}

export default LabelInformationPage;