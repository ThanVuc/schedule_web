'use client';
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';
interface BoardColumnProps {
    id: string;
    title: string;
    count: number;
    children: React.ReactNode;
}

const BoardColumn = ({ id, title, count, children }: BoardColumnProps) => {
    const { ref, isDropTarget } = useDroppable({
        id,
        type: 'item',
        collisionPriority: CollisionPriority.Low,
        accept: ['item', 'column'],
    });
    const style = isDropTarget ? { background: '#00000030' } : undefined;
    const shouldScroll = count > 3;
    return (
        <div
            style={style}
            ref={ref}
            className={`border-1 rounded-2xl min-h-[480px] min-w-[360px] transition-colors ${isDropTarget ? 'border-blue-500 bg-[#1A2332]/50' : 'border-[#2A3A4F]'
                }`}
        >
            <div className="flex items-center justify-between m-3">
                <p className="font-medium">{title}</p>
                <p className="p-2 bg-[#1A2332] rounded-md text-[#8899AA]">{count}</p>
            </div>
            <div className={`min-h-[150px] p-3 ${shouldScroll ? 'max-h-[420px] overflow-y-auto ' : ''}`}>
                {children}
            </div>
        </div>
    );
}

export default BoardColumn;