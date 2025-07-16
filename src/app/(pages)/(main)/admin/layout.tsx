
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full min-h-screen bg-gray-50">
            <main>{children}</main>
        </div>
    );
}

export default AdminLayout;