"use client";

import { DateInput } from "@/components/common";

const UsersPage = () => {

    return (
        <>
            <DateInput
                className="w-64"
                defaultValue="01/01/2023"
                placeholder="dd/MM/yyyy"
                onChange={(date) => console.log("Selected date:", date)}
                onKeyDown={(e) => console.log("Key pressed:", e.key)}
            />
        </>
    );
};


export default UsersPage;

