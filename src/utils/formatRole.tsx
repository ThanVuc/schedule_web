const FormatListRole = (roler: string | string[]) => {
    if (Array.isArray(roler)) {
        return roler.map(r => {
            switch (r.toLowerCase()) {
                case "admin":
                    return "Quản trị viên";
                case "user":
                    return "Người dùng";
                default:
                    return r;
            }
        }).join(", ");
    }
}

const FormatRole = (role: string) => {
    switch (role.toLowerCase()) {
        case "admin":
            return "Quản trị viên";
        case "user":
            return "Người dùng";
        case "editor":
            return "Biên tập viên";
        case "viewer":
            return "Người xem";
        default:
            return role;
    }
}

export { FormatRole, FormatListRole };
