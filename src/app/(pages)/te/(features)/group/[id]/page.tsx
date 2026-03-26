
import BacklogPage from "../../../_components/pages/BacklogPage";

export default async function GroupDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <h1>Hello, World with param: {id}</h1>
      <BacklogPage />
    </>
  );
}
