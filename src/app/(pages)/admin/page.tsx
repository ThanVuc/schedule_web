import { redirect } from "next/navigation";

const AdminPage = () => {
    redirect("/admin/users");
};

export default AdminPage;