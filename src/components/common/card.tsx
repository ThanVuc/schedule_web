import React from "react";


type CardProps = {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    isRoot?:boolean;
    iconIsRoot?: React.ReactNode;
    actions?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({
    icon,
    title,
    description,
    isRoot,
    iconIsRoot,
    actions,
}) => {
    return (
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-xl shadow-sm border mb-4 gap-3">
            <div className="w-12 h-12 flex items-center juAstify-center rounded-full bg-gray-100 text-2xl">
                {icon}
            </div>
            <div className="flex-1">
                <div>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">{title}</span>
                        {/* {isRoot?.value && (
                            <span className="text-gray-500">
                              {isRoot.icon}
                            </span>
                        )} */}
                    {isRoot && (
                        <span className="text-gray-500">
                            {iconIsRoot}
                        </span>
                    )}
                    </div>
                    {description && (
                        <div className="text-sm text-gray-500">{description}</div>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap justify-start sm:justify-end gap-2">
                {actions}
            </div>
        </div>
    );
};
