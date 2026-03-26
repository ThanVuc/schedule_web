import { useSearchParams } from 'next/navigation';

export function useModalParams() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const id = searchParams.get('id');
  const workId = searchParams.get("workId");
  return { mode, id, workId };
}
