import { AssignWorkSchema } from "@/app/(pages)/te/_models/works/schema/AssginWork.schema";
import { Avatar, AvatarFallback, AvatarImage, FormField, FormMessage, Input } from "@/components/ui";
import { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

type AssignWorkForm = z.infer<typeof AssignWorkSchema>;
interface AssignWorkFormProps {
    form: UseFormReturn<AssignWorkForm>;
}

type MockMember = {
    id: string;
    name: string;
    avatar_url: string;
};

const mockMembers: MockMember[] = [
    { id: "u1", name: "John Doe", avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=John" },
    { id: "u2", name: "Jane Smith", avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Jane" },
    { id: "u3", name: "Bob Johnson", avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Bob" },
    { id: "u4", name: "Alice Williams", avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Alice" },
    { id: "u5", name: "Charlie Brown", avatar_url: "https://api.dicebear.com/9.x/personas/svg?seed=Charlie" },
];

const AssignWorkForm = ({ form }: AssignWorkFormProps) => {
    const [searchMember, setSearchMember] = useState("");
    const selectedAvatarUrl = form.watch("avatar_url");

    const filteredMembers = useMemo(() => {
        if (!searchMember.trim()) {
            return mockMembers;
        }

        const keyword = searchMember.toLowerCase().trim();
        return mockMembers.filter((member) => member.name.toLowerCase().includes(keyword));
    }, [searchMember]);

    const assignMember = (member: MockMember | null) => {
        form.setValue("name", member?.name ?? "Unassigned", {
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
                    className={`flex h-11 w-full items-center rounded-xl border px-4 text-left text-sm font-semibold transition-colors ${
                        !selectedAvatarUrl
                            ? "border-[#2A97EA] bg-[#0F1A2B] text-white"
                            : "border-[#243754] bg-[#091528] text-[#D3DAE4] hover:border-[#2A97EA]/70"
                    }`}
                >
                    Unassigned
                </button>

                {filteredMembers.map((member) => {
                    const isSelected = selectedAvatarUrl === member.avatar_url;
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
                            className={`flex h-14 w-full items-center gap-3 rounded-xl border px-4 text-left transition-colors ${
                                isSelected
                                    ? "border-[#2A97EA] bg-[#0F1A2B]"
                                    : "border-[#243754] bg-[#091528] hover:border-[#2A97EA]/70"
                            }`}
                        >
                            <Avatar className="size-8 border border-[#2A3A4F]">
                                <AvatarImage src={member.avatar_url} alt={member.name} />
                                <AvatarFallback className="bg-[#1A2332] text-[10px] text-[#D3DAE4]">
                                    {fallback}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-base font-medium text-[#D3DAE4]">{member.name}</span>
                        </button>
                    );
                })}
            </div>

            <FormField
                name="name"
                control={form.control}
                render={() => <FormMessage className="mt-3" />}
            />
        </>
    );
}
 
export default AssignWorkForm;