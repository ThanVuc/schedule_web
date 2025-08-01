import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components/ui";
import { Control, FieldValues } from "react-hook-form";

interface CardMotivationProps {
    isEditing?: boolean;
    control?: Control<FieldValues>;
    sentence?: string;
    author?: string;
}

const CardMotivation = ({ isEditing = false, control, sentence, author }: CardMotivationProps) => {
    if (!isEditing || !control) {
        return (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/10 transition-all">
                <p className="text-white text-base mb-2 italic">{sentence || "Không có động lực"}</p>
                <p className="text-white/70 text-sm italic">- {author || "Không rõ tác giả"}</p>
            </div>
        );
    }
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/10 transition-all">
            <FormField
                control={control}
                name="motivation"
                render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormControl >
                            <Input
                                className="disabled:opacity-100 disabled:text-white disabled:font-bold bg-transparent border border-white/10 text-white"
                                disabled={!isEditing}
                                {...field}
                                placeholder="Nhập động lực"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="author"
                render={({ field }) => (
                    <FormItem>
                        <FormControl >
                            <Input
                                className="disabled:opacity-100 disabled:text-white bg-transparent border border-white/10 text-white"
                                disabled={!isEditing}
                                {...field}
                                placeholder="Nhập tác giả"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default CardMotivation;
