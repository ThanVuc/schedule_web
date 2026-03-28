
export type TabKey = "members" | "sprints" | "workboard" | "backlog" | "settings";

export interface TabConfig {
    key: TabKey;
    label: string;
}

export const GROUP_TABS: TabConfig[] = [
    { key: "members", label: "Thành viên" },
    { key: "sprints", label: "Sprints" },
    { key: "workboard", label: "Bảng công việc" },
    { key: "backlog", label: "Backlog" },
    { key: "settings", label: "Cài đặt" },
];