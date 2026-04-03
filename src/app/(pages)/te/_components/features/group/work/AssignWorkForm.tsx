import { AssignWorkSchema } from "@/app/(pages)/te/_models/works/schema/AssginWork.schema";
import { ListSimpleUserResponse } from "@/app/(pages)/te/_models/works/WorkResponse";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    FormMessage,
    Input
} from "@/components/ui";
import { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

type AssignWorkForm = z.infer<typeof AssignWorkSchema>;

interface AssignWorkFormProps {
    form: UseFormReturn<AssignWorkForm>;
    listUser?: ListSimpleUserResponse[];
}

type MemberOption = {
    id: ListSimpleUserResponse["id"];
    name: string;
    avatar_url?: string;
};

const AssignWorkForm = ({ form, listUser }: AssignWorkFormProps) => {
    const [searchMember, setSearchMember] = useState("");

    const selectedUserId = form.watch("id");

    const filteredMembers = useMemo(() => {
        const mappedMembers: MemberOption[] =
            listUser?.map((user) => ({
                id: user.id,
                name: user.email,
                avatar_url: user.avatar_url,
            })) ?? [];

        if (!searchMember.trim()) return mappedMembers;

        const keyword = searchMember.toLowerCase().trim();
        return mappedMembers.filter((member) =>
            member.name.toLowerCase().includes(keyword)
        );
    }, [listUser, searchMember]);

    const assignMember = (member: MemberOption | null) => {
        form.setValue("id", member?.id ?? undefined, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });

        form.setValue("email", member?.name ?? "", {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });

        form.setValue("avatar_url", member?.avatar_url, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
        });
    };

    return (
        <>
                <p className="mb-3 text-sm text-[#8EA0B8]">
                    Assign to a team member
                </p>

                <Input
                    value={searchMember}
                    onChange={(event) => setSearchMember(event.target.value)}
                    placeholder="Search member..."
                    className="mb-4 h-10 rounded-xl border-[#2A3A4F] bg-[#172338] text-white placeholder:text-[#6E7E93]"
                />

                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={() => assignMember(null)}
                        className={`flex h-11 w-full items-center rounded-xl border px-4 text-left text-sm font-semibold ${!selectedUserId
                                ? "border-[#2A97EA] bg-[#0F1A2B] text-white"
                                : "border-[#243754] bg-[#091528]"
                            }`}
                    >
                        Bỏ trống
                    </button>

                    {filteredMembers.map((member) => {
                        const isSelected = selectedUserId === member.id;

                        const fallback = member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                        return (
                            <button
                                key={member.id}
                                type="button"
                                onClick={() => assignMember(member)}
                                className={`flex h-14 w-full items-center gap-3 rounded-xl border px-4 ${isSelected
                                        ? "border-[#2A97EA] bg-[#0F1A2B]"
                                        : "border-[#243754] bg-[#091528]"
                                    }`}
                            >
                                <Avatar className="size-8 border border-[#2A3A4F]">
                                    <AvatarImage src={member.avatar_url} />
                                    <AvatarFallback>
                                        {fallback}
                                    </AvatarFallback>
                                </Avatar>

                                <span>{member.name}</span>
                            </button>
                        );
                    })}
                </div>

                <FormMessage className="mt-3" />
            </>
    );
};

export default AssignWorkForm;