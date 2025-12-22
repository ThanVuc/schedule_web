"use client";
import { useEffect, useState } from "react";
import { Input } from "../ui";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";

export interface AppSearchProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    className?: string;
}

export const AppSearchSimple = (
    { onSearch, placeholder = "Tìm kiếm...", className }: AppSearchProps
) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                className={`pl-10 ${className}`}
                placeholder={placeholder}
                value={searchQuery}
                onChange={handleSearch}
            />
        </div>
    );
}

export const AppSearch = (
    { placeholder = "Tìm kiếm...", className }: AppSearchProps
) => {
    const searchParam = useSearchParams();
    const [searchString, setSearchString] = useState(() => searchParam.get("search") || "");
    const router = useRouter();
    const debouncedValue = useDebounce(searchString, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParam.toString());
        const debouncedValueTrimmed = (debouncedValue as string).trim();
        if (debouncedValueTrimmed) {
            params.set("search", debouncedValueTrimmed as string);
        } else {
            params.delete("search");
        }
        router.push(`?${params.toString()}`);
    }, [debouncedValue]);

    const handleSearch = (query: string) => {
        setSearchString(query);
    };


    return (
        <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                className={`pl-10 min-w-[15rem] ${className}`}
                placeholder={placeholder}
                value={searchString}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    )
}