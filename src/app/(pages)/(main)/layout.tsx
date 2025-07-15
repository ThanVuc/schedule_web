import { Footer, Header } from "./_components";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}

export default RootLayout;
