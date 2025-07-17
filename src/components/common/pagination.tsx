import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronsLeft, ChevronsRight } from "react-feather"; // or your icon library
import { useRouter, useSearchParams } from "next/navigation";

export interface PaginationComponentProps {
  page: number;
  has_next: boolean;
  has_prev: boolean;
  total_pages: number;
}

export const AppPagination: React.FC<PaginationComponentProps> = ({
  has_next,
  has_prev,
  total_pages,
}) => {
  const maxVisible = 5;
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const page = Math.max(1, Math.min(currentPage, total_pages));

  const onPageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, total_pages));
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", clamped.toString());
    router.push(`?${params.toString()}`);
  };


  const getPageNumbers = (currentPage: number, totalPages: number, maxVisible: number) => {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers(page, total_pages, maxVisible);
  const showStartEllipsis = pageNumbers[0] > 2;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < total_pages - 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          >
            <ChevronsLeft />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(page - 1)}
            className={!has_prev ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {showStartEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              isActive={pageNum === page}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEndEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(total_pages)}>{total_pages}</PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page + 1)}
            className={!has_next ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(total_pages)}
            className={page === total_pages ? "pointer-events-none opacity-50" : ""}
          >
            <ChevronsRight />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AppPagination;
