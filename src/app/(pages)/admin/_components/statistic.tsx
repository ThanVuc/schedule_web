import { H1, Muted } from "@/components/common";
import { Card, CardContent } from "@/components/ui";


export interface StatisticCardOption {
    title: string;
    value: number;
    icon: React.ReactNode;
    description: string;
}

export const Statistic = (
    {
        statisticOptions = []
    }:
    {
        statisticOptions?: StatisticCardOption[];
    }
) => {
    return (
        <div className="statistic flex flex-col md:flex-row gap-4 py-2 px-4 bg-white rounded-lg shadow-md border border-gray-200">
            {/* Circle Section */}
            <div className="w-full md:w-[20%] flex justify-center items-center shrink-0">
                <div className="w-30 aspect-square rounded-full border-10 border-amber-300 flex items-center justify-center text-base font-bold">
                    <H1>{statisticOptions[0]?.value}</H1>
                </div>
            </div>
            {/* Cards Section */}
            <div className="w-full md:w-[80%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {statisticOptions.map((option, index) => (
                    <Card key={index} className="w-full py-2">
                        <CardContent className="flex flex-col items-center gap-1">
                            <div className="icon mb-1">{option.icon}</div>
                            <p className="text-xl font-bold">{option.value}</p>
                            <h3 className="text-lg font-semibold">{option.title}</h3>
                            <Muted className="text-center text-xs text-gray-500 mt-1">
                                {option.description}
                            </Muted>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>


    );
}