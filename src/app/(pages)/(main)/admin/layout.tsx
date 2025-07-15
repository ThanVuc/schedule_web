
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="admin-layout">
            <header>
                <h1>Admin Dashboard</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>&copy; 2023 Admin Panel</p>
            </footer>
        </div>
    );
}

export default AdminLayout;