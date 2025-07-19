import { Sidebar } from "lucide-react";
import { Header } from "./_components";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div>
                {children}
            </div>
        </>
    );
}

export default RootLayout;
