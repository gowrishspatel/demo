import React from "react";
import "../Pagination.css";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const getVisiblePages = () => {
        if (totalPages <= 3) {
            return [...Array(totalPages).keys()].map((page) => page + 1);
        }
        if (currentPage === 1) {
            return [1, 2, 3];
        } else if (currentPage === totalPages) {
            return [totalPages - 2, totalPages - 1, totalPages];
        } else {
            return [currentPage - 1, currentPage, currentPage + 1];
        }
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-arrow"
            >
                &laquo;
            </button>
            {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`pagination-button ${currentPage === page ? "active" : ""
                        }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-arrow"
            >
                &raquo;
            </button>
        </div>
    );
};

export default Pagination;
