import React from "react";
import { Card } from "./card";


export type CardItem = {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    isRoot?: boolean;
    iconIsRoot?: React.ReactNode;
    actions?: React.ReactNode;
    emptyText?: string;
};

type CardsProps = {
    cards: CardItem[];
};

export const Cards: React.FC<CardsProps> = ({ cards }) => {
    return (
        <div className="w-full">
            {cards.length === 0 ? (
                <div className="text-center text-gray-500 mt-20 py-4">
                    {cards[0]?.emptyText || "Không có dữ liệu để hiển thị."}
                </div>
            ) : (
                cards.map((card, index) => (
                    <Card
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        description={card.description}
                        isRoot={card.isRoot}
                        iconIsRoot={card.iconIsRoot}
                        actions={card.actions}
                    />
                ))
            )}
        </div>
    );
};
