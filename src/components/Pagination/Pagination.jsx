import React from "react";
import { Pagination } from "react-bootstrap";
import "./Pagination.css";

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <Pagination className="justify-content-center pagination-container">
      <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

      {currentPage > 2 && <Pagination.Ellipsis disabled />}
      {currentPage > 1 && (
        <Pagination.Item onClick={() => handlePageChange(currentPage - 1)}>
          {currentPage - 1}
        </Pagination.Item>
      )}

      <Pagination.Item active>{currentPage}</Pagination.Item>

      {currentPage < totalPages && (
        <Pagination.Item onClick={() => handlePageChange(currentPage + 1)}>
          {currentPage + 1}
        </Pagination.Item>
      )}
      {currentPage < totalPages - 1 && <Pagination.Ellipsis disabled />}

      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  );
};

export default CustomPagination;
