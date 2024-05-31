import React from "react";
import { Pagination } from "react-bootstrap";
import "./Pagination.css";


const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <Pagination className="justify-content-center pagination-container">
      <Pagination.Prev
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1} 
      />
      {[...Array(totalPages).keys()].map((page) => (
        <Pagination.Item
          key={page + 1}
          active={currentPage === page + 1}
          onClick={() => handlePageChange(page + 1)}
        >
          {page + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

export default CustomPagination;
