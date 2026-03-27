import { GROUP_TABS, TabKey } from "../../../../te/_constants";
import BoardMemberPage from "../../../_components/features/group/member/BoardMemberPage";
import BoardSettingPage from "../../../_components/features/group/setting/BoardSettingPage";
import BoardSprints from "../../../_components/features/group/sprint/BoardSprintPage";
import { BoardWorkPage } from "../../../_components/features/group/work/index";
import { TabGroup } from "../../../_components/features/group/group-detail";
import BacklogPage from "../../../_components/pages/BacklogPage";

const TAB_COMPONENTS: Record<TabKey, React.ReactNode> = {
  members: <BoardMemberPage />,
  sprints: <BoardSprints />,
  workboard: <BoardWorkPage />,
  backlog: <BacklogPage />,
  settings: <BoardSettingPage />,
};

const VALID_TABS = GROUP_TABS.map((t) => t.key);

function resolveTab(raw: string | undefined): TabKey {
  return VALID_TABS.includes(raw as TabKey) ? (raw as TabKey) : "members";
}

export default async function GroupDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  const activeTab = resolveTab(tab);

  return (
    <>
      <TabGroup />
      <div key={activeTab}>
        {TAB_COMPONENTS[activeTab]}
      </div>
    </>
  );
}