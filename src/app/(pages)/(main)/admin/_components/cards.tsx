import React from "react";
import { Card } from "./card";


export type CardItem = {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    isRoot?: boolean;
    iconIsRoot?: React.ReactNode;
    actions?: React.ReactNode;
};

type CardsProps = {
    cards: CardItem[];
};

export const Cards: React.FC<CardsProps> = ({ cards }) => {
    return (
        <div className="w-full">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                    isRoot={card.isRoot}
                    iconIsRoot={card.iconIsRoot}
                    actions={card.actions}
                />
            ))}
        </div>
    );
};
