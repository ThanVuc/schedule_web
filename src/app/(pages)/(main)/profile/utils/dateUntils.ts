export const formatDate = {
    // string ("dd/mm/yyyy") -> Date
    stringToDate: (input?: string | null): Date | null => {
        if (!input) return null;
        const [day, month, year] = input.split("/").map(Number);
        if (!day || !month || !year) return null;
        return new Date(year, month - 1, day);
    },

    // Date -> string ("dd/mm/yyyy")
    dateToString: (input?: Date | string | number | null): string => {
        if (!input) return "";
        const date = input instanceof Date ? input : new Date(input);
        if (isNaN(date.getTime())) return "";

        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    },

    // number (timestamp) -> string ("dd/mm/yyyy")
    numberToString: (input?: number | null): string => {
        if (!input) return "";
        const date = new Date(input.toString().length === 10 ? input * 1000 : input);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },

    // string ("dd/mm/yyyy") -> number (timestamp)
    stringToNumber: (input?: string | null): number | null => {
        const d = formatDate.stringToDate(input);
        return d ? d.getTime() : null;
    },

    // number (timestamp) -> Date
    numberToDate: (input?: number | null): Date | null => {
        if (!input) return null;
        return new Date(input.toString().length === 10 ? input * 1000 : input);
    },

    // Date -> number (timestamp)
    dateToNumber: (input?: Date | string | number | null): number | null => {
        if (!input) return null;
        const date = input instanceof Date ? input : new Date(input);
        return isNaN(date.getTime()) ? null : date.getTime();
    },

    // Date -> ISO string ("yyyy-mm-dd")
    dateToISO: (input?: Date | string | number | null): string => {
        if (!input) return "";
        const date = input instanceof Date ? input : new Date(input);
        return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
    },

    // ISO string ("yyyy-mm-dd") -> Date
    isoToDate: (input?: string | null): Date | null => {
        if (!input) return null;
        const date = new Date(input);
        return isNaN(date.getTime()) ? null : date;
    },

    // ISO string ("yyyy-mm-dd") -> number (timestamp)
    isoToNumber: (input?: string | null): number | null => {
        const d = formatDate.isoToDate(input);
        return d ? d.getTime() : null;
    },

    // number (timestamp) -> ISO string ("yyyy-mm-dd")
    numberToISO: (input?: number | null): string => {
        const d = formatDate.numberToDate(input);
        return d ? formatDate.dateToISO(d) : "";
    }
};
