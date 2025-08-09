import { useSearchParams } from 'next/navigation';

export function useModalParams() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const id = searchParams.get('id');
  return { mode, id };
}
