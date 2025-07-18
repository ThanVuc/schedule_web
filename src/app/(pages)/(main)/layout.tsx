import { Sidebar } from "lucide-react";
import { Header } from "./_components";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="">
                {children}
            </div>
        </>
    );
}

export default RootLayout;
