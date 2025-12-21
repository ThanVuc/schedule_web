"use client";

import { AddIcon, TargetIcon } from "@/components/icon";
import { Button } from "@/components/ui";
import { Title } from "../../_components/title";
import { useRouter, useSearchParams } from "next/navigation";
import { ModelType } from "../../_constant";
import { ListGoal } from "./_components";
const GoalPage = () => {

    const searchParams = useSearchParams();
    const router = useRouter();

    const handlePageQueryToModal = (mode: string, id?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", mode);
        if (id) {
            params.set("id", id)
        } else {
            params.delete("id");
        }

        router.push(`/schedule/goal?${params.toString()}`, { scroll: false });
    }

    return (
        <>
            <div className="flex justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Title>Quản Lý Mục Tiêu</Title>
                    <TargetIcon />
                </div>
                <div>
                    <div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
                            onClick={() => { handlePageQueryToModal(ModelType.CREATE) }}>
                            <AddIcon />
                            Tạo mục tiêu
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-2 flex flex-wrap gap-3 justify-center">
                <ListGoal />
            </div>
        </>
    );
};

export default GoalPage;
