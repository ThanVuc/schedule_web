# Module TE - Tài liệu hướng dẫn

## 📁 Cấu trúc thư mục

```
te/
├── layout.tsx                      # Layout chính của module
├── page.tsx                        # Trang chủ của module
├── readme.md                       # Tài liệu hướng dẫn
│
├── _components/                    # Thư mục chứa components
│   ├── common/                     # Components dùng chung trong module
│   │   └── index.ts
│   ├── features/                   # Components theo từng feature
│   │   ├── index.ts
│   │   ├── group/                  # Components cho feature Group
│   │   │   ├── index.ts
│   │   │   ├── group-detail/      # Components chi tiết group
│   │   │   │   └── index.ts
│   │   │   ├── sprint/            # Components sprint
│   │   │   │   └── index.ts
│   │   │   └── work/              # Components work
│   │   │       └── index.ts
│   │   ├── notification/          # Components cho feature Notification
│   │   │   └── index.ts
│   │   └── setting/               # Components cho feature Setting
│   │       └── index.ts
│   ├── modals/                     # Components modal/dialog
│   │   └── index.ts
│   ├── pages/                      # Components cấp page
│   │   └── index.ts
│   └── scss/                       # Styles SCSS
│       └── index.ts
│
├── _constants/                     # Hằng số, cấu hình
│   └── index.ts
│
├── _hooks/                         # Custom React hooks
│   └── index.ts
│
├── _models/                        # Data models, TypeScript interfaces
│   └── index.ts
│
├── _schema/                        # Validation schemas (Zod, Yup, etc.)
│   └── index.ts
│
├── _utils/                         # Utility functions
│   └── index.ts
│
└── (features)/                     # Next.js routes (App Router)
    ├── group/
    │   ├── page.tsx               # Route: /te/group
    │   └── [id]/
    │       └── page.tsx           # Route: /te/group/:id
    ├── notification/
    │   └── page.tsx               # Route: /te/notification
    └── setting/
        └── page.tsx               # Route: /te/setting
```

## 🧩 Nguyên tắc phân tách Components

### 1. **Phân loại Components theo mức độ**

#### **a) Common Components** (`_components/common/`)
- Components dùng chung trong toàn bộ module TE
- Có tính tái sử dụng cao
- Không phụ thuộc vào logic nghiệp vụ cụ thể

**Ví dụ:**
```typescript
// _components/common/Card.tsx
export function TeamCard({ title, children }) {
  return (
    <div className="team-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
```

#### **b) Feature Components** (`_components/features/`)
- Components chuyên biệt cho từng feature
- Chứa logic nghiệp vụ cụ thể
- Được nhóm theo feature (group, notification, setting)

**Ví dụ:**
```typescript
// _components/features/group/GroupList.tsx
export function GroupList({ groups }) {
  return (
    <div>
      {groups.map(group => (
        <GroupItem key={group.id} group={group} />
      ))}
    </div>
  );
}
```

#### **c) Modal Components** (`_components/modals/`)
- Các dialog, popup, modal
- Tương tác với người dùng
- Có thể được gọi từ nhiều nơi

**Ví dụ:**
```typescript
// _components/modals/CreateGroupModal.tsx
export function CreateGroupModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Modal content */}
    </Dialog>
  );
}
```

#### **d) Page Components** (`_components/pages/`)
- Components lớn, đại diện cho toàn bộ page
- Kết hợp nhiều components nhỏ
- Chứa layout và cấu trúc trang

**Ví dụ:**
```typescript
// _components/pages/GroupPage.tsx
export function GroupPageComponent() {
  return (
    <div>
      <GroupHeader />
      <GroupList />
      <GroupFooter />
    </div>
  );
}
```

### 2. **Nguyên tắc Single Responsibility**
Mỗi component chỉ nên đảm nhận một nhiệm vụ duy nhất:

```typescript
// ❌ Không nên: Component làm quá nhiều việc
function GroupDashboard() {
  // Logic fetch data
  // Logic xử lý form
  // Logic hiển thị list
  // Logic modal
  // ...rất nhiều logic khác
}

// ✅ Nên: Tách thành nhiều components
function GroupDashboard() {
  return (
    <>
      <GroupHeader />
      <GroupFilters />
      <GroupList />
      <CreateGroupButton />
    </>
  );
}
```

### 3. **Nguyên tắc Container/Presentation**

#### **Container Components:**
- Xử lý logic, state management
- Gọi API, hooks
- Truyền data xuống presentation components

#### **Presentation Components:**
- Chỉ nhận props và render UI
- Không chứa logic phức tạp
- Dễ test và tái sử dụng

```typescript
// Container
function GroupListContainer() {
  const { data, loading } = useGroups();
  
  if (loading) return <Spinner />;
  return <GroupListUI groups={data} />;
}

// Presentation
function GroupListUI({ groups }) {
  return (
    <div>
      {groups.map(g => <GroupCard key={g.id} {...g} />)}
    </div>
  );
}
```

