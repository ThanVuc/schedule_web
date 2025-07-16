import { Sidebar } from "lucide-react";
import { Header } from "./_components";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <div className="ml-50">
                {children}
            </div>
        </>
    );
}

export default RootLayout;
