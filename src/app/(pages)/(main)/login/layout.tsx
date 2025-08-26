export const metadata = {
    title: "Đăng Nhập | Schedulr",
    description: "Đăng nhập để sử dụng các tính năng của Schedulr",
}

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {children}
        </div>
    );
}

export default LoginLayout;