import { useState } from "react";

export const useIndexPagination = (totalItems: number, page = 1, size = 6) => {
    const [pageIndex, setPageIndex] = useState(page);
    const totalPages = Math.ceil(totalItems / size);
    const startIndex = (pageIndex - 1) * size;
    const endIndex = startIndex + size;

    const setPage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPageIndex(newPage);
    }

    return {
        pageIndex,
        totalPages,
        startIndex: startIndex < 0 ? 0 : startIndex,
        endIndex: endIndex > totalItems ? totalItems : endIndex,
        hasNextPage: pageIndex < totalPages,
        hasPreviousPage: pageIndex > 1,
        setPage,
    };
}
