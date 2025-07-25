"use client";

import { DateInput } from "@/components/common";

const UsersPage = () => {

    return (
        <>
            <DateInput
                className="w-64"
                onChange={(date) => console.log("Selected date:", date)}
                onKeyDown={(e) => console.log("Key pressed:", e.key)}
                disabled={true}
                inputProps={{
                    placeholder: "dd/MM/yyyy",
                }}
            />
        </>
    );
};


export default UsersPage;

