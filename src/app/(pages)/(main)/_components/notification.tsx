"use client";


interface NotificationProps {
    message: string;
    type: boolean;
    onOpen: boolean;
    setOnOpen: (value: boolean) => void;
}

const Notifications = ({ message, type, onOpen, setOnOpen }: NotificationProps) => {

    return (
        <div
            className={`
                fixed top-4 right-4 z-50 rounded-xl p-3 mr-2 flex w-fit shadow-lg transition-all
                border-l-4
                ${type ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}
                ${onOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'}
            `}
        >
            <p className="mr-4">{message}</p>
            <button onClick={() => setOnOpen(false)}>✕</button>
        </div>
    );
};

export default Notifications;
