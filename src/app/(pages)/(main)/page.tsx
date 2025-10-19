import { redirect } from "next/navigation";

export const metadata = {
    title: 'Schedulr',
    description: 'Ứng dụng lịch trình của bạn',
};

const RootPage = () => {
    redirect("/landing");
}

export default RootPage;
