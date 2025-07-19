import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    pageRangeDisplayed?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange, 
    pageRangeDisplayed = 5
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const renderPagination = () => {
        if (totalPages <= pageRangeDisplayed) {
            return [...Array(totalPages).keys()].map((pageNumber) => (
                <li key={pageNumber + 1}>
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            pageNumber + 1 === currentPage
                                ? "bg-black text-customYellow font-bold"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => onPageChange(pageNumber + 1)}
                    >
                        {pageNumber + 1}
                    </button>
                </li>
            ));
        }

        const pageNumbers = [];
        
        pageNumbers.push(
            <li key="first">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                        1 === currentPage
                            ? "bg-black text-customYellow font-bold"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => onPageChange(1)}
                >
                    1
                </button>
            </li>
        );

        if (currentPage > 3) {
            pageNumbers.push(
                <li key="start-ellipsis">
                    <span className="px-4 py-2 text-sm">...</span>
                </li>
            );
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i}>
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                            i === currentPage
                                ? "bg-black text-customYellow font-bold"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        if (currentPage < totalPages - 2) {
            pageNumbers.push(
                <li key="end-ellipsis">
                    <span className="px-4 py-2 text-sm">...</span>
                </li>
            );
        }

        pageNumbers.push(
            <li key="last">
                <button
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                        totalPages === currentPage
                            ? "bg-black text-customYellow font-bold"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </button>
            </li>
        );

        return pageNumbers;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav>
            <ul className="inline-flex items-center space-x-2">
                {renderPagination()}
            </ul>
        </nav>
    );
};

export default Pagination;