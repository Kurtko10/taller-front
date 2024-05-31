import React from "react";
import Form from 'react-bootstrap/Form';

//----------------------------------------

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="w-40">
      <Form.Control
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="me-1 search"
      />
    </div>
  );
};

export default SearchInput;


