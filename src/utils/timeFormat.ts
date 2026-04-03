
export const CaculateTimeFromTimeToNow = (timestamp?: number): string => {
    if (!timestamp) return "";
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    if (diffInSeconds < 5) {
        return "Vừa xong";
    }
    else if (diffInSeconds < 60) {
        return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} giờ trước`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ngày trước`;
    }
}

export const FormatDateShort = (dateString?: string): string => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${day} th ${month}`;
    } catch {
        return dateString;
    }
}