## 📂 Cách tổ chức file và component

### 1. **Đặt file vào đúng vị trí**

| Loại file | Vị trí | Ví dụ |
|-----------|--------|-------|
| Component dùng chung | `_components/common/` | Button, Card, Table |
| Component cho feature Group | `_components/features/group/` | GroupList, GroupForm |
| Component chi tiết Group | `_components/features/group/group-detail/` | GroupInfo, GroupMembers |
| Modal | `_components/modals/` | CreateGroupModal, ConfirmDialog |
| Page component | `_components/pages/` | GroupPage, NotificationPage |
| Custom hook | `_hooks/` | useGroup, useNotification |
| Data model | `_models/` | Group.ts, User.ts |
| Validation schema | `_schema/` | groupSchema.ts |
| Utility function | `_utils/` | formatDate.ts, validator.ts |
| Constant | `_constants/` | API_ENDPOINTS, COLORS |
| Route page | `(features)/[feature-name]/` | group/page.tsx |

### 2. **Quy tắc đặt tên file**

```
- Components: PascalCase
  ✅ GroupList.tsx
  ✅ CreateGroupModal.tsx
  ❌ groupList.tsx
  ❌ create-group-modal.tsx

- Hooks: camelCase với prefix "use"
  ✅ useGroup.ts
  ✅ useNotification.ts
  ❌ UseGroup.ts

- Utils/Constants: camelCase
  ✅ formatDate.ts
  ✅ apiEndpoints.ts
  ❌ FormatDate.ts

- Models: PascalCase
  ✅ Group.ts
  ✅ User.ts

- Schemas: camelCase với suffix "Schema"
  ✅ groupSchema.ts
  ✅ userSchema.ts
```

### 3. **Cấu trúc Export với index.ts**

Mỗi thư mục nên có file `index.ts` để export components:

```typescript
// _components/features/group/index.ts
export { GroupList } from './GroupList';
export { GroupForm } from './GroupForm';
export { GroupCard } from './GroupCard';

// Sử dụng:
import { GroupList, GroupForm } from '@/app/(pages)/te/_components/features/group';
```

### 4. **Khi nào tạo thư mục con mới?**

Tạo thư mục con khi:
- Có **3+ components** liên quan chặt chẽ với nhau
- Components tạo thành một **sub-feature** rõ ràng
- Cần **tách biệt logic** phức tạp

**Ví dụ:**
```
_components/features/group/
  ├── index.ts
  ├── GroupList.tsx        # Component đơn lẻ
  ├── GroupCard.tsx        # Component đơn lẻ
  └── group-detail/        # Sub-feature với nhiều components
      ├── index.ts
      ├── GroupDetailHeader.tsx
      ├── GroupDetailInfo.tsx
      ├── GroupDetailMembers.tsx
      └── GroupDetailActivity.tsx
```

## 📚 Giải thích chi tiết các thư mục

### 🔸 `_components/`
**Mục đích:** Chứa tất cả React components của module

**Cấu trúc con:**

#### 📁 `common/`
- Components dùng chung trong module TE
- Không chứa logic nghiệp vụ cụ thể
- Có thể move ra global nếu dùng ở nhiều module
- **Ví dụ:** TeamCard, TeamButton, TeamTable, TeamInput

#### 📁 `features/`
- Components theo từng feature nghiệp vụ
- Mỗi feature có thư mục riêng
- Chứa logic nghiệp vụ cụ thể

**Sub-folders:**
- **`group/`:** Components cho quản lý nhóm (GroupList, GroupForm, GroupCard)
  - **`group-detail/`:** Components chi tiết nhóm (GroupInfo, GroupMembers, GroupSettings)
  - **`sprint/`:** Components quản lý sprint (SprintBoard, SprintCard)
  - **`work/`:** Components quản lý công việc (WorkList, WorkItem)
- **`notification/`:** Components thông báo (NotificationList, NotificationItem)
- **`setting/`:** Components cài đặt (SettingForm, SettingPanel)

#### 📁 `modals/`
- Dialog, Modal, Popup components
- **Ví dụ:** CreateGroupModal, DeleteConfirmModal, InviteMemberModal

#### 📁 `pages/`
- Components đại diện cho toàn bộ page
- Kết hợp nhiều components nhỏ
- **Ví dụ:** GroupPageComponent, NotificationPageComponent

#### 📁 `scss/`
- Style files (SCSS/CSS)
- Theme, variables, mixins
- **Ví dụ:** variables.scss, mixins.scss, team-theme.scss

---

### 🔸 `_constants/`
**Mục đích:** Định nghĩa các hằng số, cấu hình

**Nội dung:**
```typescript
// _constants/index.ts
export const GROUP_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export const API_ENDPOINTS = {
  GROUPS: '/api/groups',
  NOTIFICATIONS: '/api/notifications',
};

export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#6b7280',
};
```

