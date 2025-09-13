import React from "react";
import { twMerge } from "tailwind-merge";

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsisThreshold = 5;
    const pageNeighbours = 1;

    pages.push(1);

    if (totalPages <= showEllipsisThreshold) {
      for (let i = 2; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSpill = currentPage - pageNeighbours > 2;
      const rightSpill = currentPage + pageNeighbours < totalPages - 1;

      if (leftSpill) pages.push(-1); // Ellipsis marker

      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (rightSpill) pages.push(-1); // Ellipsis marker
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return [...new Set(pages)];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={twMerge(
        "flex justify-center items-center gap-3 md:gap-4 mt-6 md:mt-8 text-xs md:text-base",
        className
      )}
    >
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {pageNumbers.map((page, index) =>
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={twMerge(
              "",
              currentPage === page
                ? "underline"
                : ""
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