**Khi nào dùng:**
- Giá trị không thay đổi trong runtime
- Cấu hình, enum, status codes
- API endpoints
- Default values

---

### 🔸 `_hooks/`
**Mục đích:** Custom React hooks

**Ví dụ:**
```typescript
// _hooks/useGroup.ts
export function useGroup(groupId: string) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchGroup(groupId).then(setGroup).finally(() => setLoading(false));
  }, [groupId]);
  
  return { group, loading };
}

// _hooks/useNotification.ts
export function useNotification() {
  const [notifications, setNotifications] = useState([]);
  // ... logic
  return { notifications, markAsRead, deleteNotification };
}
```

**Nguyên tắc:**
- Tên bắt đầu bằng "use"
- Tái sử dụng logic giữa nhiều components
- Encapsulate side effects

---

### 🔸 `_models/`
**Mục đích:** TypeScript interfaces, types, data models

**Ví dụ:**
```typescript
// _models/Group.ts
export interface Group {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  members: Member[];
  status: GroupStatus;
}

export type GroupStatus = 'active' | 'inactive' | 'archived';

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
}

export type MemberRole = 'owner' | 'admin' | 'member';
```

**Nguyên tắc:**
- Define data structures
- Shared types across module
- Improve type safety

---

### 🔸 `_schema/`
**Mục đích:** Validation schemas (Zod, Yup, etc.)

**Ví dụ:**
```typescript
// _schema/groupSchema.ts
import { z } from 'zod';

export const groupSchema = z.object({
  name: z.string().min(3, 'Tên nhóm phải có ít nhất 3 ký tự'),
  description: z.string().optional(),
  members: z.array(z.string()).min(1, 'Nhóm phải có ít nhất 1 thành viên'),
});

export type GroupFormData = z.infer<typeof groupSchema>;
```

**Khi nào dùng:**
- Validate form inputs
- API request/response validation
- Type-safe validation

---

### 🔸 `_utils/`
**Mục đích:** Utility functions, helper functions

**Ví dụ:**
```typescript
// _utils/formatDate.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN').format(date);
}

// _utils/groupHelpers.ts
export function getGroupMemberCount(group: Group): number {
  return group.members.length;
}

export function isGroupOwner(group: Group, userId: string): boolean {
  return group.members.some(m => m.id === userId && m.role === 'owner');
}
```

**Nguyên tắc:**
- Pure functions (không side effects)
- Reusable logic
- Business logic helpers

---

### 🔸 `(features)/`
**Mục đích:** Next.js App Router routes

**Giải thích:**
- Dấu `()` trong Next.js = route group (không ảnh hưởng URL)
- Mỗi `page.tsx` = một route endpoint
- `[id]` = dynamic route parameter

**Routes:**
```
(features)/group/page.tsx           → /te/group
(features)/group/[id]/page.tsx      → /te/group/:id
(features)/notification/page.tsx    → /te/notification
(features)/setting/page.tsx         → /te/setting
```

**Ví dụ page.tsx:**
```typescript
// (features)/group/page.tsx
import { GroupPageComponent } from '@/app/(pages)/te/_components/pages';

export default function GroupPage() {
  return <GroupPageComponent />;
}
```

---

## 🚀 Workflow phát triển feature mới

### Bước 1: Tạo data model
```typescript
// _models/Sprint.ts
export interface Sprint {
  id: string;
  name: string;
  groupId: string;
  startDate: Date;
  endDate: Date;
}
```

### Bước 2: Tạo validation schema
```typescript
// _schema/sprintSchema.ts
export const sprintSchema = z.object({
  name: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
});
```

### Bước 3: Tạo constants (nếu cần)
```typescript
// _constants/sprint.ts
export const SPRINT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;
```

### Bước 4: Tạo custom hooks
```typescript
// _hooks/useSprint.ts
export function useSprint(sprintId: string) {
  // Logic fetch, update sprint
}
```

### Bước 5: Tạo components
```typescript
// _components/features/group/sprint/SprintList.tsx
// _components/features/group/sprint/SprintCard.tsx
// _components/features/group/sprint/SprintForm.tsx
```

### Bước 6: Tạo route page
```typescript
// (features)/sprint/page.tsx
export default function SprintPage() {
  return <SprintPageComponent />;
}
```

---

## ✅ Checklist khi tạo component mới

- [ ] Component đặt đúng thư mục theo phân loại
- [ ] Tên file theo convention (PascalCase cho component)
- [ ] Export qua `index.ts` của thư mục
- [ ] Có TypeScript types/interfaces rõ ràng
- [ ] Component tách biệt logic và presentation (nếu phức tạp)
- [ ] Reusable và không hard-code values
- [ ] Comment/document nếu logic phức tạp

---

## 📖 Tài liệu tham khảo thêm

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Components Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript with React](https://react.dev/learn/typescript)

---

**Cập nhật lần cuối:** 7/3/2026
